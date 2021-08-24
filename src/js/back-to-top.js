function scrollToTopBtn() {
  const goTopBtn = document.querySelector('.back_to_top');

  window.addEventListener('scroll', trackScroll);
  goTopBtn.addEventListener('click', backToTop);

  function trackScroll() {
    let scrolled = window.pageYOffset;
    let pageHeight = document.documentElement.clientHeight / 2;

    if (scrolled > pageHeight) {
      goTopBtn.classList.add('back_to_top-show');
    }
    if (scrolled < pageHeight) {
      goTopBtn.classList.remove('back_to_top-show');
    }
  }

  function backToTop() {
    if (window.pageYOffset > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

export { scrollToTopBtn };
