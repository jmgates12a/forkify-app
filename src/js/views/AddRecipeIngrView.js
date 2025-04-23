// import { forEach } from 'core-js/core/array';
import View from './View.js';

class AddRecipeIngrView extends View {
  _form = document.querySelector('.upload');
  _parentElement = document.querySelector('.ingrs-gridwrapper');
  _btnAdd = document.querySelector('.btn-add-recipe-ingr');
  _divInputs = document.querySelector('.ingr-input');
  _ingAdd = document.getElementById('ingredientadd');
  _message = document.querySelector('.upload__message');
  _errorMessage = 'invalid entry';

  constructor() {
    // Note: In derived classes, super() must be called before you
    // can use 'this'. Using this before super() causes a ReferenceError.
    super();
  }

  renderError(message = this._errorMessage) {
    const ingAddMsg = 'Ingredient error - ' + message;
    // console.log('Ingredient error - ' + message);
    this._message.innerText = ingAddMsg;
  }

  addHandlerAddRecipeIngr(handler) {
    const that = this;
    // this._btnAdd.parentElement.getElementsByTagName('label')[0].textContent;
    // console.log('ingrdNo', ingrdNo);
    this._btnAdd.addEventListener('click', function (e) {
      // 1) extract and validate ingredient data
      console.log('data-ingredient-nbr', this.dataset.ingredientNbr);
      const ingNo = this.dataset.ingredientNbr;
      const ingInputs = that._divInputs.getElementsByTagName('input');
      const ingValues = Array.from(ingInputs).map(ing => ing.value);
      // console.log(
      if (!handler(ingValues)) return;

      const ingLbl = Object.assign(document.createElement('label'), {
        innerText: ingNo,
        name: `ingr${ingNo}`,
      });
      const ingDivLbl = document.createElement('div').appendChild(ingLbl);
      console.log('ingDivLbl', ingDivLbl);

      const ingDivData = document.createElement('div');
      ingDivData.classList.add('ingr-output');

      ingValues.forEach((val, idx) => {
        const inpNameSuffix =
          idx === 2 ? 'description' : idx === 1 ? 'unit' : 'quantity';

        const ingInp = Object.assign(document.createElement('input'), {
          type: 'text',
          name: `ingr${ingNo}-${inpNameSuffix}`,
        });

        ingInp.classList.add(`ingr-col--${inpNameSuffix}`);

        ingInp.setAttribute('readonly', '');
        ingInp.setAttribute('value', val);

        ingDivData.appendChild(ingInp);
      });

      console.log('ingDivData', ingDivData);

      const parentDiv = that._ingAdd.parentNode;
      parentDiv.insertBefore(ingDivLbl, that._ingAdd);
      parentDiv.insertBefore(ingDivData, that._ingAdd);

      this.dataset.ingredientNbr = ('0' + (Number(ingNo) + 1)).slice(-2);

      Array.from(ingInputs).forEach(inp => (inp.value = ''));
    });

    // console.log('_form', this._form);
    // console.log('_btnAdd', this._btnAdd);
    // return false;
  }

  _generateMarkup() {}
}

export default new AddRecipeIngrView();
