'use strict';
import { getRefs } from './get-refs';
import ItemsApiService from './fetch-items.js';
import filmInModal from '../templates/filmInModal.hbs';
import notification from './pop-up-messages.js';
import { addToWatched, addToQueue } from './add-to-watched';
import userLibrary from './userLibrary';
import { updateMoviesData } from './update-movies-data';
import trailerInMovieMobile from '../templates/trailerInMovieMobile.hbs'
import trailerInMovieTablet from '../templates/trailerInMovieTablet.hbs'
import trailerInMovieDesktop from '../templates/trailerInMovieDesktop.hbs'


const itemsApiService = new ItemsApiService();
const refs = getRefs();
const goTopBtn = document.querySelector('.back_to_top');
const colorSwitcher = document.querySelector('.toolbar');
let card;
let modalMovieOverlay;
let modalMovieClose;
let modalTrailer;
let trailerToWatch;
let modalTrailerClose;

// Открытие модального окна с готовой карточкой

function openCardMovie(event) {

  const movieId = event.path[2].dataset.id ;

  if (movieId ) {
    renderCard(movieId);
    document.querySelector('body').classList.add('scroll-disable');
    goTopBtn.classList.add('visually-hidden');

  }

};

async function renderCard(movieId) {

  try {
    notification.onLoadingCircleAdd();
    card = await itemsApiService.fetchCard(movieId);
    // костиль для коректного відображення карточки
    card.genre_ids = card.genres.map(genre => genre.id);
    // отримуємо картку з виправленими полями
    card = (await updateMoviesData({ results: [card] }))[0];
    refs.modalMovie.innerHTML = filmInModal(card);
    notification.onLoadingCircleRemove();
    refs.modalMovie.classList.remove('visually-hidden');
    const localCard = userLibrary.getById(card.id);
    if (localCard) card = { ...card, ...localCard };
    const addToWatchBtn = document.querySelector("[data-name='watched']");
    if (card.isWatched) {
      addToWatchBtn.textContent = 'Remove from watched';
    }
    const addToQueueBtn = document.querySelector("[data-name='queue']");
    if (card.isQueue) {
      addToQueueBtn.textContent = 'Remove from queue';
    }
    trailerToWatch = document.querySelector('[data-name="trailer"]');
    modalMovieOverlay = document.querySelector('.modal-movie__overlay');
    modalMovieClose = document.querySelector('[data-action="modal-close"]');

    // добавление слушателей после формирования карточки
    modalMovieClose.addEventListener('click', closeCard);
    addToWatchBtn.addEventListener('click', addToWatchBtnListener);
    addToQueueBtn.addEventListener('click', addToQueueBtnListener);
    window.addEventListener('keydown', closeCardEsc);
    modalMovieOverlay.addEventListener('click', closeCard);
    trailerToWatch.addEventListener('click', openTrailer);
    return card;
  } catch (error) {
    notification.onError();
    console.log(error.message);
  }
}

function addToWatchBtnListener() {
  addToWatched(card);
}

function addToQueueBtnListener() {
  addToQueue(card);
}

const closeCard = event => {
  if (event.target === modalMovieOverlay || event.target === modalMovieClose) {
    closeCardMovie();
  }
};

const closeCardEsc = event => {
  if (event.key === 'Escape') {
    closeCardMovie();
  }
};

// Функция закрытия
const closeCardMovie = () => {
  refs.modalMovie.classList.add('visually-hidden');
  document.querySelector('body').classList.remove('scroll-disable');

  // Удаление слушателей
  const addToWatchBtn = document.querySelector("[data-name='watched']");
  const addToQueueBtn = document.querySelector("[data-name='queue']");

  window.removeEventListener('keydown', closeCardEsc);
  modalMovieClose.removeEventListener('click', closeCard);
  modalMovieOverlay.removeEventListener('click', closeCard);
  addToWatchBtn.removeEventListener('click', addToWatchBtnListener);
  addToQueueBtn.removeEventListener('click', addToQueueBtnListener);
  goTopBtn.classList.remove('visually-hidden');
  colorSwitcher.classList.remove('visually-hidden');
};

// Добавление трейлера в модальное окно

// Открытие модального окна с трейлером
function openTrailer(event) {
  const imdbId = event.target.dataset.id;
  renderTrailer(imdbId);
  modalMovieClose.removeEventListener('click', closeCard);
  modalMovieOverlay.removeEventListener('click', closeCard);
  window.removeEventListener('keydown', closeCardEsc);
  document.querySelector('.modal-movie').classList.add('scroll-disable');
};

// Закрытие окна с трейлером

const closeTrailer = (event) => {
  modalTrailer.classList.add('visually-hidden');
  const modalTrailerItem = document.querySelector('.modal-movie__video');
  modalTrailerItem.setAttribute("src", " ")
  modalMovieOverlay.removeEventListener('click', closeTrailer);
  modalTrailerClose.removeEventListener('click', closeTrailer);
  window.removeEventListener('keydown', closeTrailerEsc);
  modalMovieOverlay.addEventListener('click', closeCard);
  modalMovieClose.addEventListener('click', closeCard);
  window.addEventListener('keydown', closeCardEsc);
  document.querySelector('.modal-movie').classList.remove('scroll-disable');
 
};

const closeTrailerEsc = event => {
   if (event.key === "Escape") {
      closeTrailer();
   };
};

// Содание карточки с трейлером

async function renderTrailer(imdbId) {
try {
  const cardImdb = await itemsApiService.fetchTrailer(imdbId);
  const modalMovie = document.querySelector('.modal-movie')
  modalTrailer = document.querySelector('.modal-trailer');
  if (modalMovie.clientWidth >= 882) {
    modalTrailer.innerHTML = trailerInMovieDesktop(cardImdb);
  } else if (modalMovie.clientWidth <= 320) {
    modalTrailer.innerHTML = trailerInMovieMobile(cardImdb);
  } else {
    modalTrailer.innerHTML = trailerInMovieTablet(cardImdb);
  }
  modalTrailer.classList.remove(('visually-hidden'));
  modalTrailerClose = document.querySelector('.modal-trailer__btn--close');
  modalMovieOverlay.addEventListener('click', closeTrailer);
  modalTrailerClose.addEventListener('click', closeTrailer);
  window.addEventListener('keydown', closeTrailerEsc);
  modalMovieClose.removeEventListener('click', closeCard);
   modalMovieOverlay.removeEventListener('click', closeCard);
   window.removeEventListener('keydown', closeCardEsc);
  
} catch (error){
      console.log(error.message);
  };
};
export { openCardMovie, renderCard,  openTrailer, renderTrailer};
