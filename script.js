const maps = [
  { name: 'Alif Garden', icon: '🌴', letters: [['ا', 'Alif'], ['ب', 'Baa'], ['ت', 'Taa'], ['ث', 'Thaa'], ['ج', 'Jeem']] },
  { name: 'Moon Oasis', icon: '🌺', letters: [['ح', 'Haa'], ['خ', 'Khaa'], ['د', 'Daal'], ['ذ', 'Dhaal'], ['ر', 'Raa']] },
  { name: 'Sound Harbor', icon: '⛵', letters: [['ز', 'Zay'], ['س', 'Seen'], ['ش', 'Sheen'], ['ص', 'Saad'], ['ض', 'Daad']] },
  { name: 'Letter Souk', icon: '🏺', letters: [['ط', 'Taa'], ['ظ', 'Dhaa'], ['ع', 'Ayn'], ['غ', 'Ghayn'], ['ف', 'Faa']] },
  { name: 'Alphabet Valley', icon: '🏕️', letters: [['ق', 'Qaaf'], ['ك', 'Kaaf'], ['ل', 'Laam'], ['م', 'Meem'], ['ن', 'Noon']] },
  { name: 'Letter Castle', icon: '🏰', letters: [['ه', 'Haa'], ['و', 'Waaw'], ['ي', 'Yaa']] },
];

const storageKey = 'hikaya-alphabet-progress';
const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
const progress = { completedMaps: saved.completedMaps || [], practised: saved.practised || {} };
let activeMap = Math.min(progress.completedMaps.length, maps.length - 1);
let returnFocus;

const lessonModal = document.querySelector('#lessonModal');
const certificateModal = document.querySelector('#certificateModal');
const toast = document.querySelector('.toast');
const save = () => localStorage.setItem(storageKey, JSON.stringify(progress));
const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
};
const speak = (letter, name) => {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(`${name}. ${letter}`);
  utterance.lang = 'ar-SA';
  speechSynthesis.speak(utterance);
};

function updateDashboard() {
  const learned = maps.reduce((total, map, index) => total + (progress.practised[index]?.length || 0), 0);
  const percent = Math.round((learned / 28) * 100);
  document.querySelector('#alphabetProgress').textContent = `${learned} of 28 letters`;
  document.querySelector('#alphabetPercent').textContent = `${percent}%`;
  document.querySelector('#alphabetProgressBar').style.width = `${percent}%`;
  document.querySelector('#starCount').textContent = (learned * 10).toLocaleString();

  document.querySelectorAll('.land').forEach((land, index) => {
    const complete = progress.completedMaps.includes(index);
    const unlocked = index === 0 || progress.completedMaps.includes(index - 1);
    const count = progress.practised[index]?.length || 0;
    const stars = '★'.repeat(count) + '☆'.repeat(maps[index].letters.length - count);
    land.classList.toggle('completed', complete);
    land.classList.toggle('current', unlocked && !complete);
    land.classList.toggle('locked', !unlocked);
    land.querySelector('.mini-stars').textContent = stars;
    land.querySelector('.status-badge').textContent = complete ? '✓' : unlocked ? '▶' : '🔒';
    const oldSpeech = land.querySelector('.speech');
    if (oldSpeech) oldSpeech.remove();
    if (unlocked && !complete && index === progress.completedMaps.length) {
      land.insertAdjacentHTML('afterbegin', '<div class="speech">Start here!</div>');
    }
  });

  const nextIndex = Math.min(progress.completedMaps.length, maps.length - 1);
  const allComplete = progress.completedMaps.length === maps.length;
  document.querySelector('#upNextLabel').textContent = allComplete ? 'ALPHABET COMPLETE' : `UP NEXT • MAP ${nextIndex + 1}`;
  document.querySelector('#upNextTitle').textContent = allComplete ? 'You know all 28 Arabic letters!' : `Explore ${maps[nextIndex].name}`;
  document.querySelector('#continueButton').innerHTML = allComplete ? 'View final certificate <span>🏆</span>' : `Start Map ${nextIndex + 1} <span>→</span>`;
}

