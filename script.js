const statusEl = document.getElementById('status');
const cardEl = document.getElementById('card');
const newVerseBtn = document.getElementById('newVerseBtn');
const copyBtn = document.getElementById('copyBtn');

const API_URL = 'https://www.abibliadigital.com.br/api/verses/nvi/random';

// Reserva de versículos caso a API esteja fora do ar
const FALLBACK = [
  { text: "O Senhor é o meu pastor; de nada terei falta.", book: "Salmos", chapter: 23, number: 1 },
  { text: "Tudo posso naquele que me fortalece.", book: "Filipenses", chapter: 4, number: 13 },
  { text: "O amor é paciente, o amor é bondoso.", book: "1 Coríntios", chapter: 13, number: 4 },
  { text: "Entrega o teu caminho ao Senhor; confia nele, e o mais ele fará.", book: "Salmos", chapter: 37, number: 5 },
  { text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.", book: "Isaías", chapter: 41, number: 10 }
];

let loading = false;

async function fetchVerse() {
  if (loading) return;
  loading = true;
  cardEl.classList.remove('loaded');
  newVerseBtn.disabled = true;
  copyBtn.style.display = 'none';
  statusEl.innerHTML = '<p class="loading">Buscando um versículo...</p>';

  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Falha na resposta da API');
    const data = await res.json();
    renderVerse(data.text, `${data.book.name} ${data.chapter}:${data.number}`);
  } catch (err) {
    const pick = FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
    renderVerse(pick.text, `${pick.book} ${pick.chapter}:${pick.number}`, true);
  } finally {
    loading = false;
    newVerseBtn.disabled = false;
  }
}

function renderVerse(text, ref, offline = false) {
  statusEl.innerHTML = `
    <p class="verse-text">${text}</p>
    <p class="verse-ref">${ref}${offline ? ' · reserva local, sem internet' : ''}</p>
  `;
  copyBtn.dataset.copyText = `"${text}" — ${ref}`;
  copyBtn.style.display = 'inline-block';
  requestAnimationFrame(() => cardEl.classList.add('loaded'));
}

copyBtn.addEventListener('click', () => {
  const text = copyBtn.dataset.copyText || '';
  navigator.clipboard.writeText(text).then(() => {
    const original = copyBtn.textContent;
    copyBtn.textContent = 'Copiado';
    setTimeout(() => { copyBtn.textContent = original; }, 1500);
  });
});

newVerseBtn.addEventListener('click', fetchVerse);

fetchVerse();