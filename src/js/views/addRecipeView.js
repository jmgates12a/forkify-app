import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    // Note: In derived classes, super() must be called before you
    // can use 'this'. Using this before super() causes a ReferenceError.
    super();

    // this.addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  // _addHandlerShowWindow() {
  //   // bind(this) so that this refers to AddRecipeView class rather than the button
  //   this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  // }

  addHandlerShowWindow() {
    const self = this;
    // bind(this) so that this refers to AddRecipeView class rather than the button
    this._btnOpen.addEventListener('click', function () {
      self.toggleWindow();
      //handler();
    });
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // creates array of form field name, value
      const data = Object.fromEntries(dataArr); // creates an object from the array
      console.log('form data', data);
      handler(data);
    });
  }

  _generateMarkup() {
    return `<div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input  required name="title" type="text" />
          <label>URL</label>
          <input  required name="sourceUrl" type="text" />
          <label>Image URL</label>
          <input  required name="image" type="text" />
          <label>Publisher</label>
          <input  required name="publisher" type="text" />
          <label>Prep time</label>
          <input  required name="cookingTime" type="number" />
          <label>Servings</label>
          <input  required name="servings" type="number" />
        </div>

        <div class="upload__column ingrs-gridwrapper">
          <h3 class="upload__heading">Ingredients</h3>

          <label></label>
          <div>
            <span class="ingr-col--quantity">Qty</span
            ><span class="ingr-col--unit">Unit</span>
            <span class="ingr-col--description">Description</span>
          </div>
          <div>
            <label>01</label>
            <input class="btn-add-recipe-ingr btn--roundMini" type="button" value="Add" />
          </div>
          <div class="ingr-inputs">
            <input type="text" class="ingr-col--quantity" />
            <input type="text" class="ingr-col--unit" />
            <input type="text" class="ingr-col--description" />
          </div>



          <label>Ingredient 1</label>
          <input
            type="text"
            required
            name="ingredient-1"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 2</label>
          <input
            type="text"
            name="ingredient-2"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 3</label>
          <input
            type="text"
            name="ingredient-3"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 4</label>
          <input
            type="text"
            name="ingredient-4"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
        </div>
        <button class="btn upload__btn">
          <svg>
            <use href="src/img/${icons}#icon-upload-cloud"></use>
          </svg>
          <span>Upload</span>
        </button>
`;
  }
}

export default new AddRecipeView();
