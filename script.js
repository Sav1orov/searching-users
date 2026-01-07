// Техническое задание
//
// Сделать запрос к публичному API JSONPlaceholder для получения списка пользователей
//     Отобразить список пользователей с их именем и email в виде карточек.
//     Реализовать поле поиска, которое позволяет фильтровать пользователей по имени.
//     При клике на карточку пользователя отображать дополнительную информацию о нём:
//     Адрес (улица, город).
//         Номер телефона.
//     Компания.
//     Добавить кнопку для обновления данных пользователей (сделать новый запрос к API).
//
// Требования
//
// Не использовать ChatGPT. Использование гугла разрешается. Задача - перебороть синдром "чистого листа"
// Использовать чистый JavaScript (без фреймворков).
// Простой и аккуратный дизайн через CSS.


// СБРОС ВСЕХ деталей при загрузке
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card__details').forEach(d => {
        d.style.display = 'none';
    });
});

const API_PRODUCTS_URL = 'https://jsonplaceholder.typicode.com/users';
const CARDS = document.querySelector('.cards-grid');
const SEARCH = document.querySelector('.search-bar__input')



const users = []

CARDS.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;

    // СКРЫВАЕМ ВСЕ детали
    document.querySelectorAll('.card__details').forEach(d => {
        d.style.display = 'none';
    });

    // ПОКАЗЫВАЕМ только этой
    const cardDetails = card.querySelector('.card__details');
    cardDetails.style.display = 'block';
});

SEARCH.addEventListener('input', () => {
    let value = SEARCH.value.toLowerCase();
    debouncedFilterUsers(value);

})

function debounceSearch(func, ms) {
    let timeoutId;
    return function preform(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), ms);
    }
}

const debouncedFilterUsers = debounceSearch(filterUsers, 300);

function renderUsers (user) {
    return `
        <a class="card" id="user-${user.id}">
            <div class="card__avatar">${user.name[0]}</div>
            <h3 class="card__name">${user.name}</h3>
            <p class="card__label">Email</p>
            <p class="card__email">${user.email}</p>

            <div class="card__details">
                <div class="card__section">
                    <h4 class="card__section-title">Адрес</h4>
                    <div class="card__item">
                        <span class="card__item-label">Улица</span>
                        <span class="card__item-value">${user.address.street}</span>
                    </div>
                    <div class="card__item">
                        <span class="card__item-label">Город</span>
                        <span class="card__item-value">${user.address.city}</span>
                    </div>
                    <div class="card__item">
                        <span class="card__item-label">Телефон</span>
                        <span class="card__item-value">${user.phone}</span>
                    </div>
                </div>
                <div class="card__section">
                    <h4 class="card__section-title">Компания</h4>
                    <div class="card__item">
                        <span class="card__item-value">${user.company.name}</span>
                    </div>
                </div>
            </div>
           </a> 
    `


}

function filterUsers(value) {
    let items = users.filter(user => user.name.toLowerCase().includes(value))
    renderAllUsers(items)

}

function renderAllUsers(usersArray) {
    CARDS.innerHTML = '';

    usersArray.forEach(user => {
        CARDS.insertAdjacentHTML('beforeend', renderUsers(user));
    });
}

function getUsers (data){
    users.length = 0;
    users.push(...data);
    renderAllUsers(users);
}

function loadUsersCatalog() {
    fetch(API_PRODUCTS_URL)
        .then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(data => {
            getUsers(data);
        })
        .catch(error => {
            console.log('Ошибка при получении данных с сервера: ', error);
        });
}



loadUsersCatalog();


