import React from 'react';
import { NavLink } from 'react-router-dom';
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
    }
	/**
	 * Fetch either all ingredients or ingredients attached to a specific recipe item on component load
	 */
	componentDidMount() {
        let fetch_ingredient_url = '/api/ingredient/'
        if (this.props.match && this.props.match.params && typeof this.props.match.params.id !== "undefined") {
            //Fetch ingredients of a recipe
            fetch_ingredient_url = `/api/recipies/${this.props.match.params.id}`
        }
        axios.get(fetch_ingredient_url)
        .then(response => {
            if (response.data.ingredients)
                this.setState({ ingredients: response.data.ingredients });
            else
                this.setState({ ingredients: response.data.recipies.ingredients });
        })
        .catch(function (error) {
          console.log(error);
		})
    }

    filterIngredient(id){

        let filter_ingredient = this.state.ingredients.filter(item => item.id === Number(id))[0]
        //drill down to the details of an Intermediate ingredient only
        if (filter_ingredient.group === 'intermediate')
            this.setState({
            ingredients : filter_ingredient.madeof
            });
    }


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