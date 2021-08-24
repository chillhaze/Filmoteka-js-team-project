const Theme = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
};

const body = document.querySelector('body');
const toggle = document.querySelector('#theme-switch-toggle');
toggle.addEventListener('change', onToggleChange);

// установка темы при загрузке страницы
const actualUserTheme = localStorage.getItem('theme');

if (actualUserTheme === Theme.DARK) {
  body.classList.add(Theme.DARK);
  localStorage.setItem('theme', Theme.DARK);
  toggle.checked = localStorage.getItem('chkbx-active');
} else {
  body.classList.add(Theme.LIGHT);
  localStorage.setItem('theme', Theme.LIGHT);
}

// переключение темы через чекбокс
function onToggleChange() {
  const actualUserTheme = localStorage.getItem('theme');
  let chkbxValue = toggle.checked;

  if (actualUserTheme === Theme.LIGHT) {
    localStorage.setItem('chkbx-active', chkbxValue);
    localStorage.removeItem(actualUserTheme);
    localStorage.setItem('theme', Theme.DARK);

    body.classList.remove(Theme.LIGHT);
    body.classList.add(Theme.DARK);
  } else {
    localStorage.setItem('chkbx-active', chkbxValue);
    localStorage.removeItem(actualUserTheme);
    localStorage.setItem('theme', Theme.LIGHT);

    body.classList.remove(Theme.DARK);
    body.classList.add(Theme.LIGHT);
  }
}
