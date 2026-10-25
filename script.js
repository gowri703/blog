// ===== DARK MODE TOGGLE =====
const root = document.documentElement;
const btn = document.getElementById('theme-btn');

function applyTheme(isDark) {
  root.classList.toggle('dark', isDark);
  btn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Read saved choice (works on both pages)
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
applyTheme(saved === 'dark');

// Button click
btn.addEventListener('click', function () {
  const goDark = !root.classList.contains('dark');
  applyTheme(goDark);
  try { localStorage.setItem('theme', goDark ? 'dark' : 'light'); } catch (e) {}
});

// ===== SHOW THE RIGHT ARTICLE (only runs on article.html) =====
const post1 = document.getElementById('post1');
const post2 = document.getElementById('post2');

if (post1 && post2) {
  const params = new URLSearchParams(window.location.search);
  const which = params.get('post') === '2' ? post2 : post1;
  which.hidden = false;
}