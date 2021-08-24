import SimpleLightbox from "simplelightbox";
const teamContainer = document.querySelector('.footer__link');
const bodyEl = document.querySelector('body');
const modal = document.querySelector('.modal-team');
const overlay = document.querySelector('.overlay');
const modalBtnClose = document.querySelector('.team-btn-close');

const modalImage = new SimpleLightbox('.modal-team a');

teamContainer.addEventListener('click', onOpenModal);

function onOpenModal(event) {
  event.preventDefault();

  window.addEventListener("keydown", modalCloseByEscape);
  modalBtnClose.addEventListener("click", modalClose);
  overlay.addEventListener("click", modalClose);
  modal.classList.add("is-open");
  bodyEl.classList.add("is-open");//убирает скролл при открытой модалке
 
};

function modalClose(event) {
  const isModalOpen = modal.classList.contains("is-open");//проверка открыто ли модальное окно
  if (!isModalOpen) {
    return;
  }
  modal.classList.remove("is-open");
  bodyEl.classList.remove("is-open");//добавляет скролл при закрытой модалке
  window.removeEventListener("keydown", modalCloseByEscape);
  modalBtnClose.removeEventListener("click", modalClose);
  overlay.removeEventListener("click", modalClose);
  
  
  };

function modalCloseByEscape(event) {
  if (event.code === "Escape") {
    modalClose();
    
    }
};