function openMap(index, trigger) {
  const unlocked = index === 0 || progress.completedMaps.includes(index - 1);
  if (!unlocked) {
    showToast(`🔒 Complete Map ${index} to unlock ${maps[index].name}.`);
    return;
  }
  activeMap = index;
  returnFocus = trigger;
  const map = maps[index];
  document.querySelector('.map-modal-icon').textContent = map.icon;
  document.querySelector('#modalKicker').textContent = `MAP ${index + 1} OF 6 • ${map.letters.length} LETTERS`;
  document.querySelector('#modalTitle').textContent = map.name;
  const grid = document.querySelector('#letterGrid');
  grid.innerHTML = '';
  map.letters.forEach(([letter, name]) => {
    const button = document.createElement('button');
    const practised = progress.practised[index]?.includes(letter);
    button.className = `letter-card${practised ? ' practised' : ''}`;
    button.innerHTML = `<b>${letter}</b><span>${name}</span><i>${practised ? '✓' : '🔊'}</i>`;
    button.setAttribute('aria-label', `${name}, Arabic letter ${letter}`);
    button.addEventListener('click', () => practiseLetter(index, letter, name, button));
    grid.appendChild(button);
  });
  updateLessonProgress();
  lessonModal.classList.add('open');
  lessonModal.setAttribute('aria-hidden', 'false');
  document.querySelector('.close').focus();
}

function practiseLetter(index, letter, name, button) {
  progress.practised[index] ||= [];
  if (!progress.practised[index].includes(letter)) progress.practised[index].push(letter);
  button.classList.add('practised');
  button.querySelector('i').textContent = '✓';
  speak(letter, name);
  save();
  updateLessonProgress();
  updateDashboard();
}

function updateLessonProgress() {
  const count = progress.practised[activeMap]?.length || 0;
  const total = maps[activeMap].letters.length;
  const done = count === total;
  document.querySelector('#lessonProgress').textContent = `${count} of ${total} letters practised`;
  const button = document.querySelector('.done-button');
  button.disabled = !done;
  button.innerHTML = done ? 'Earn my certificate <span>🏅</span>' : 'Practise every letter <span>✓</span>';
}

function closeModal(modal) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  returnFocus?.focus();
}

function showCertificate(index) {
  activeMap = index;
  if (!progress.completedMaps.includes(index)) progress.completedMaps.push(index);
  progress.completedMaps.sort((a, b) => a - b);
  save();
  updateDashboard();
  closeModal(lessonModal);
  const map = maps[index];
  document.querySelector('#certificateLetters').textContent = map.letters.map(([letter]) => letter).join('  ');
  document.querySelector('#certificateMap').textContent = `${map.name} • Map ${index + 1}`;
  document.querySelector('#certificateDate').textContent = new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date());
  const nextButton = document.querySelector('#nextMapButton');
  nextButton.textContent = index === maps.length - 1 ? 'Back to my map ✓' : `Continue to Map ${index + 2} →`;
  certificateModal.classList.add('open');
  certificateModal.setAttribute('aria-hidden', 'false');
  document.querySelector('.certificate-close').focus();
}

document.querySelectorAll('.land').forEach((land, index) => {
  land.addEventListener('click', () => openMap(index, land));
  land.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openMap(index, land); }
  });
});
document.querySelector('#continueButton').addEventListener('click', (event) => {
  const index = Math.min(progress.completedMaps.length, maps.length - 1);
  if (progress.completedMaps.length === maps.length) showCertificate(maps.length - 1);
  else openMap(index, event.currentTarget);
});
document.querySelector('.done-button').addEventListener('click', () => showCertificate(activeMap));
document.querySelector('#printCertificate').addEventListener('click', () => window.print());
document.querySelector('#nextMapButton').addEventListener('click', () => {
  closeModal(certificateModal);
  if (activeMap < maps.length - 1) openMap(activeMap + 1, document.querySelector(`[data-map="${activeMap + 1}"]`));
});
document.querySelector('.close').addEventListener('click', () => closeModal(lessonModal));
document.querySelector('.certificate-close').addEventListener('click', () => closeModal(certificateModal));
[lessonModal, certificateModal].forEach((modal) => modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal(modal);
}));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (certificateModal.classList.contains('open')) closeModal(certificateModal);
    else if (lessonModal.classList.contains('open')) closeModal(lessonModal);
  }
});

updateDashboard();
