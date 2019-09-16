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