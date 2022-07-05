import View from './view';
import previewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No results found... Please try a different search.';
  _message = 'Start typing to search for a recipe!';

  _generateMarkup() {
    const markup = this._data
      .map(result => previewView.render(result, false))
      .join('');
    return markup;
  }
}

export default new ResultsView();
