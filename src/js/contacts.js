const form = document.querySelector('.contacts-form');
const nameInput = form.querySelector('input[name="name"]');
const phoneInput = form.querySelector('input[name="phone"]');
const messageInput = form.querySelector('textarea[name="message"]');
const submitButton = form.querySelector('.contacts-button');
const loader = form.querySelector('.contacts-loader');
const ORDERS_URL =
  'https://wedding-photographer.b.goit.study/api/orders';

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

function clearNameError() {
  const errorElement = nameInput
    .closest('.contacts-label')
    .querySelector('.contacts-error');

  nameInput.classList.remove('is-error');
  errorElement.textContent = '';
}

function showPhoneError() {
  const errorElement = phoneInput
    .closest('.contacts-label')
    .querySelector('.contacts-error');

  phoneInput.classList.add('is-error');
  errorElement.textContent = 'Phone must contain exactly 12 digits.';
}

function clearPhoneError() {
  const errorElement = phoneInput
    .closest('.contacts-label')
    .querySelector('.contacts-error');

  phoneInput.classList.remove('is-error');
  errorElement.textContent = '';
}

function showMessageError() {
  const errorElement = messageInput
    .closest('.contacts-label')
    .querySelector('.contacts-error');

  messageInput.classList.add('is-error');
  errorElement.textContent = 'Message must be between 5 and 256 characters.';
}

function clearMessageError() {
  const errorElement = messageInput
    .closest('.contacts-label')
    .querySelector('.contacts-error');

  messageInput.classList.remove('is-error');
  errorElement.textContent = '';
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const isNameValid = validateName();
  const isPhoneValid = validatePhone();
  const isMessageValid = validateMessage();

  if (!isNameValid) {
    showNameError();
  } else {
    clearNameError();
  }

  if (!isPhoneValid) {
    showPhoneError();
  } else {
    clearPhoneError();
  }

  if (!isMessageValid) {
    showMessageError();
  } else {
    clearMessageError();
  }

  if (!isNameValid || !isPhoneValid || !isMessageValid) {
    return;
  }

  const orderData = {
  name: nameInput.value.trim(),
  phone: phoneInput.value.replace(/\D/g, ''),
  message: messageInput.value.trim(),
};
console.log(orderData);

submitButton.disabled = true;

loader.classList.remove('is-hidden');

fetch(ORDERS_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(orderData),
})
  .then(response => {
    console.log('Status:', response.status);

    return response.json();
  })
  .then(data => {
    console.log('Server response:', data);
    form.reset();
  })
  .catch(error => {
  console.error('Request error:', error);
})
.finally(() => {
  submitButton.disabled = false;
  loader.classList.add('is-hidden');
});

});

function validatePhone() {
  const digits = phoneInput.value.replace(/\D/g, '');

  return /^\d{12}$/.test(digits);
}

function validateMessage() {
  const value = messageInput.value.trim();

  return value === '' || (value.length >= 5 && value.length <= 256);
}