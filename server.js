const express = require('express');
const app = express();
const cors = require('cors');
const admin = require("firebase-admin");

app.use(cors());
app.use(express.json());

const serviceAccount = require("./nosql-8ff5f-firebase-adminsdk-ozdm2-36faca5d0c.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nosql-8ff5f-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

const db = admin.database();  // เปลี่ยนจาก firestore เป็น realtime database

app.post('/addRecipe', async (req, res) => {
  try {
      const { recipeName, selectedIngredients, totalCalories } = req.body;

      // Validate the input
      if (!recipeName || !selectedIngredients || !Array.isArray(selectedIngredients) || totalCalories == null) {
          return res.status(400).send('Invalid input');
      }

      // Prepare the new recipe data
      const newRecipe = {
          name: recipeName,
          ingredients: selectedIngredients.map(ingredient => ({
              name: ingredient.name,
              image: ingredient.image,
              count: ingredient.count,
              calories:ingredient.calories
          })),
          calories: totalCalories // Include totalCalories in the new recipe data
      };

      // Add the new recipe to the Realtime Database using recipeName as the key
      const ref = db.ref('recipe'); // Reference to the 'recipe' data storage
      await ref.child(recipeName).set(newRecipe); // Add new recipe data using recipeName as the key
      res.json({ id: recipeName }); // Use recipeName as the id
  } catch (error) {
      res.status(500).send('Error adding document: ' + error.message);
  }
});


// app.delete('/deleteIngredient', async (req, res) => {
//   try {
//       const { recipeName, ingredientName } = req.body;

//       if (!recipeName || !ingredientName) {
//           return res.status(400).send('Invalid input');
//       }

//       const recipeRef = db.ref(`recipe/${recipeName}/ingredients`);

//       const ingredientsSnapshot = await recipeRef.once('value');
//       const ingredients = ingredientsSnapshot.val();

//       if (!ingredients) {
//           return res.status(404).send('Recipe not found');
//       }

//       const ingredientKey = Object.keys(ingredients).find(key => ingredients[key].name === ingredientName);
//       if (ingredientKey) {
//           await recipeRef.child(ingredientKey).remove();
//           res.send('Ingredient deleted successfully');
//       } else {
//           res.status(404).send('Ingredient not found');
//       }
//   } catch (error) {
//       res.status(500).send('Error deleting ingredient: ' + error.message);
//   }
// });


app.get('/getRecipes', async (req, res) => {
  try {
      const ref = db.ref('recipe');
      const snapshot = await ref.once('value');
      const recipes = snapshot.val();
      
      if (!recipes) {
          return res.status(404).send('No recipes found');
      }

      res.json(recipes);
  } catch (error) {
      res.status(500).send('Error fetching recipes: ' + error.message);
  }
});

app.delete('/deleteRecipe', async (req, res) => {
  try {
    const { recipeName } = req.body;

    if (!recipeName) {
      return res.status(400).json({ status: 'error', message: 'Recipe name is required.' });
    }

    const recipeRef = db.ref(`recipe/${recipeName}`);

    // Check if recipe exists
    const recipeSnapshot = await recipeRef.once('value');
    if (!recipeSnapshot.exists()) {
      return res.status(404).json({ status: 'error', message: 'Recipe not found.' });
    }

    // Delete the recipe
    await recipeRef.remove();
    res.json({ status: 'success', message: 'Recipe successfully deleted.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error deleting recipe: ' + error.message });
  }
});


app.patch('/updateRecipe', async (req, res) => {
  try {
    const { name, ingredients, totalCalories } = req.body;

    if (!name || !ingredients || !Array.isArray(ingredients) || totalCalories == null) {
      return res.status(400).send('Invalid input');
    }

    const recipeRef = db.ref(`recipe/${name}`);

    // Check if recipe exists
    const recipeSnapshot = await recipeRef.once('value');
    if (!recipeSnapshot.exists()) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Update the recipe data
    await recipeRef.update({
      ingredients: ingredients,
      calories: totalCalories
    });

    res.json({ message: 'Recipe updated successfully' });
  } catch (error) {
    res.status(500).send('Error updating recipe: ' + error.message);
  }
});









app.listen('3003', () => {
    console.log('server is running on port 3003')
});