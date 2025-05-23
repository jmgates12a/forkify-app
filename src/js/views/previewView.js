import View from './View.js';
import ingIcon from 'url:../../img/ingredients.png';
const icons = require('url:../../img/icons.svg');

class PreviewView extends View {
  // Generates ONE preview element string
  _parentElement = '';

  _generateMarkup() {
    // console.log('PreviewView this._data', this._data);
    const id = window.location.hash.slice(1);
    return `
    <li class="preview">
        <a class="preview__link ${
          this._data.id === id ? 'preview__link--active' : ''
        }" href="#${this._data.id}">
          <figure class="preview__fig">
            <img src="${this._data.image}" alt="${this._data.title}" />
          </figure>
          <div class="preview__data">
              <h4 class="preview__title">${this._data.title}</h4>
              <p class="preview__publisher">${this._data.publisher}</p>
              <div class="preview__user-generated ${
                this._data.key ? '' : 'hidden'
              }">
                <svg>
                <use href="${icons}#icon-user"></use>
                </svg>
              </div>
            <div class="preview__spec">
              <svg>
                <use href="${icons}#icon-clock"></use>
              </svg>
              <span>${this._data.cookingTime}</span>
                <img src="${ingIcon}" alt="i for ingredients" />
              <span>${
                this._data.ingredNbr || this._data.ingredients.length
              }</span>
            </div>

        </div> 
      </a>
    </li>
`;
  }
}

export default new PreviewView();
