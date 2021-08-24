import axios from 'axios';

export default class ItemsApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }

  fetchTrandingItems() {
    const BASE_URL = 'https://api.themoviedb.org';
    const URL_TRANDING_ITEMS = '/3/trending/movie/day';
    const API_KEY = '5fa4bb8a58c85ac583b1447954dde7e6';

    const url = `${BASE_URL}${URL_TRANDING_ITEMS}?api_key=${API_KEY}&page=${this.page}`;

    return axios
      .get(url)
      .then(response => {
        // return response.data.results;
        return response.data;
      })
      .catch(error => console.log(error.message));
  }

  fetchItemsFromSearch() {
    const BASE_URL = 'https://api.themoviedb.org';
    const URL_SEARCHED_ITEMS = '/3/search/movie';
    const API_KEY = '5fa4bb8a58c85ac583b1447954dde7e6';

    const url = `${BASE_URL}${URL_SEARCHED_ITEMS}?api_key=${API_KEY}&language=en-US&page=${this.page}&include_adult=false&query=${this.searchQuery}`;

    return axios
      .get(url)
      .then(response => {
        // return response.data.results;
        return response.data;
      })
      .catch(error => console.log(error.message));
  }

  fetchCard(movieId) {
    const BASE_URL = 'https://api.themoviedb.org';
    const URL_CARD = `/3/movie/${movieId}`;
    const API_KEY = '5fa4bb8a58c85ac583b1447954dde7e6';

    const url = `${BASE_URL}${URL_CARD}?api_key=${API_KEY}`;

    return axios
      .get(url)
      .then(response => {
        return response.data;
      })
      .catch(error => console.log(error.message));
  }


  fetchTrailer(imdbId) {
    const BASE_URL = 'https://imdb-api.com/en/API/Trailer';
    const URL_CARD = `${imdbId}`;
    const API_KEY = 'k_m2kmax97';
    const url = `${BASE_URL}/${API_KEY}/${URL_CARD}`;
     return axios
      .get(url)
      .then(response => {
        return response.data;
      })
      .catch(error => console.log(error.message));

  };


    

  fetchTop() {
    const BASE_URL = 'https://api.themoviedb.org/3/movie/top_rated';
    const API_KEY = '5fa4bb8a58c85ac583b1447954dde7e6';
    const url = `${BASE_URL}?api_key=${API_KEY}&language=en-US&page=${this.page}`;

    return axios
      .get(url)
      .then(response => {
        return response.data;
      })
      .catch(error => console.log(error.message));

  };


 
  

  resetPage() {
    this.page = 1;
  }

  setPage(pageNumber) {
    this.page = pageNumber;
  }

  incrementPage() {
    this.page += 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
