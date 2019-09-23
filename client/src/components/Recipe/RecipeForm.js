import React from 'react';
import classnames from 'classnames';
import axios from 'axios';
import { Redirect, NavLink } from 'react-router-dom';
import "@kenshooui/react-multi-select/dist/style.css";
import MultiSelect from "@kenshooui/react-multi-select";
import getPriceByIngredients from '../../utils/common';

export default class RecipeForm extends React.Component {

	constructor(props) {
        super(props);

		this.state = {
			id: null,
			name: '',
			recipe: '',
            ingredients: [],
            selling_price: 0,
            price: 0,
            all_ingredients: [],
			errors: {},
			loading: false,
			redirect: false
        }
        
		//Fetch all ingredients in a multi-select field
        let fetch_ingredient_url = '/api/ingredient/'
        axios.get(fetch_ingredient_url)
        .then(response => {
          this.setState({ all_ingredients: response.data.ingredients });
        })
        .catch(function (error) {
          console.log(error);
		})
    
		this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
    }

    componentDidMount() {

		if (this.props.match && this.props.match.params && typeof this.props.match.params.id !== "undefined") {

			//Fetch Recipe by Id
            axios.get('/api/recipies/'+this.props.match.params.id)
            .then(response => {
				console.log(response);
                this.setState({
                    id: response.data.recipies.id,
                    name: response.data.recipies.name,
                    recipe: response.data.recipies.recipe,
                    ingredients: response.data.recipies.ingredients,
					selling_price: response.data.recipies.selling_price,
                    price: getPriceByIngredients(response.data.recipies.ingredients)
                });
            })
            .catch(function (error) {
                console.log(error);
            })
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
    }
    
    handleSubmit(e) {
		e.preventDefault();
		let errors = {};
		// Validation on the Recipe's field
		if (this.state.name === '') errors.name = "This field can't be empty";
        if (this.state.recipe === '') errors.recipe = "This field can't be empty";
        if (this.state.ingredients.length == 0 ) errors.ingredients = "This field can't be empty";
        if (this.state.selling_price <= this.state.price) errors.selling_price = "For maximum profit, selling price must be higher than cost price"

		// Fill the errors object state
		this.setState({ errors });

		// Proceed if everything is OK
		if (Object.keys(errors).length === 0) {
            const { id, name, recipe, selling_price, ingredients } = this.state;
            const obj = { id, name, recipe,selling_price, ingredients }
			this.setState({ loading: true });

			if (!id) {
                axios.post('/api/recipies/', obj)
                .then(() => this.setState({ redirect: true }))
                .catch(error => console.log(error));
            }
			else {
                axios.put('/api/recipies/'+this.props.match.params.id, obj)
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
						<Redirect to="/recipies/" /> :
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
									<label htmlFor="recipe">Recipe</label>
									<input
										type="text" id="recipe" name="recipe"
										value={this.state.recipe}
										className="ui input"
										placeholder="The name of the Recipe"
										onChange={this.handleChange}
									/>
									<span>{this.state.errors.recipe}</span>
								</div>

                                <div className={classnames("field", { error: !!this.state.errors.selling_price })}>
									<label htmlFor="price">Selling Price</label>
									<input
										type="number" id="selling_price" name="selling_price"
										value={this.state.selling_price}
										className="ui input"
										placeholder="The cost selling_price"
										onChange={this.handleChange}
									/>
									<span>{this.state.errors.selling_price}</span>
								</div>

                                <div className={classnames("field", { error: !!this.state.errors.price })}>
									<label htmlFor="price">Cost Price</label>
									<input
										type="number" id="price" name="price"
										value={this.state.price} readOnly
										className="ui input"
										placeholder="The cost price"
										onChange={this.handleChange}
									/>
									<span>{this.state.errors.price}</span>
								</div>

                                <div className={classnames("field", { error: !!this.state.errors.ingredients })}>
									<label htmlFor="ingredients">Ingredients</label>
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