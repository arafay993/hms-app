import React from 'react';
import getPriceByIngredients from '../../../utils/common' 
import { NavLink } from 'react-router-dom';

export default class IngredientCard extends React.Component {
	render() {
        const ingredient = this.props.ingredient;
        const is_intermediate = ingredient.group === 'intermediate'

		return (
			<div className="ui card">
				<div className="content" onClick={() => this.props.filterIngredient(ingredient.id)}>
					<div className="header">{ingredient.label}</div>
					<div className="meta">{ingredient.group}</div>
                    <div className="description">
                    {is_intermediate ? getPriceByIngredients(ingredient.madeof) : ingredient.price}
                    </div>
				</div>
				<div className="extra content">
					<div class="ui vertical buttons fluid">
						<NavLink to={`/recipe/ingredient/${ingredient.id}`} className="ui button labeled icon blue">
							<i className="icon edit"></i> Edit
						</NavLink>
						{/* <button className="ui button labeled icon red" onClick={() => this.props.deleteIngredient(ingredient.id)}>
							<i className="icon trash"></i> Remove
						</button> */}
					</div>
				</div>
			</div>
		)
	}
}


