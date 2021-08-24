import galleryMarkup from '../templates/filmsInGallery.hbs';
import { getRefs } from './get-refs';
import { updateMoviesData } from './update-movies-data';
import ItemsApiService from './fetch-items';

const itemsApiService = new ItemsApiService();
const refs = getRefs();
let filmToFind = '';

// Запрос страницы на популярные фильмы
async function renderTrandingPage(page) {
  itemsApiService.page = page;
 window.scrollTo({ top: 0, behavior: 'smooth' })
  const result = await itemsApiService.fetchTrandingItems();
  updateMoviesData(result).then(movies => (refs.moviesList.innerHTML = galleryMarkup(movies)));
}

// Запрос страницы на фильм по поиску
async function renderMovieToFindPage(page, filmToFind) {
  itemsApiService.query = filmToFind;
  itemsApiService.page = page;
 window.scrollTo({ top: 0, behavior: 'smooth' })
  const result = await itemsApiService.fetchItemsFromSearch();
  updateMoviesData(result).then(movies => (refs.moviesList.innerHTML = galleryMarkup(movies)));
}

async function renderTopPage(page) {
  itemsApiService.page = page;
 window.scrollTo({ top: 0, behavior: 'smooth' })
  const result = await itemsApiService.fetchTop();
  updateMoviesData(result).then(movies => (refs.moviesList.innerHTML = galleryMarkup(movies)));
}

export { renderTrandingPage, renderMovieToFindPage, renderTopPage };
