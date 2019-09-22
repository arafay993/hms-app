import React from 'react';
import classnames from 'classnames';
import axios from 'axios';
import { Redirect, NavLink } from 'react-router-dom';
import "@kenshooui/react-multi-select/dist/style.css";
import MultiSelect from "@kenshooui/react-multi-select";
import getPriceByIngredients from '../../../utils/common';
import { Dropdown } from 'semantic-ui-react'

export default class IngredientForm extends React.Component {

	constructor(props) {
        super(props);

		this.state = {
			id: null,
			label: '',
			group: 'inventory',
            madeof: [],
            price: 0,
            all_ingredients: [],
			errors: {},
			loading: false,
			redirect: false
        }

        //Fetch all ingredients list
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
        this.handleDropdown = this.handleDropdown.bind(this);
    }

    componentDidMount() {

		if (this.props.match && this.props.match.params && typeof this.props.match.params.id !== "undefined") {
            //Fetch ingredient by Id for updation
            axios.get('/api/ingredient/'+this.props.match.params.id)
            .then(response => {
                this.setState({
                    id: response.data.ingredient.id,
                    label: response.data.ingredient.label,
                    group: response.data.ingredient.group,
                    madeof: response.data.ingredient.madeof,
                    price: response.data.ingredient.group=='intermediate' ? getPriceByIngredients(response.data.ingredient.madeof) : response.data.ingredient.price
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
            madeof : selectedItems,
            price: getPriceByIngredients(selectedItems)
        });
        console.log(getPriceByIngredients(selectedItems));
    }
    
    handleDropdown(e, data){
        this.setState({ group : data.value });

    }

    handleSubmit(e) {
		e.preventDefault();
		let errors = {};
		// Validation on Ingredient's field
		if (this.state.label === '') errors.label = "This field can't be empty";
        if (this.state.group === '') errors.group = "This field can't be empty";
        if (this.state.group == 'intermediate' && this.state.madeof.length == 0 ) 
            errors.madeof = "This field can't be empty";

		// Fill the errors object state
		this.setState({ errors });

		// Proceed if everything is OK
		if (Object.keys(errors).length === 0) {
            const { id, label, group, madeof, price } = this.state;
            const obj = { id, label, group, madeof, price}
			this.setState({ loading: true });

			if (!id) {
                //Create the Ingredient record
                axios.post('/api/ingredient/', obj)
                .then(() => this.setState({ redirect: true }))
                .catch(error => console.log(error));
            }
			else {
                //Update the Ingredient record
                axios.put('/api/ingredient/'+this.props.match.params.id, obj)
                .then(() => this.setState({ redirect: true }))
                .catch(error => console.log(error));
            }
		}
    }
    
    render() {
        //show the multi-select field
        const is_intermediate = this.state.group == 'intermediate'
        const options = [
            { key: 1, text: 'inventory', value: 'inventory' },
            { key: 2, text: 'intermediate', value: 'intermediate' }
          ]
        //assing selected value to dropdown field
        const selected = this.state.group

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
                                    <Dropdown name="group" clearable options={options}
                                     selection onChange={this.handleDropdown} 
                                     value={selected} />
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

                                { is_intermediate && (<div className={classnames("field", { error: !!this.state.errors.madeof })}>
									<label htmlFor="ingredients">Ingredients</label>
                                    <MultiSelect
                                        items={this.state.all_ingredients}
                                        selectedItems={this.state.madeof}
                                        onChange={this.handleMultiSelectChange}
                                        withGrouping={true}
                                    />
									<span>{this.state.errors.madeof}</span>
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