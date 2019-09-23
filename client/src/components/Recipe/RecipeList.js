import React from 'react';
import axios from 'axios';
import classnames from 'classnames';
import { NavLink } from 'react-router-dom';


export default class RecipeList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            recipies : []
		}
		this.deleteRecipe = this.deleteRecipe.bind(this);
    }
	/**
	 * Fetch all recipies on component load
	 */
	componentDidMount() {
        axios.get('/api/recipies/')
        .then(response => {
          this.setState({ recipies: response.data.recipies });
        })
        .catch(function (error) {
          console.log(error);
		})
	}
	
	deleteRecipe(id){

		axios.delete('/api/recipies/'+id)
		.then(response => {
			//Remove the record from recipe list after deleting it from the back-end
			console.log('response',response)
			this.setState({
			recipies: this.state.recipies.filter(item => item.id !== Number(id))
			})
		})
		.catch(err => console.log(err))

	}

    render() {
		let gridLines = "";

		const recipies = this.state.recipies;

		if (recipies.length !== 0) {
			gridLines = recipies.map((recipe, i) => {
				if (recipe) {
					return (
						<tr key={recipe.id}>
							<td>{recipe.id}</td>
							<td>{recipe.name}</td>
							<td style={{ textAlign: "center" }}>{recipe.recipe}</td>
							<td style={{ textAlign: "center" }}>
								<div className={classnames('ui','label','circular','small', {
									'green' : recipe.ingredients.length > 0,
									'yellow' : recipe.ingredients.length == 0
								})}>{recipe.ingredients.length}</div>
							</td>
							<td style={{ textAlign: "right" }}>
								<NavLink className="ui button compact icon small black" to={`/recipe/${recipe.id}/ingredients/`} title="More details">
									<i className="icon eye"></i>
								</NavLink>
								<NavLink className="ui button compact icon small blue" to={`/recipe/${recipe.id}`} title="Edit">
									<i className="icon edit"></i>
								</NavLink>
								<button className="ui button compact icon small red" onClick={() => this.deleteRecipe(recipe.id)} title="Delete">
									<i className="icon trash"></i>
								</button>
							</td>
						</tr>
					);
				}
			});
		}

		const grid = (
			<table className="ui striped selectable compact table single line">
				<thead>
					<tr>
						<th width="7%">ID</th>
						<th>Name</th>
						<th width="7%" style={{ textAlign: "center" }}>Recipe Name</th>
						<th width="5%" style={{ textAlign: "center" }}>Ingredients</th>
						<th width="15%"></th>
					</tr>
				</thead>
				<tbody>
					{gridLines}
				</tbody>
			</table>
		);

		const emptyMessage = (
			<div className="ui info message">There is no recipies yet in your collection</div>
		);

		return (
			<div className="ui container">
				<h1>recipies List</h1>
				<NavLink exact to="/recipe/new" className="ui button primary">Add New</NavLink>
				<NavLink exact to="/recipe/all/ingredients/" className="ui button primary">Ingredient List</NavLink>
				{recipies.length > 0 ? grid : emptyMessage }
			</div>
		);
	}

}