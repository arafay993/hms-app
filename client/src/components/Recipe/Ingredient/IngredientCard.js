import React from 'react';
import getPriceByIngredients from '../../../utils/common' 

export default class IngredientCard extends React.Component {
	render() {
        const ingredient = this.props.ingredient;
        const is_intermediate = ingredient.group === 'intermediate'

		return (
			<div className="ui card" onClick={() => this.props.filterIngredient(ingredient.id)}>
				<div className="content">
					<div className="header">{ingredient.label}</div>
					<div className="meta">{ingredient.group}</div>
                    <div className="description">
                    {is_intermediate ? getPriceByIngredients(ingredient.madeof) : ingredient.price}
                    </div>
				</div>
				{/* <div className="extra content">
					<div class="ui vertical buttons fluid">
						<NavLink to={`/band/${band.id}/album/${album.id}`} className="ui button labeled icon blue">
							<i className="icon edit"></i> Edit
						</NavLink>
						<div className="ui button labeled icon red disabled">
							<i className="icon trash"></i> Remove
						</div>
					</div>
				</div> */}
			</div>
		)
	}
}


