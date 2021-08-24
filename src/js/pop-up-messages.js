import Notiflix from 'notiflix';
const notiflixParams = {
  position: 'center-top',
  timeout: 1000,
  success: {
  background: '#FF6B01',
    },
    warning: {
        background: '#FF6B01',
        textColor:'#000000'
  }
}

class Notification {
    constructor(notiflixParams) {
        this.options = notiflixParams;
    }
    
    onAddToWatched() {
        Notiflix.Notify.success('Added to Watched', this.options)
    }

    onDeleteFromWatched() {
        Notiflix.Notify.warning('Deleted from Watched',  this.options)
    }

    onAddToQueue() {
        Notiflix.Notify.success('Added to Queue',  this.options)
    }

    onDeleteFromQueue() {
        Notiflix.Notify.warning('Deleted from Queue',  this.options)
    }

    onLoadingCircleAdd() {
        Notiflix.Loading.circle('Please wait ...', this.options);
    }
    onLoadingCircleRemove() {
        Notiflix.Loading.remove();
    }

    onError() {
        Notiflix.Notify.info('Oops! Something went wrong, please try again', this.options);
    }
}

export default new Notification(notiflixParams);