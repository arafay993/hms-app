export default (sequelize, DataTypes) => {
    const RecipeIngredient = sequelize.define('RecipeIngredient', {
      id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
       }, 
      recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Recipe',
          key: 'id'
        }
      },
      ingredientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ingredient',
          key: 'id'
        }
      }
    }, {
		tableName: "RecipeIngredient",
		freezeTableName: true
    });
    return RecipeIngredient;
  };