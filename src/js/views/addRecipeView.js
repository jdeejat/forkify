import icons from 'url:../../img/icons.svg';
import View from './view';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _addButton = document.querySelector('.nav__btn--add-recipe');
  _closeButton = document.querySelector('.btn--close-modal');
  _message = 'Recipe uploaded successfully!';

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleHidden() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._addButton.addEventListener('click', this.toggleHidden.bind(this));
  }

  _addHandlerHideWindow() {
    this._closeButton.addEventListener('click', this.toggleHidden.bind(this));
    // or when clicked outside the window
    this._overlay.addEventListener('click', this.toggleHidden.bind(this));
    // or when escape key is pressed
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this.toggleHidden();
      }
    });
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      // get data from form
      const formDataArr = [...new FormData(this)];
      const data = Object.fromEntries(formDataArr);
      handler(data);
    });
  }

  _generateMarkup() {
    return `
     
        `;
  }
}

// create object of RecipeView class and export it to make sure that nobody can create an instance of it
export default new AddRecipeView();
