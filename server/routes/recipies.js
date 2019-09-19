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

router.post('/', (req, res) => {

	models.Recipe
		.create(req.body, {

        })
		.then(recipe => 
			{
				res.json({ success: true, recipe });
			}
		)
		.catch(err => res.status(400).json({ success: false, errors: { globals: err }}));
});

export default router;