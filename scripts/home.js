const userData = JSON.parse(localStorage.getItem('userName'));

const heading = document.querySelector('article');

heading.innerHTML = heading.textContent + userData.name;