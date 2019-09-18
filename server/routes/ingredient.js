import express from "express";
import models from "../models";
import Validator from 'validator';

const router = express.Router();

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
 * Save new ingredient
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

router.put('/:id', (req, res) => {

	let id = req.params.id || null;
	console.log(id)
	models.ingredient
		.update(req.body, { where: { id } })
		.then(() => res.json({ success: true }))
		.catch((err) => res.status(400).json({ success: false, errors: { globals: "Ops, something wrong happened.." } }));
});

//  * Select album data by ID
//  */
// router.get('/:id', (req, res) => {
// 	const id = req.params.id
// 	models.album.find({ where: { id } }).then(album => {
// 		if (album) res.json({ success: true, album });
// 		else res.status(400).json({ success: false, error: "Album not found." });
// 	})
// });

// /**
//  * Update album by ID
//  */
// router.put('/:id', (req, res) => {
// 	const { id, title, description, cover, year } = req.body;
// 	models.album
// 		.update({ title, description, cover, year }, { where: { id }})
// 		.then(() => res.json({ success: true }))
// 		.catch(err => res.status(400).json({ success: false, errors: { globals: err }}));
// });

// /**
//  * Delete album by ID
//  */
// router.delete('/:id', (req, res) => {
// 	const id = req.params.id;
// 	models.album
// 		.destroy({ where: { id } })
// 		.then(() => res.json({ success: true }))
// 		.catch(err => res.status(400).json({ success: false, errors: { globals: err } }));
// });

export default router;
