import express from "express";
import models from "../models";

const router = express.Router();

/**
 * Get all recipies
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

//Get Recipe by Id
router.get('/:id', (req, res) => {

	let error = null;
	let id = req.params.id || null;

	if (!id) error = "Invalid request.";
	else if (Validator.isEmpty(id)) error = "Invalid request.";
	else if (!Validator.isInt(id)) error = "Value must be integer.";
	else if (id <= 0) error = "Invalid value.";

	if (error) res.status(400).json({ success: false, error: error, data: {} });

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
			res.status(400).json({ success: false, error: "Recipe not found." });
	})
});

/**
 *  Create new Recipe
 */
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
 * Update Recipe by Id
 */
router.put('/:id', (req, res) => {
    
    const id = req.params.id;
	models.Recipe
		.update(req.body, { where: { id }})
		.then((recipe) => {
	
			var ingredients = req.body.ingredients;
			var ingredient_ids = ingredients.map(ingredient => ingredient.id);
			console.log(ingredients[0].id);
			models.Recipe.findById(recipe[0]).then(async updated_recipe => {
				const ingredientInstance = await models.ingredient.findByPk(ingredient_ids[0])
				console.log(ingredientInstance)
				updated_recipe.setIngredients(ingredientInstance, {save: false})
                .then(addedIngredients => console.log(addedIngredients));
			});

            res.json({ success: true })
        })
		.catch(err => res.status(400).json({ success: false, errors: { globals: err }}));
});

/**
 * Delete Recipe by Id
 */
router.delete('/:id', (req, res) => {
	let id = req.params.id;
	models.Recipe
		.destroy({ where: { id } })
		.then((rowDeleted) => res.json({ success: true, deleted: rowDeleted }))
		.catch((err) => res.status(500).json({ success: false, errors: { globals: err } }));
});


export default router;