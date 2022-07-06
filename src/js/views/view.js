import icons from 'url:../../img/icons.svg';

// creating view class for the app

export default class View {
  _data;

  /**
   * Render object that is passed in as argument to DOM
   * @param {Object | Object[]} data - object that needs to be rendered
   * @param {boolean} [render = true] - if false, it will not render the object but create a string with markup
   * @returns {undefined | string} - if render is false, it will return string with markup
   * @this {Object} View instance
   * @autor: Nikita
   * @todo: add documentation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // convert new markup to DOM element and compare it to the old one
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newElement, index) => {
      const curElement = curElements[index];
      // update changed text
      if (
        !newElement.isEqualNode(curElement) &&
        newElement.firstChild?.nodeValue.trim() !== ''
      ) {
        curElement.replaceWith(newElement);
      }
      // update changed attributes
      if (!newElement.isEqualNode(curElement)) {
        Array.from(newElement.attributes).forEach(attr => {
          curElement.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  // create render spinner function
  renderSpinner = function () {
    const spinner = `
      <div class="spinner">
      <svg>
      <use href="${icons}#icon-loader"></use>
      </svg>
      </div>
      `;
    // clear parent element
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', spinner);
  };

  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
