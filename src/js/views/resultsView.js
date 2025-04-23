import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again :)';
  _message = '';
  _selSortOpt = document.querySelector('.sort-control-sel');
  _btnSortGo = document.querySelector('.sort-control-btn');

  initialiseSortControl() {
    this.renderSortBtnGo('hidden');
    this._selSortOpt.value = 'init';
  }

  renderSortBtnGo(visibility) {
    this._btnSortGo.style.visibility = visibility;
  }

  addHandlerSortOption(handler) {
    let that = this;
    this._selSortOpt.addEventListener('change', function (e) {
      const select = e.target;
      const selectedText = select.options[select.selectedIndex].text;
      const selectedValue = select.value;
      console.log('selected ', selectedValue, selectedText);

      that._btnSortGo.style.visibility =
        selectedValue === 'none' ? 'hidden' : 'visible';

      if (selectedValue === 'none') {
        select.value = 'init';
      }

      handler(selectedValue);
    });
  }

  addHandlerSortGo(handler) {
    this._btnSortGo.addEventListener('click', function (e) {
      const btnSortGo = e.target;
      btnSortGo.style.visibility = 'hidden';
      handler();
    });
  }

  _generateMarkup() {
    // console.log('this._data', this._data);
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
