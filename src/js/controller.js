import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import recipeView from './views/recipeView.js';
import paginationView from './views/paginationView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { UPLOAD_TIMEOUT } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const recipeId = window.location.hash.slice(1);
    if (!recipeId) return;
    recipeView.renderSpinner();

    // 0 update results view to mark selected recipe
    resultsView.update(model.getPageSearchResults());
    // 1 updating bookmarks view
    //debugger;
    bookmarksView.update(model.state.bookmarks);

    // 2 get recipe from model
    await model.getRecipe(recipeId);

    // 3 rendering the recipe
    recipeView.render(model.state.rec);
  } catch (error) {
    recipeView.renderError();
    //console.log(error);
  }
};

const controlSearch = async function () {
  try {
    resultsView.renderSpinner();
    // 1 get search input
    const query = searchView.getInput();
    if (!query) throw new Error('Please enter a valid search term');
    // 2 get search results from model
    await model.loadSearchResults(query);
    // 3 rendering the search results
    resultsView.render(model.getPageSearchResults());
    // 4 rendering the pagination initial
    paginationView.render(model.state.search);
  } catch (error) {
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // 1 rendering results for new page after button click
  resultsView.render(model.getPageSearchResults(goToPage));
  // 2 rendering the pagination for new page after button click
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1 update recipe servings in state
  model.updateServings(newServings);
  // 2 update recipe servings in UI view
  //recipeView.render(model.state.rec);
  recipeView.update(model.state.rec);
};

const controlAddBookmarks = function () {
  // 1 add/remove recipe to bookmarks in state
  if (!model.state.rec.bookmarked) {
    model.addBookmarks(model.state.rec);
  } else {
    model.removeBookmarks(model.state.rec.id);
  }

  // 2 update recipe view to reflect bookmarked status
  recipeView.update(model.state.rec);

  // 3 render bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarksLoad = function () {
  // bookmarks load from storage in init need to set them back
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();
    // upload recipe to model
    await model.uploadRecipe(newRecipe);
    console.log(model.state.rec);

    // render recipe view
    recipeView.render(model.state.rec);

    // display success message
    addRecipeView.renderMessage();

    // render bookmarks view
    bookmarksView.render(model.state.bookmarks);

    // change ID in url
    window.history.pushState(null, null, `#${model.state.rec.id}`);

    // close form modal after 2 seconds
    setTimeout(function () {
      addRecipeView.toggleHidden();
    }, UPLOAD_TIMEOUT * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
    console.log(error);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarksLoad);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearch);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
