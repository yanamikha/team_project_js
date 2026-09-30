import { openModal } from './success-modal.js';
import { createOrder } from './api.js';

const form = document.querySelector('.contacts-form');
const nameInput = form.querySelector('input[name="name"]');
const phoneInput = form.querySelector('input[name="phone"]');
const messageInput = form.querySelector('textarea[name="message"]');
const submitButton = form.querySelector('.contacts-button');
const loader = form.querySelector('.loader');

// =========================
// VALIDATION
// =========================

function validateName() {
  const value = nameInput.value.trim();

  return value.length >= 2 && value.length <= 64;
}

function validatePhone() {
  const digits = phoneInput.value.replace(/\D/g, '');

  return /^\d{12}$/.test(digits);
}

function validateMessage() {
  const value = messageInput.value.trim();

  return value === '' || (value.length >= 5 && value.length <= 256);
}

// =========================
// ERROR HELPERS
// =========================

function getErrorElement(input) {
  return input.closest('.contacts-label').querySelector('.contacts-error');
}

// =========================
// NAME
// =========================

function showNameError() {
  const errorElement = getErrorElement(nameInput);

  nameInput.classList.add('is-error');
  errorElement.textContent = 'Name must be between 2 and 64 characters.';
}

function clearNameError() {
  const errorElement = getErrorElement(nameInput);

  nameInput.classList.remove('is-error');
  errorElement.textContent = '';
}

// =========================
// PHONE
// =========================

function showPhoneError() {
  const errorElement = getErrorElement(phoneInput);

  phoneInput.classList.add('is-error');
  errorElement.textContent = 'Phone must contain exactly 12 digits.';
}

function clearPhoneError() {
  const errorElement = getErrorElement(phoneInput);

  phoneInput.classList.remove('is-error');
  errorElement.textContent = '';
}

phoneInput.addEventListener('input', () => {
  if (validatePhone()) {
    clearPhoneError();
  }
});

// =========================
// MESSAGE
// =========================

function showMessageError() {
  const errorElement = getErrorElement(messageInput);

  messageInput.classList.add('is-error');
  errorElement.textContent = 'Message must be between 5 and 256 characters.';
}

function clearMessageError() {
  const errorElement = getErrorElement(messageInput);

  messageInput.classList.remove('is-error');
  errorElement.textContent = '';
}

// =========================
// FORM SUBMIT
// =========================

form.addEventListener('submit', async event => {
  event.preventDefault();

  const isNameValid = validateName();
  const isPhoneValid = validatePhone();
  const isMessageValid = validateMessage();

  if (isNameValid) {
    clearNameError();
  } else {
    showNameError();
  }

  if (isPhoneValid) {
    clearPhoneError();
  } else {
    showPhoneError();
  }

  if (isMessageValid) {
    clearMessageError();
  } else {
    showMessageError();
  }

  if (!isNameValid || !isPhoneValid || !isMessageValid) {
    return;
  }

  const orderData = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.replace(/\D/g, ''),
  };

  const message = messageInput.value.trim();

  if (message) {
    orderData.message = message;
  }

  submitButton.disabled = true;
  loader.classList.remove('is-hidden');

  try {
    await createOrder(orderData);

    form.reset();

    clearNameError();
    clearPhoneError();
    clearMessageError();

    openModal();
  } catch (error) {
    console.error('Request error:', error);
  } finally {
    submitButton.disabled = false;
    loader.classList.add('is-hidden');
  }
});
