import genresTranslator from '../genres';

const updateMoviesData = async result => {
  const updatedMovies = result.results.map(movie => {
    let genres = [];
    let movieYear = '';

    if (movie.genre_ids.length) {
      genres = movie.genre_ids.map(genreId => {
        const currentGenre = genresTranslator.find(singleGenre => singleGenre.id === genreId);

        return ' ' + currentGenre.name;
      });
    } else {
      genres = ['Secret genre'];
    }

    if (movie.release_date) {
      movieYear = movie.release_date.slice(0, 4);
    } else {
      movieYear = 'Long ago';
    }

    if (genres.length > 3) {
      const cutGenres = genres.slice(0, 2);

      const modifiedGenre = [...cutGenres, ' Other'];

      return {
        ...movie,
        genres: modifiedGenre,
        movieYear,
      };
    }

    return {
      ...movie,
      genres,
      movieYear,
    };
  });

  return updatedMovies;
};

export { updateMoviesData };
