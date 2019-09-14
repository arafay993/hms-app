import React from 'react';
import classnames from 'classnames';
import axios from 'axios';
import { Redirect, NavLink } from 'react-router-dom';
import "@kenshooui/react-multi-select/dist/style.css";
import MultiSelect from "@kenshooui/react-multi-select";

export default class RecipeForm extends React.Component {

	constructor(props) {
        super(props);
        
        const all_ingredients = [
            {id: 1, label: 'spices', group: 'inventory', price: 20},
            {id: 2, label: 'herbs', group: 'inventory', price: 30},
            {id: 5, label: 'dairy', group: 'intermediate', 
                madeof: [
                    {id: 3, label: 'milk', group: 'inventory', price: 12},
                    {id: 4, label: 'yougurt', group: 'inventory', price: 15},
                ]
            },
            {id: 6, label: 'sugar', group: 'inventory', price: 40},
        ];

		this.state = {
			id: null,
			name: '',
			recipe: '',
            ingredients: [],
            all_ingredients: all_ingredients,
			errors: {},
			loading: false,
			redirect: false
        }
    
		this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
    }

    componentDidMount() {

		if (this.props.match && this.props.match.params && typeof this.props.match.params.id !== "undefined") {
            //this.props.fetchBand(this.props.match.params.id);
            axios.get('/recipe/'+this.props.match.params.id)
            .then(response => {
                this.setState({
                    id: response.data.id,
                    name: response.data.name,
                    recipe: response.data.recipe,
                    ingredients: response.data.ingredients
                });
            })
            .catch(function (error) {
                console.log(error);
            })
            //TODO:set the dummy data
            this.setState({
                id: 1,
                name: 'Tania',
                recipe: 'floppydiskette',
                //for multi-select to work, change name -> label and type -> group
                ingredients: [
                    {id: 1, label: 'spices', group: 'inventory', price: 20},
                    {id: 5, label: 'dairy', group: 'intermediate', 
                        madeof: [
                            {id: 3, label: 'milk', group: 'inventory', price: 12},
                            {id: 4, label: 'yougurt', group: 'inventory', price: 15},
                        ]
                    },
                ]
            });
        }
    }

    handleChange(e) {
		this.setState({ [e.target.name]: e.target.value });
    }
    
    handleMultiSelectChange (selectedItems){
        this.setState({ingredients : selectedItems});
    }
    
    handleSubmit(e) {
		e.preventDefault();
		let errors = {};
		// Validation
		if (this.state.name === '') errors.name = "This field can't be empty";
        if (this.state.recipe === '') errors.recipe = "This field can't be empty";
        if (this.state.ingredients.length == 0 ) errors.ingredients = "This field can't be empty";

		// Fill the errors object state
		this.setState({ errors });

		// Proceed if everything is OK
		if (Object.keys(errors).length === 0) {
            const { id, name, recipe, ingredients } = this.state;
            const obj = { id, name, recipe, ingredients }
			this.setState({ loading: true });
			//this.props.saveBand({ id, title, year, description });

			if (!id) {
                axios.post('/recipe/new/', obj)
                .then(() => this.setState({ redirect: true }))
                .catch(error => console.log(error));
            }
			else {
                axios.post('/recipe/update/'+this.props.match.params.id, obj)
                .then(() => this.setState({ redirect: true }))
                .catch(error => console.log(error));
            }
		}
    }
    
    render() {
		return (
			<div>
				{
					// Redirect if some action has worked succesfully, render if not
					this.state.redirect ?
						<Redirect to="/recipe" /> :
						<div className="ui container">
							<h1>Recipe Registration</h1>
							<NavLink exact to="/recipies/" className="ui button">Back to Recipe list</NavLink>
							<br /><br />
							<form className={classnames("ui", "form", { loading: this.state.loading })} onSubmit={this.handleSubmit}>

								<h4 className="ui dividing header">Fill the form below with the Recipe information</h4>

								{!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}

								<div className={classnames("field", { error: !!this.state.errors.name })}>
									<label htmlFor="title">Name</label>
									<input
										type="text" id="name" name="name"
										value={this.state.name}
										className="ui input"
										placeholder="The name of the Menu Item"
										onChange={this.handleChange}
									/>
									<span>{this.state.errors.name}</span>
								</div>

								<div className={classnames("field", { error: !!this.state.errors.recipe })}>
									<label htmlFor="recipe">recipe</label>
									<input
										type="text" id="recipe" name="recipe"
										value={this.state.recipe}
										className="ui input"
										placeholder="The name of the Recipe"
										onChange={this.handleChange}
									/>
									<span>{this.state.errors.recipe}</span>
								</div>

                                <div className={classnames("field", { error: !!this.state.errors.ingredients })}>
									<label htmlFor="ingredients">ingredients</label>
                                    <MultiSelect
                                        items={this.state.all_ingredients}
                                        selectedItems={this.state.ingredients}
                                        onChange={this.handleMultiSelectChange}
                                        withGrouping={true}
                                    />
									<span>{this.state.errors.ingredients}</span>
								</div>

								<div className="field">
									<button type="submit" className="ui primary button">Save</button>
								</div>
							</form>
						</div>
				}
			</div>
		);
	}
}