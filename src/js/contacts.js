const form = document.querySelector('.contacts-form');
const nameInput = form.querySelector('input[name="name"]');
const phoneInput = form.querySelector('input[name="phone"]');
const messageInput = form.querySelector('textarea[name="message"]');
const submitButton = form.querySelector('.contacts-button');

function validateName() {
  const value = nameInput.value.trim();

  return value.length >= 2 && value.length <= 64;
}

function showNameError() {
  const errorElement = nameInput
    .closest('.contacts-label')
    .querySelector('.contacts-error');

  nameInput.classList.add('is-error');
  errorElement.textContent = 'Name must be between 2 and 64 characters.';
}