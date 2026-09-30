import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard } from 'swiper/modules';
import { getFeedbacks } from './api.js';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const feedbacksList = document.querySelector('.feedbacks-list');

function createFeedbacksMarkup(feedbacks) {
  return feedbacks
    .map(
      ({ descr, name }) => `
        <li class="feedbacks-card swiper-slide">
          <p class="feedbacks-text">"${descr}"</p>
          <p class="feedbacks-author">${name}</p>
        </li>
      `
    )
    .join('');
}

function initSwiper() {
  new Swiper('.feedbacks-swiper', {
    modules: [Navigation, Pagination, Keyboard],

    slidesPerView: 1,
    spaceBetween: 16,

    navigation: {
      nextEl: '.feedbacks-button-next',
      prevEl: '.feedbacks-button-prev',
    },

    pagination: {
      el: '.feedbacks-pagination',
      clickable: true,
    },

    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });
}

async function loadFeedbacks() {
  try {
    const data = await getFeedbacks();

    const sortedFeedbacks = [...data.feedbacks].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    feedbacksList.innerHTML = createFeedbacksMarkup(sortedFeedbacks);

    initSwiper();
  } catch (error) {
    console.error('Failed to load feedbacks:', error);
  }
}

loadFeedbacks();