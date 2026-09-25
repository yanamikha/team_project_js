(() => {
  const refs = {
    openModalBtn: document.querySelector('[data-modal-open]'),
    closeModalBtn: document.querySelector('[data-modal-close]'),
    modal: document.querySelector('[data-modal]'),
    body: document.body,
  };

  if (!refs.openModalBtn || !refs.closeModalBtn || !refs.modal || !refs.body) {
    return;
  }

  refs.openModalBtn.addEventListener('click', openModal);
  refs.closeModalBtn.addEventListener('click', closeModal);

  function toggleModal() {
    refs.modal.classList.toggle('is-hidden');
    refs.body.classList.toggle('no-scroll');
  }

  function onEscapePress(event) {
    if (event.code === 'Escape') {
      closeModal();
    }
  }

  function openModal() {
    toggleModal();
    window.addEventListener('keydown', onEscapePress);
  }

  function closeModal() {
    toggleModal();
    window.removeEventListener('keydown', onEscapePress);
  }
})();
