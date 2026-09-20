const modal = document.querySelector('#lessonModal');
const toast = document.querySelector('.toast');
const openLesson = () => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.querySelector('.close').focus();
};
const closeLesson = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.querySelector('#continueButton').focus();
};

document.querySelector('#continueButton').addEventListener('click', openLesson);
document.querySelector('.play').addEventListener('click', (event) => {
  event.stopPropagation();
  openLesson();
});
document.querySelector('.land-3').addEventListener('click', openLesson);
document.querySelector('.close').addEventListener('click', closeLesson);
modal.addEventListener('click', (event) => { if (event.target === modal) closeLesson(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.classList.contains('open')) closeLesson(); });

document.querySelectorAll('.letter-row button').forEach((letter) => {
  letter.addEventListener('click', () => {
    letter.classList.toggle('played');
    const utterance = new SpeechSynthesisUtterance(letter.textContent);
    utterance.lang = 'ar-SA';
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  });
});

document.querySelector('.done-button').addEventListener('click', () => {
  document.querySelector('#starCount').textContent = '1,270';
  closeLesson();
  toast.textContent = '⭐ Wonderful! You earned 30 stars.';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
});

document.querySelectorAll('.locked').forEach((land) => land.addEventListener('click', () => {
  toast.textContent = `🔒 Finish Word Harbor to unlock ${land.dataset.lesson}.`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}));

document.querySelectorAll('.completed').forEach((land) => land.addEventListener('click', () => {
  toast.textContent = `✓ ${land.dataset.lesson} complete — all 3 stars collected!`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}));
