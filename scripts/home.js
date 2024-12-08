const userData = JSON.parse(localStorage.getItem('userName'));

const heading = document.querySelector('h1');

heading.innerHTML = heading.textContent + userData.name;