import express from "express";
import models from "../models";

const router = express.Router();

router.get('/', (req, res) => {
	models.ingredient.findAll({
        include: [{model: models.ingredient, as: 'madeof'}],
		order: [['label', 'ASC']]
	}).then(ingredients => {
		if (ingredients && Object.keys(ingredients).length > 0)

			res.json({ success: true, ingredients });
		else
			res.status(400).json({ success: false, error: "No Ingredient found." });
	})
});

/**
 * Save new ingredient
 */
router.post('/', (req, res) => {
    console.log("requse is ", req.body)
	//let {label, group, price, made_of} = req.body;
	models.ingredient
		.create(req.body, {
			include:[{
				model: models.ingredient, 
				as: 'madeof',
				attributes: ['label', 'group', 'price', 'madeof']
			}]
		})
		.then(ingredient => 
			{
				res.json({ success: true, ingredient })
				console.log(ingredient)
			}
		)
		.catch(err => res.status(400).json({ success: false, errors: { globals: err }}));
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
