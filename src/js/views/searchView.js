import icons from 'url:../../img/icons.svg';
import View from './view';

class searchView extends View {
  _parentElement = document.querySelector('.search');

  // listen for input
  addHandlerSearch(handler) {
    // listen for parentElement submit
    this._parentElement.addEventListener('submit', event => {
      event.preventDefault();
      handler();
    });
  }

  getInput() {
    const searchInput =
      this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return searchInput;
  }

  // clear input
  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
}

export default new searchView();
