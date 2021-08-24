import '../node_modules/tui-pagination/dist/tui-pagination.css';
import './sass/main.scss';
import globalVariables from './js/global-variables';
import { getRefs } from './js/get-refs';
import { onSearchFormInput } from './js/fetch-by-name';
import { onSearchBtnClick } from './js/fetch-by-name';
import { HeaderSwitcher, HEADER_ENUM } from './js/header-switch';
import { getPopularFilms } from './js/get-popular-films';
import { onSortChange } from './js/sort-by-value';
import userLibrary from './js/userLibrary';
import './js/pagination-nav';
import './js/team-modal';
import { openCardMovie } from './js/getCardMovie';

import { scrollToTopBtn } from './js/back-to-top';
import './js/color-theme-switch';
import '../node_modules/simplelightbox/dist/simple-lightbox.min.css';

const refs = getRefs();

refs.searchForm.addEventListener('input', onSearchFormInput);
refs.searchBtn.addEventListener('click', onSearchBtnClick);
refs.moviesList.addEventListener('click', openCardMovie);

// Добавление стрелки back-to-top на старницу
scrollToTopBtn();

new HeaderSwitcher({
  onChangeCallback: page => {
    globalVariables.curPage = page;

    switch (page) {
      case HEADER_ENUM.HOME:
        refs.pagination.style.visibility = 'visible';
        refs.searchForm.value = '';
        refs.filterContainer.classList.remove('visually-hidden');
        getPopularFilms();
        refs.sort.addEventListener('change', onSortChange);

        break;
      case HEADER_ENUM.LIBRARY:
        getLibraryFilms();
        refs.filterContainer.classList.add('visually-hidden');
        break;
    }
  },
});

function getLibraryFilms() {
  userLibrary.switchToCurrentLibrary();
}
