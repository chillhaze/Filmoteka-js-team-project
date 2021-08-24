/*
користування:
    import userLibrary from 'path/to/library';
    додати картку:          userLib.add(card);
    змінити картку:         userLib.update(card);
    видалити картку:        userLib.remove(card);
    отримати всі картки:    userLib.getAll();
    показати згідно вибраної кнопки: userLib.showFiltered();
*/
import Pagination from 'tui-pagination';
import galleryMarkup from '../templates/filmsInGallery.hbs';
import emptyLibrary from '../templates/empty-library.hbs';
import globalVariables from './global-variables';
import { HEADER_ENUM } from './header-switch';

const defaultOptions = {
  isSelectedStyle: 'form__btn--current',
  buttons: {
    watched: '#watched',
    queue: '#queue',
  },
  cardContainer: '.movie-list',
  pagination: '#pagination',
};

export const USER_LIBRARY_ENUM = {
  WATCHED: 'watched',
  QUEUE: 'queue',
};

const CLASSLIST_ACTION = {
  ADD: 'add',
  REMOVE: 'remove',
};

class UserLibrary {
  curLibrary = USER_LIBRARY_ENUM.WATCHED;
  #refs = {};
  #storage = new Storage();
  pagination;
  curPageWatched = 1;
  curPageQueue = 1;
  ITEMS_PER_PAGE = 20;
  bindAfterMove;
  constructor(args) {
    this.options = { ...defaultOptions, ...args };

    this.#refs.btnWatched = document.querySelector(this.options.buttons.watched);
    this.#refs.btnWatched.addEventListener('click', e => {
      this.switchTo(USER_LIBRARY_ENUM.WATCHED);
    });
    this.#refs.btnQueue = document.querySelector(this.options.buttons.queue);
    this.#refs.btnQueue.addEventListener('click', e => {
      this.switchTo(USER_LIBRARY_ENUM.QUEUE);
    });

    this.#refs.cardContainer = document.querySelector(this.options.cardContainer);
    this.#refs.pagination = document.querySelector(this.options.pagination);

    this.pagination = new Pagination(this.#refs.pagination, {
      itemsPerPage: this.ITEMS_PER_PAGE,
      centerAlign: true,
    });
    this.bindAfterMove = this.afterMove.bind(this);
    this.pagination.on('afterMove', this.bindAfterMove);

    Object.defineProperty(Array.prototype, 'getPage', {
      value: function getPage(pageNumber, itemsPerPage) {
        const start = pageNumber * itemsPerPage - itemsPerPage;
        const end = pageNumber * itemsPerPage;

        return this.slice(start, end);
      },
    });
  }

  afterMove(e) {
    if (globalVariables.curPage === HEADER_ENUM.LIBRARY) {
      if (this.curLibrary === USER_LIBRARY_ENUM.WATCHED) {
        this.curPageWatched = e.page;
      } else {
        this.curPageQueue = e.page;
      }
      this.showFiltered(e.page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  #setSelectedStyle(action1, action2) {
    this.#refs.btnQueue.classList[action1](this.options.isSelectedStyle);
    this.#refs.btnWatched.classList[action2](this.options.isSelectedStyle);
  }

  switchToCurrentLibrary() {
    this.switchTo(this.curLibrary);
  }

  switchTo(libraryEnum = USER_LIBRARY_ENUM.WATCHED) {
    this.curLibrary = libraryEnum;

    switch (this.curLibrary) {
      case USER_LIBRARY_ENUM.QUEUE:
        this.#setSelectedStyle(CLASSLIST_ACTION.ADD, CLASSLIST_ACTION.REMOVE);
        break;
      case USER_LIBRARY_ENUM.WATCHED:
        this.#setSelectedStyle(CLASSLIST_ACTION.REMOVE, CLASSLIST_ACTION.ADD);

        break;
    }
    this.resetPagination();
    this.showFiltered();
  }
  add(card) {
    this.#storage.add(card);
  }

  addOrUpdate(card) {
    if (this.getById(card.id)) {
      this.update(card);
    } else {
      this.add(card);
    }
  }

  getById(cardId) {
    return this.#storage.all().find(card => card.id === cardId);
  }
  getAll() {
    return this.#storage.all();
  }
  update(card) {
    this.#storage.update(card);
  }
  remove(card) {
    this.#storage.remove(card);
  }
  showFiltered(page = 1) {
    const cards = this.getFilteredCard();
    if (cards.length)
      this.#refs.cardContainer.innerHTML = galleryMarkup(cards.getPage(page, this.ITEMS_PER_PAGE));
    else this.#refs.cardContainer.innerHTML = emptyLibrary();
  }

  getFilteredCard() {
    return this.curLibrary === USER_LIBRARY_ENUM.WATCHED
      ? this.getWatchedCards()
      : this.getQuereueCards();
  }

  // Отримати всі картки isWatched
  getWatchedCards = () => this.#storage.all().filter(card => card?.isWatched);
  // Отримати всі картки isQueue
  getQuereueCards = () => this.#storage.all().filter(card => card?.isQueue);

  processCard(card) {
    if (card.isWatched || card.isQueue) {
      this.addOrUpdate(card);
    } else {
      this.remove(card);
    }
    if (globalVariables.curPage === HEADER_ENUM.LIBRARY) this.resetPagination();
  }

  resetPagination() {
    const cntCards =
      this.curLibrary === USER_LIBRARY_ENUM.WATCHED
        ? this.getWatchedCards().length
        : this.getQuereueCards().length;

    this.#refs.pagination.style.visibility = cntCards <= this.ITEMS_PER_PAGE ? 'hidden' : 'visible';
    this.pagination.reset(cntCards);
  }
}

class Storage {
  STORAGE_KEY = 'userLibrary';

  #db = [];

  constructor() {
    this.#load();
  }
  all() {
    return this.#db;
  }

  add(item) {
    const findItem = this.#db.find(i => i.id === item.id);
    if (!findItem) {
      this.#db.push(item);
      this.#save();
    }
  }

  update(item) {
    let findItem = this.#db.find(i => i.id === item.id);
    if (findItem) {
      this.remove(findItem);
      this.add({ ...findItem, ...item });
    }
  }
  remove(item) {
    this.#db = this.#db.filter(i => i.id !== item.id);
    this.#save();
  }

  #save() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.#db));
  }
  #load() {
    const str = localStorage.getItem(this.STORAGE_KEY);
    if (str) {
      try {
        this.#db = JSON.parse(str);
      } catch (error) {
        console.log(error.message);
      }
    }
  }
}

export default new UserLibrary();
