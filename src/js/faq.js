const faqItems = document.querySelectorAll('.faq-item');

function toggleFaqItem(item) {
  const button = item.querySelector('.faq-question');
  const isOpen = button.getAttribute('aria-expanded') === 'true';

  button.setAttribute('aria-expanded', String(!isOpen));
  item.classList.toggle('is-open', !isOpen);
}

function initFaq() {
  faqItems.forEach(function (item) {
    const button = item.querySelector('.faq-question');

    button.addEventListener('click', function () {
      toggleFaqItem(item);
    });
  });
}

initFaq();