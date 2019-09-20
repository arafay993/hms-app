export default (sequelize, DataTypes) => {
    const Recipe = sequelize.define('Recipe', {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      recipe: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: false,
        validate: {
          notEmpty: true
        }
      },
      selling_price: {
        type: DataTypes.FLOAT(30),
        allowNull: false,
        notEmpty: true,
        comment: "Price of the Recipe"
          }
    }, {
		tableName: "Recipe",
		freezeTableName: true
    });
    Recipe.associate = (models) => {
      Recipe.belongsToMany(models.ingredient, {
        through: 'RecipeIngredient',
        as: 'ingredients',
        foreignKey: 'recipeId'
      });
    };
    return Recipe;
  };