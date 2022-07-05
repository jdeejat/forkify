import icons from 'url:../../img/icons.svg';
import View from './view';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  // listen for input
  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      // get data-goto attribute from button
      if (!btn) return;
      const page = +btn.dataset.goto;
      handler(page);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // // page 1 and there are other pages
    if (currentPage === 1 && numPages > 1) {
      const markup = this._generateMarkupNext();
      return markup;
    }
    // we are on othe page
    if (currentPage > 1 && currentPage < numPages) {
      const markup =
        this._generateMarkupPrevious() + this._generateMarkupNext();
      return markup;
    }
    // we are on the last page
    if (currentPage === numPages && numPages > 1) {
      const markup = this._generateMarkupPrevious();
      return markup;
    }
    // page 1 and there are no other pages
    if (currentPage === 1 && numPages === 1) {
      return '';
    }
  }

  _generateMarkupPrevious() {
    return `
         <button class="btn--inline pagination__btn--prev" data-goto="${
           this._data.page - 1
         }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>
    `;
  }

  _generateMarkupNext() {
    return `
          <button class="btn--inline pagination__btn--next" data-goto="${
            this._data.page + 1
          }">
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
         </button>
    `;
  }
}

export default new PaginationView();
