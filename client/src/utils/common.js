
/**
 * Calculate the price, if an ingredient belongs to Intermediate group
 */
export default function getPriceByIngredients(ingredients = [], price = 0){

	for (let ingredient of ingredients){
		if (ingredient.group=='intermediate'){
			ingredient.price = getPriceByIngredients(ingredient.madeof)
		}
		price += ingredient.price
	}
	return price
}
