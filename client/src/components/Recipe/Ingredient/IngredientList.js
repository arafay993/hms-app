import React from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import IngredientCard from './IngredientCard';
import axios from 'axios';
import getPriceByIngredients from '../../../utils/common' 


export default class IngredientList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ingredients : []
        }
        this.filterIngredient = this.filterIngredient.bind(this);
        //this.deleteIngredient = this.deleteIngredient.bind(this);
    }
	/**
	 * Fetch all recipies on component load
	 */
	componentDidMount() {
        let fetch_ingredient_url = '/api/ingredient/'
        if (this.props.match && this.props.match.params && typeof this.props.match.params.id !== "undefined") {
            fetch_ingredient_url = `/api/recipies/${this.props.match.params.id}/ingredients`
            //fetch_ingredient_url = `/api/recipe/${this.props.match.params.id}`
        }
        axios.get(fetch_ingredient_url)
        .then(response => {
          this.setState({ ingredients: response.data.ingredients });
        })
        .catch(function (error) {
          console.log(error);
		})
		//set the dummy data
        // const ingredients = [
        //     {id: 1, label: 'spices', group: 'inventory', price: 20},
        //     {id: 2, label: 'herbs', group: 'inventory', price: 30},
        //     {id: 5, label: 'dairy', group: 'intermediate', 
        //         madeof: [
        //             {id: 3, label: 'milk', group: 'inventory', price: 12},
        //             {id: 4, label: 'yougurt', group: 'intermediate',
        //             madeof: [
        //                 {id: 3, label: 'milk', group: 'inventory', price: 12},
        //                 {id: 7, label: 'bacteria', group: 'inventory', price: 6},
        //             ]},
        //         ]
        //     },
        //     {id: 6, label: 'sugar', group: 'inventory', price: 40},
        // ];

		// this.setState({
		// 	ingredients : ingredients
		// })
    }

    filterIngredient(id){

        let filter_ingredient = this.state.ingredients.filter(item => item.id == Number(id))[0]
        console.log(filter_ingredient)
        this.setState({
           ingredients : filter_ingredient.madeof
        })
    }
    // deleteIngredient(id){
    //     console.log('delete')
	// 	axios.get('/ingredient/delete/'+id)
	// 	.then(response => {
	// 		this.setState({
	// 		ingredients: this.state.ingredients.filter(item => item.id !== Number(id))
	// 		})
	// 	})
	// 	.catch(err => console.log(err))

	// }

	render() {
        const is_view_recipe = this.props.match.params.id
		let ingredientCards = "";
		if (this.state.ingredients) {
			ingredientCards = (
				<div className="ui three cards">
					{
						!!this.state.ingredients && this.state.ingredients.map((ingredient) => {
                            return (<IngredientCard key={ingredient.id} ingredient={ingredient} 
                                filterIngredient={this.filterIngredient}/>);
						})
					}
				</div>
			);
		}

		const emptyMessage = (
			<div className="ui info message">There is no ingredient registered yet.</div>
		);

		return (
			<div className="ui container">
				{
						<div>
                            <NavLink exact to="/recipies/" className="ui button">Back to Recipe list</NavLink>
                            { ! is_view_recipe && (<NavLink exact to={`/recipe/ingredient/new`} className="ui button primary">Add New</NavLink>)}
                            <div>
                                {
                                    is_view_recipe && (<h1>Cost Price: {getPriceByIngredients(this.state.ingredients)}</h1>)
                                }
								<br /><br />
								{ !!this.state.ingredients && this.state.ingredients.length > 0 ? ingredientCards : emptyMessage }
							</div>
						</div>
				}
			</div>
		);
    }
}