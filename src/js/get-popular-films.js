import galleryMarkup from '../templates/filmsInGallery.hbs';
import { getRefs } from './get-refs';
import { updateMoviesData } from './update-movies-data';
import ItemsApiService from './fetch-items';
import Pagination from 'tui-pagination';
import { renderTrandingPage } from './pagination-nav';
import { options } from './pagination';
import notification from './pop-up-messages.js';

const refs = getRefs();
const itemsApiService = new ItemsApiService();

let numberOfPages = 0;

async function getPopularFilms() { 
  notification.onLoadingCircleAdd();

  // Загрузка данных
  const result = await itemsApiService.fetchTrandingItems();

  notification.onLoadingCircleRemove();
  refs.alert.innerHTML = '';
  // Отрисовка данных
  updateMoviesData(result).then(movies => (refs.moviesList.innerHTML = galleryMarkup(movies)));

  // ========== Создание пагинации ==========
  // Общее количество полученных страниц храним в numberOfPages
  numberOfPages = result.total_pages;

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
      renderTrandingPage(currentPage);
    });
  } else {
    // Если ширина экрана менее 520px отображаем 5 страницы пагинации (по умолчанию 5)
    const pagination = new Pagination(container, options, (options.totalItems = numberOfPages));

    // События при навигации
    pagination.on('afterMove', event => {
      const currentPage = event.page;
      // console.log(currentPage);

      // Загрузка и отрисовка выбранной страницы
      renderTrandingPage(currentPage);
    });
  }

}

export { getPopularFilms };
