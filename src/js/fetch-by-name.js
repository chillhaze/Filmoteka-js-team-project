import { getRefs } from './get-refs';
import ItemsApiService from './fetch-items.js';
import galleryMarkup from '../templates/filmsInGallery.hbs';
import { updateMoviesData } from './update-movies-data';
import Pagination from 'tui-pagination';
import { renderMovieToFindPage } from './pagination-nav';
import { options } from './pagination';
import notification from './pop-up-messages.js';

const itemsApiService = new ItemsApiService();

let filmToFind = '';
let numberOfPages = 0;
const refs = getRefs();

// получаем значение из инпута
function onSearchFormInput() {
  filmToFind = refs.searchForm.value.trim();
}

// фетч фильмов по названию
async function onSearchBtnClick(e) {
  e.preventDefault();
  itemsApiService.query = filmToFind;
  refs.filterContainer.classList.add('visually-hidden');

  if (filmToFind) {
    notification.onLoadingCircleAdd();
    const result = await itemsApiService.fetchItemsFromSearch();
    notification.onLoadingCircleRemove();
    updateMoviesData(result).then(movies => (refs.moviesList.innerHTML = galleryMarkup(movies)));

    // ========== Создание пагинации ==========
    // Общее количество полученных страниц храним в numberOfPages
    numberOfPages = result.total_pages;
    //console.log(numberOfPages);

    // Пагинация
    const container = document.getElementById('pagination');

    // Читаем ширину экрана
    let deviceWidth = document.documentElement.clientWidth;
    // Количество видимых страниц пагинации
    let pagesToShow = 5;

    // Если ширина экрана менее 520px отображаем 3 страницы пагинации
    if (deviceWidth < 520) {
      pagesToShow = 3;

      const pagination = new Pagination(
        container,
        options,
        ((options.totalItems = numberOfPages), (options.visiblePages = pagesToShow)),
      );

      // События при навигации
      pagination.on('afterMove', event => {
        const currentPage = event.page;
        // console.log(currentPage);

        // Загрузка и отрисовка выбранной страницы
        renderMovieToFindPage(currentPage, filmToFind);
      });
    } else {
      // Если ширина экрана менее 520px отображаем 5 страницы пагинации (по умолчанию 5)
      const pagination = new Pagination(container, options, (options.totalItems = numberOfPages));

      // События при навигации
      pagination.on('afterMove', event => {
        const currentPage = event.page;
        // console.log(currentPage);

        // Загрузка и отрисовка выбранной страницы
        renderMovieToFindPage(currentPage, filmToFind);
      });
    }

    refs.alert.innerHTML = '';

    if (result.total_pages === 0) {
      refs.alert.innerHTML =
        'Search result is not successful. Enter the correct movie name and try again.';
    }
    container.style.visibility = result.total_pages ? 'visible' : 'hidden';
  }
}

export { onSearchFormInput, onSearchBtnClick };
