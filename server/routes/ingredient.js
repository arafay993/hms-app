import express from "express";
import models from "../models";
import Validator from 'validator';

const router = express.Router();

//Fetch all records of Ingredients
router.get('/', (req, res) => {
	models.ingredient.findAll({
		order: [['label', 'ASC']]
	}).then(ingredients => {
		if (ingredients && Object.keys(ingredients).length > 0)

			res.json({ success: true, ingredients });
		else
			res.status(400).json({ success: false, error: "No Ingredient found." });
	})
});

//Fetch Ingredient by Id
router.get('/:id', (req, res) => {
	let error = null;
	let id = req.params.id || null;

	if (!id) error = "Invalid request.";
	else if (Validator.isEmpty(id)) error = "Invalid request.";
	else if (!Validator.isInt(id)) error = "Value must be integer.";
	else if (id <= 0) error = "Invalid value.";

	if (error) res.status(400).json({ success: false, error: error, data: {} });

	models.ingredient.findById(req.params.id, {
	}).then(data => {
		if (data)
			res.json({ success: true, ingredient: data });
		else
			res.status(400).json({ success: false, error: "Ingredient not found.", ingredient: {} });
	})
});
/**
 * Save new Ingredient
 */
router.post('/', (req, res) => {

	models.ingredient
		.create(req.body, {})
		.then(ingredient => 
			{
				res.json({ success: true, ingredient })
				console.log(ingredient)
			}
		)
		.catch(err => res.status(400).json({ success: false, errors: { globals: err }}));
});

//Update Ingredient by Id
router.put('/:id', (req, res) => {

	let id = req.params.id || null;

	models.ingredient
		.update(req.body, { where: { id } })
		.then(() => res.json({ success: true }))
		.catch((err) => res.status(400).json({ success: false, errors: { globals: "Ops, something wrong happened.." } }));
});


export default router;
