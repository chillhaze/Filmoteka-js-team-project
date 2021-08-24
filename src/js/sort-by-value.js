
import { getPopularFilms } from './get-popular-films';
import { getTop } from './get-top-films';
import { getRefs } from './get-refs'
const refs  = getRefs()

function onSortChange() {

  if (refs.sort.value === "rating") {
    getTop()
}
  if (refs.sort.value === "popular") {
   getPopularFilms()
  }

}

export {onSortChange}