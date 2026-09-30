import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getCategories, getPhotos } from './api.js';
import { createGallery, clearGallery } from './gallery.js';

const categoriesContainer = document.querySelector('ul.portfolio__categories');
const loadMoreBtn = document.querySelector('#load-more-btn');
const loaderEl = document.querySelector('#loader');
const loaderTextEl = document.querySelector('#loaderText');
const galleryEl = document.querySelector('ul.portfolio__gallery');

const LIMIT = 3;
const INITIAL_PAGES = 3;

let page = 1;
let totalCount = 0;
let selectedCategory = { category: 'All Photos', id: '' };

const categories = await getCategories();

if (categories.length === 0) {
  iziToast.error({
    theme: 'dark',
    position: 'topRight',
    maxWidth: 432,
    backgroundColor: '#EF4040',
    icon: 'fa-solid fa-triangle-exclamation',
    message:
      'Sorry, there are no images matching your search query. Please try again!',
  });
}

categories.unshift(selectedCategory);

const filterButtons = categories
  .map(function ({ category, _id }) {
    return `
      <li class="portfolio__filter-item">
        <button
          type="button"
          aria-label="${category} filter button"
          aria-expanded="false"
          data-id="${_id || ''}"
          data-label="${category}"
          class="${!_id ? 'pressed' : ''}"
        >
          ${category}
        </button>
      </li>
    `;
  })
  .join('');

categoriesContainer.innerHTML = filterButtons;

loadInitialPhotos('');

categoriesContainer.addEventListener('click', function (event) {
  const button = event.target.closest('button');

  if (!button) {
    return;
  }

  const currentPressedButton =
    categoriesContainer.querySelector('button.pressed');

  if (currentPressedButton) {
    currentPressedButton.classList.remove('pressed');
  }

  button.classList.add('pressed');

  const categoryId = button.dataset.id;

  selectedCategory.id = categoryId;
  page = 1;

  clearGallery();
  loadInitialPhotos(categoryId);
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;

  const params = {
    page,
    limit: LIMIT,
  };

  if (selectedCategory.id) {
    params.categoryId = selectedCategory.id;
  }

  showLoader();
  hideLoadMoreButton();

  try {
    const answer = await getPhotos(params);

    totalCount = answer.totalItems;

    const oldCardsCount = galleryEl.children.length;

    createGallery(answer.weddingPhotos, true);

    const firstNewCard = galleryEl.children[oldCardsCount + LIMIT - 1];
    firstNewCard?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  } catch (error) {
    page -= 1;

    iziToast.error({
      message: 'Something went wrong. Please try again!',
      position: 'topRight',
    });

    console.error(error);
  } finally {
    hideLoader();
    updateLoadMoreButton();
  }
});

async function loadInitialPhotos(id) {
  showLoader();
  hideLoadMoreButton();

  try {
    const requests = [];

    for (let currentPage = 1; currentPage <= INITIAL_PAGES; currentPage++) {
      const params = {
        page: currentPage,
        limit: LIMIT,
      };

      if (id) {
        params.categoryId = id;
      }

      requests.push(getPhotos(params));
    }

    const results = await Promise.all(requests);

    const photos = results.flatMap(result => result.weddingPhotos);

    totalCount = results[0]?.totalItems || 0;
    page = INITIAL_PAGES;

    createGallery(photos);
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again!',
      position: 'topRight',
    });

    console.error(error);
  } finally {
    hideLoader();
    updateLoadMoreButton();
  }
}

function showLoader() {
  loaderTextEl.textContent = 'Loading images, please wait...';
  loaderEl.classList.remove('visually-hidden');
}

function hideLoader() {
  loaderTextEl.textContent = '';
  loaderEl.classList.add('visually-hidden');
}

function updateLoadMoreButton() {
  const loadedPhotos = page * LIMIT;

  if (loadedPhotos < totalCount) {
    loadMoreBtn.classList.remove('visually-hidden');
  } else {
    loadMoreBtn.classList.add('visually-hidden');
  }
}

function hideLoadMoreButton() {
  loadMoreBtn.classList.add('visually-hidden');
}
