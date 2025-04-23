import { isNumeric } from './helpers.js';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import addRecipeIngrView from './views/AddRecipeIngrView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

if (module.hot) {
  module.hot.accept(); // to enable inflight updating (parcel command)
}

const controlRecipes = async function () {
  // console.log('In controlRecipes');
  try {
    const id = window.location.hash.slice(1); // latter part of url#id

    // console.log('controlRecipes id', id);
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search item
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1) loading recipe
    // console.log('recipe id:', id);
    await model.loadRecipe(id);
    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // console.log(resultsView); // see methods inherited (ResultsView.view.Object)
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    // resultsView.render(model.state.search.results); // all
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);

    // 5) initalise sort control
    resultsView.initialiseSortControl();
  } catch (err) {
    console.log(err);
  }
};

const controlSortSelected = function (selectedSort) {
  console.log('In contolSortResults');
  model.state.search.sort = selectedSort;

  if (model.state.search.results.length === 0)
    resultsView.renderSortBtnGo('hidden');
};

const controlSortRun = function () {
  console.log('In controlSortRun', model.state.search.sort);
  model.sortSearchResults();
  resultsView.render(model.getSearchResultsPage());
  paginationView.render(model.state.search);
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1) Update the recipe servings (in state)
  model.updateServings(newServings);
  // 2) Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // console.log('model.state.recipe', model.state.recipe);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlShowRecipeForm = function () {
  //addRecipeView.render(' ');
  console.log('In controlShowRecipeForm');
  addRecipeView.addHandlerShowWindow();
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data
    await model.uploadRecipe(newRecipe);
    console.log('Upload new recipe:', model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const controlAddRecipeIngredient = function (ingValues) {
  console.log(`In controlAddRecipeIngredient adding ingredient ${ingValues}`);
  try {
    if (!isNumeric(ingValues[0]) && ingValues[0].trim() != '') {
      throw new Error(
        'Ingredient quantity must be positive numeric if entered'
      );
    }
    if (ingValues[2].trim() === '') {
      throw new Error('Ingredient description required');
    }
  } catch (err) {
    console.error('💥', err);
    addRecipeIngrView.renderError(err.message);
    return false;
  }

  return true;
};

//Publisher / Subscriber patern
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  addRecipeView.addHandlerShowWindow(controlShowRecipeForm);
  resultsView.addHandlerSortOption(controlSortSelected);
  resultsView.addHandlerSortGo(controlSortRun);
  addRecipeIngrView.addHandlerAddRecipeIngr(controlAddRecipeIngredient);
  console.log('Welcome');
};

init();
