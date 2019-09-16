export default (sequelize, Sequelize) => {
	const Ingredient = sequelize.define("ingredient", {
		label: {
			type: Sequelize.STRING(500),
            allowNull: false,
            notEmpty: false,
			comment: "Name of Ingredient"
		},
        group: {
			type: Sequelize.STRING(500),
            allowNull: false,
            notEmpty: false,
			comment: "Group to which this Ingredient belongs"
		},
		price: {
			type: Sequelize.FLOAT(30),
            allowNull: true,
            notEmpty: true,
			comment: "Price of the Ingredient"
		}
	}, {
		tableName: "ingredient",
		freezeTableName: true
    });
    
    Ingredient.associate = (models) => {
        Ingredient.hasMany(models.ingredient, {
            onDelete: 'CASCADE',
            foreignKey: {
                name: 'parent_id',
                allowNull: true,
                notEmpty: false,
            },
            as: 'madeof'
        });
    }
    Ingredient.associate = (models) => {
        Ingredient.belongsToMany(models.Recipe, {
          through: 'RecipeIngredient',
          as: 'recipies',
          foreignKey: 'ingredientId'
        });
      };
    return Ingredient;
}
