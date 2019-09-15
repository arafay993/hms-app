import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '../components/Home/Home';
import BandList from '../components/Band/BandList';
import BandForm from '../components/Band/BandForm';
import AlbumList from '../components/Band/Album/AlbumList';
import AlbumForm from '../components/Band/Album/AlbumForm';

import RecipeList from '../components/Recipe/RecipeList'
import RecipeForm from '../components/Recipe/RecipeForm'
import IngredientList from '../components/Recipe/Ingredient/IngredientList'
import IngredientForm from '../components/Recipe/Ingredient/IngredientForm'

class Routes extends React.Component {
	render() {
		return (
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/bands" component={BandList} />
				<Route path="/bands/new" component={BandForm} />
				<Route exact path="/band/:id" component={BandForm} />
				<Route exact path="/band/:id/albums/" component={AlbumList} />
				<Route exact path="/band/:id/album/new" component={AlbumForm} />
				<Route exact path="/band/:id/album/:album_id" component={AlbumForm} />
				<Route exact path="/recipies" component={RecipeList} />
				<Route exact path="/recipe/new" component={RecipeForm} />
				<Route exact path="/recipe/:id" component={RecipeForm} />
				<Route exact path="/recipe/all/ingredients/" component={IngredientList} />
				<Route exact path="/recipe/:id/ingredients/" component={IngredientList} />
				<Route exact path="/recipe/ingredient/new" component={IngredientForm} />
				<Route exact path="/recipe/ingredient/:id" component={IngredientForm} />
			</Switch>
		)
	}
}

export default Routes;
