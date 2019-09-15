import React from 'react';
import classnames from 'classnames';
import axios from 'axios';
import { Redirect, NavLink } from 'react-router-dom';
import "@kenshooui/react-multi-select/dist/style.css";
import MultiSelect from "@kenshooui/react-multi-select";
import getPriceByIngredients from '../../../utils/common';

export default class IngredientForm extends React.Component {

	constructor(props) {
        super(props);
        
        const all_ingredients = [
            {id: 1, label: 'spices', group: 'inventory', price: 20},
            {id: 2, label: 'herbs', group: 'inventory', price: 30},
            {id: 5, label: 'dairy', group: 'intermediate', 
                madeof: [
                    {id: 3, label: 'milk', group: 'inventory', price: 12},
                    {id: 4, label: 'yougurt', group: 'intermediate',
                    madeof: [
                        {id: 3, label: 'milk', group: 'inventory', price: 12},
                        {id: 7, label: 'bacteria', group: 'inventory', price: 6},
                    ]},
                ]
            },
            {id: 6, label: 'sugar', group: 'inventory', price: 40},
        ];

		this.state = {
			id: null,
			label: '',
			group: '',
            ingredients: [],
            price: 0,
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
            axios.get('/ingredient/'+this.props.match.params.id)
            .then(response => {
                this.setState({
                    id: response.data.id,
                    label: response.data.label,
                    group: response.data.group,
                    ingredients: response.data.ingredients,
                    price: response.data.group=='intermediate' ? getPriceByIngredients(response.data.ingredients) : response.data.price
                });
            })
            .catch(function (error) {
                console.log(error);
            })
            //TODO:set the dummy data
            let ingredients = [
                    {id: 1, label: 'spices', group: 'inventory', price: 20},
                    {id: 5, label: 'dairy', group: 'intermediate', 
                        madeof: [
                            {id: 3, label: 'milk', group: 'inventory', price: 12},
                            {id: 4, label: 'yougurt', group: 'intermediate',
                            madeof: [
                                {id: 3, label: 'milk', group: 'inventory', price: 12},
                                {id: 7, label: 'bacteria', group: 'inventory', price: 6},
                            ]},
                        ]
                    },
                ]
            this.setState({
                id: 1,
                label: 'spices',
                group: 'inventory',
                //for multi-select to work, change name -> label and type -> group
                ingredients: [],
                price: 20
            });
        }
    }

    handleChange(e) {
		this.setState({ [e.target.name]: e.target.value });
    }
    
    handleMultiSelectChange (selectedItems){
        this.setState({
            ingredients : selectedItems,
            price: getPriceByIngredients(selectedItems)
        });
        console.log(getPriceByIngredients(selectedItems));
    }
    
    handleSubmit(e) {
		e.preventDefault();
		let errors = {};
		// Validation
		if (this.state.label === '') errors.label = "This field can't be empty";
        if (this.state.group === '') errors.group = "This field can't be empty";
        if (this.state.group == 'intermediate' && this.state.ingredients.length == 0 ) 
            errors.ingredients = "This field can't be empty";

		// Fill the errors object state
		this.setState({ errors });

		// Proceed if everything is OK
		if (Object.keys(errors).length === 0) {
            const { id, label, group, ingredients, price } = this.state;
            const obj = { id, label, group, ingredients, price}
			this.setState({ loading: true });
			//this.props.saveBand({ id, title, year, description });

			if (!id) {
                axios.post('/ingredient/new/', obj)
                .then(() => this.setState({ redirect: true }))
                .catch(error => console.log(error));
            }
			else {
                axios.post('/ingredient/update/'+this.props.match.params.id, obj)
                .then(() => this.setState({ redirect: true }))
                .catch(error => console.log(error));
            }
		}
    }
    
    render() {
        const is_intermediate = this.state.group == 'intermediate'

		return (
			<div>
				{
					// Redirect if some action has worked succesfully, render if not
					this.state.redirect ?
						<Redirect to="/recipe/all/ingredients/" /> :
						<div className="ui container">
							<h1>Recipe Registration</h1>
							<NavLink exact to="/recipe/all/ingredients/" className="ui button">Back to Ingredient list</NavLink>
							<br /><br />
							<form className={classnames("ui", "form", { loading: this.state.loading })} onSubmit={this.handleSubmit}>

								<h4 className="ui dividing header">Fill the form below with the Ingredient information</h4>

								{!!this.state.errors.global && <div className="ui negative message"><p>{this.state.errors.global}</p></div>}

								<div className={classnames("field", { error: !!this.state.errors.label })}>
									<label htmlFor="title">Label</label>
									<input
										type="text" id="label" name="label"
										value={this.state.label}
										className="ui input"
										placeholder="The Label of the Ingredient"
										onChange={this.handleChange}
									/>
									<span>{this.state.errors.label}</span>
								</div>

								<div className={classnames("field", { error: !!this.state.errors.group })}>
									<label htmlFor="recipe">Group</label>
									<input
										type="text" id="group" name="group"
										value={this.state.group}
										className="ui input"
										placeholder="The name of the Group"
										onChange={this.handleChange}
									/>
									<span>{this.state.errors.group}</span>
								</div>

                                <div className={classnames("field", { error: !!this.state.errors.price })}>
									<label htmlFor="price">Cost Price</label>
									<input
										type="number" id="price" name="price"
										value={this.state.price}
										className="ui input"
										placeholder="The cost price"
										onChange={this.handleChange}
									/>
									<span>{this.state.errors.price}</span>
								</div>

                                { is_intermediate && (<div className={classnames("field", { error: !!this.state.errors.ingredients })}>
									<label htmlFor="ingredients">Ingredients</label>
                                    <MultiSelect
                                        items={this.state.all_ingredients}
                                        selectedItems={this.state.ingredients}
                                        onChange={this.handleMultiSelectChange}
                                        withGrouping={true}
                                    />
									<span>{this.state.errors.ingredients}</span>
								</div>)}

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