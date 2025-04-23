import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX, roundToNearest, sortObjectArray } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    sort: 'none',
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // re: Video 18.25@33:00 short circating
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    // console.log('loadRecipe data', data);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    // console.log('recipe', state.recipe);
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(
      `${API_URL.replace('v2', 'v3')}?search=${query}&key=${KEY}`
    );

    state.search.page = 1;
    // console.log(`loadSearchResults ${query} data:`, data);

    state.search.results = data.data.recipes.map(rec => {
      //console.log('loadSearchResults Rec:', rec);
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        cookingTime: rec.cooking_time,
        ingredNbr: rec.ingredients.length,
        ...(rec.key && { key: rec.key }),
      };
    });
    // console.log('search results', state.search.results);
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const sortSearchResults = function () {
  // 1) sort Search results
  const [searchProperty, sortDir] = state.search.sort.split('-');
  state.search.results = sortObjectArray(
    state.search.results,
    searchProperty,
    sortDir === 'Asc'
  );
  // 2) set to page 1
  state.search.page = 1;
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9 (for slice 10th element)
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // New quantity = old quantiy * newServings / oldServings
    if (ing.quantity) {
      const newQuantity = (ing.quantity * newServings) / state.recipe.servings;
      ing.quantity = roundToNearest(newQuantity, 4);
    }
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storedBookmarks = localStorage.getItem('bookmarks');
  if (storedBookmarks) state.bookmarks = JSON.parse(storedBookmarks);
};

init();

// For testing / development
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    console.log('newRecipe', Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingr'))
      .reduce((ingrAccm, ingrItem) => {
        const ingPropName = ingrItem[0].slice(7);
        if (ingPropName === 'quantity') {
          const ingObj = {};
          ingObj.quantity = ingrItem[1] ? +ingrItem[1] : null;
          ingrAccm.push(ingObj);
        } else {
          ingrAccm[ingrAccm.length - 1][ingPropName] = ingrItem[1];
        }
        return ingrAccm;
      }, []);
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    // console.log('Upload recipe', recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
    //console.log('Uploaded recipe', data);
  } catch (err) {
    throw err;
  }
};
