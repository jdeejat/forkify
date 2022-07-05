import { async } from 'regenerator-runtime';
import { API_URL, RESULTS_PER_PAGE, API_KEY } from './config';
import { AJAX } from './helpers';
import addRecipeView from './views/addRecipeView';

///////////////////////////////////
/*
/https://forkify-api.herokuapp.com/v2
More Features to add
1. Display number of pages between the pagination buttons;
2. Ability to sort search results by duration or number of ingredients;
3. Perform ingredient validation in view, before submitting the form;
4. Improve recipe ingredient input: separate in multiple fields and allow more than 6 ingredients;
Big features
5. Shopping list feature: button on recipe to add ingredients to a list;
6. Weekly meal planning feature: assign recipes to the next 7 days and show on a weekly calendar;
7. Get nutrition data on each ingredient from spoonacular API (https:// spoonacular.com/food-api) and calculate total calories of recipe
*/
///////////////////////////////////

export const state = {
  rec: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    image_url: recipe.image_url,
    source_url: recipe.source_url,
    servings: recipe.servings,
    cooking_time: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // handy trick if some value does not exist && short circuit if false otherwise it will return second value
  };
};

export const getRecipe = async function (recipeId) {
  try {
    // 1 - Get the recipe data from the API
    const data = await AJAX(`${API_URL}${recipeId}?key=${API_KEY}`);
    state.rec = createRecipeObject(data);

    // 2 - Check if the recipe being loaded is bookmarked
    if (state.bookmarks.some(bookmark => bookmark.id === state.rec.id)) {
      state.rec.bookmarked = true;
    } else {
      state.rec.bookmarked = false;
    }
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (searchTerm) {
  try {
    state.search.query = searchTerm;
    // 1 - Get the recipe data from the API
    const data = await AJAX(`${API_URL}?search=${searchTerm}&key=${API_KEY}`);
    // 2 - Save the data to the state object
    // if needed can also rename fields with ..map(rec => { return { id: rec.id, title: rec.title, publisher: rec.publisher, image: rec.image_url, };});
    state.search.results = data.data.recipes;
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const getPageSearchResults = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RESULTS_PER_PAGE;
  const end = start + RESULTS_PER_PAGE;
  // return first 10 results from state.search.results
  return state.search.results.slice(start, end);
};

export const updateServings = function (servings) {
  // update ingredients in state
  state.rec.ingredients.forEach(ingredient => {
    ingredient.quantity = (ingredient.quantity * servings) / state.rec.servings;
  });
  // update servings in state
  state.rec.servings = servings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmarks = function (recipe) {
  // 1 add recipe to bookmarks in state
  state.bookmarks.push(recipe);

  // 2 mark recipe as bookmarked
  if (recipe.id === state.rec.id) {
    state.rec.bookmarked = true;
  }
  // 3 persist bookmarks to localStorage
  persistBookmarks();
};

export const removeBookmarks = function (id) {
  // 1 find and remove recipe from bookmarks array
  state.bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== id);

  // 2 mark recipe as not bookmarked
  if (id === state.rec.id) {
    state.rec.bookmarked = false;
  }
  // 3 persist bookmarks to localStorage
  persistBookmarks();
};

const init = function () {
  // 1 - Get bookmarks from localStorage
  const bookmarks = localStorage.getItem('bookmarks');
  if (bookmarks) state.bookmarks = JSON.parse(bookmarks);
};
init();

export const uploadRecipe = async function (recipe) {
  try {
    // 1 filter from array only where keys include "ingredient"
    const ingredients = Object.entries(recipe)
      .filter(entry => entry[0].includes('ingredient') && entry[1] !== '')
      .map(entry => {
        //split value by ,
        const ingArr = entry[1].split(',').map(el => el.trim());
        // throw error if number of elements is less 3
        if (ingArr.length < 3) {
          throw new Error('Invalid ingredient');
        }
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    // 2 create object that need to be sent to API
    const recipeObj = {
      title: recipe.title,
      publisher: recipe.publisher,
      image_url: recipe.image_url,
      source_url: recipe.source_url,
      servings: recipe.servings,
      cooking_time: recipe.cooking_time,
      ingredients,
    };

    // 3 - Send the recipe data to the API key
    //https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza&key=<insert your key>
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipeObj);
    state.rec = createRecipeObject(data);
    addBookmarks(state.rec);
  } catch (error) {
    throw error;
  }
};
