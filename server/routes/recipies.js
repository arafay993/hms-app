import express from "express";
import models from "../models";

const router = express.Router();

/**
 * Get all bands
 */
router.get('/', (req, res) => {
	models.Recipe.findAll({
        include: [{
            model: models.ingredient,
            as: 'ingredients',
            through: { attributes: [] }
        }],
		order: [['name', 'ASC']]
	}).then(recipies => {
		if (recipies && Object.keys(recipies).length > 0)
			res.json({ success: true, recipies });
		else
			res.status(400).json({ success: false, error: "Any Recipe found." });
	})
});

router.get('/:id', (req, res) => {

    const id = req.params.id;
	models.Recipe.findById(id, {
        include: [{
            model: models.ingredient,
            as: 'ingredients',
            through: { attributes: [] }
        }],
		order: [['name', 'ASC']]
	}).then(recipies => {
		if (recipies && Object.keys(recipies).length > 0)
			res.json({ success: true, recipies });
		else
			res.status(400).json({ success: false, error: "Any Recipe found." });
	})
});

router.post('/', (req, res) => {

	models.Recipe
		.create(req.body, {})
		.then(recipe => 
			{   
                var ingredients = req.body.ingredients;
                var ingredient_ids = ingredients.map(ingredient => ingredient.id);
                recipe.addIngredient(ingredient_ids)
                    .then(addedIngredients => console.log(addedIngredients));
				res.json({ success: true, recipe });
			}
		)
		.catch(err => res.status(400).json({ success: false, errors: { globals: err }}));
});

/**
 * Update album by ID
 */
router.put('/:id', (req, res) => {
    //const { id, title, description, cover, year } = req.body;
    const id = req.params.id;
	models.Recipe
		.update(req.body, { where: { id }})
		.then((recipe) => {
            var ingredients = req.body.ingredients;
            var ingredient_ids = ingredients.map(ingredient => ingredient.id);
            recipe.setIngredients(ingredient_ids)
                .then(addedIngredients => console.log(addedIngredients));
            res.json({ success: true })
        })
		.catch(err => res.status(400).json({ success: false, errors: { globals: err }}));
});

export default router;