// ================= DARK MODE =================
const root = document.documentElement;
const themeBtn = document.getElementById('theme-btn');

function applyTheme(isDark) {
  root.classList.toggle('dark', isDark);
  themeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (e) {}
applyTheme(savedTheme === 'dark');

themeBtn.addEventListener('click', function () {
  const goDark = !root.classList.contains('dark');
  applyTheme(goDark);
  try { localStorage.setItem('theme', goDark ? 'dark' : 'light'); } catch (e) {}
});

// ================= POSTS DATA =================
// Built-in posts. Posts you add are stored in localStorage under "posts".
// Deleted built-in posts are remembered in localStorage under "hiddenSeeds".
const SEED_POSTS = [
  {
    id: 'seed1',
    title: 'Why Does Dark Mode Even Exist?',
    category: 'Technology',
    date: 'Oct 20, 2026',
    readTime: 4,
    summary: 'Almost every app now has a dark theme, but is it really better for your eyes? We look at where it came from and when it actually helps.',
    image: '',
    content:
`Open your phone at night and you will probably be greeted by a bright white screen that feels like staring at a torch. That is exactly the problem dark mode tries to solve.

## A Quick History
Believe it or not, dark mode is older than light mode. The earliest computer monitors showed glowing green or white text on a black background, because that was how the technology worked. When Windows and Mac introduced paper-like white screens in the 1980s, dark interfaces slowly disappeared. Now they are back, and everyone loves them.

## Does It Save Battery?
Yes, but only on certain screens. On OLED and AMOLED displays, every pixel makes its own light, so a black pixel is simply switched off. On older LCD screens, the backlight stays on anyway, so the savings are very small.

## Is It Better for Your Eyes?
Dark mode reduces glare and feels more comfortable in dim rooms. However, in bright daylight, dark text on a light background is usually easier to read. So neither mode is best for everyone.

## Quick Tips
- Use dark mode at night or in low-light rooms.
- Use light mode in bright places like outdoors.
- Take a 20-second break every 20 minutes, whichever mode you use.

## Final Thoughts
Dark mode is not magic, but it is a great option to have. Click the button at the top of this page and see for yourself!`
  },
  {
    id: 'seed2',
    title: '5 Study Habits That Actually Work',
    category: 'Student Life',
    date: 'Oct 22, 2026',
    readTime: 5,
    summary: 'Studying for hours does not always mean learning more. Here are five simple habits that help you remember more in less time.',
    image: '',
    content:
`We have all pulled the late-night "read everything again" session before exams, only to forget half of it the next morning. Follow these five habits and you will study smarter, not longer.

## 1. Test Yourself, Don't Just Re-read
Re-reading feels productive, but your brain is just recognizing the words. Close the book and try to write or say what you remember. This is called active recall.

## 2. Space It Out
Studying one topic for 5 hours in one day is far less effective than 1 hour a day across 5 days. Spacing gives your brain time to store information in long-term memory.

## 3. Teach It to Someone
Try explaining a concept to a friend, or even to your wall. If you get stuck, you have just found the part you do not understand yet.

## 4. Use Short Focus Sessions
Try the Pomodoro method: study for 25 minutes, then take a 5-minute break. Short sprints keep your mind fresh.

## 5. Sleep Is Part of Studying
Your brain organizes what you learned while you sleep. Skipping sleep to study more usually backfires.

## Final Thoughts
Pick one habit this week, try it, and see how it feels. All the best for your exams!`
  }
];

const GRADIENTS = [
  'linear-gradient(135deg, #7a5320, #2a1a0a)',
  'linear-gradient(135deg, #3b2f8f, #12102e)',
  'linear-gradient(135deg, #0f6b5c, #07211d)',
  'linear-gradient(135deg, #8f2f4a, #2b0d16)'
];

// ----- storage helpers -----
function getUserPosts() {
  try { return JSON.parse(localStorage.getItem('posts') || '[]'); }
  catch (e) { return []; }
}
function saveUserPosts(list) {
  try { localStorage.setItem('posts', JSON.stringify(list)); return true; }
  catch (e) { return false; }
}
function getHiddenSeeds() {
  try { return JSON.parse(localStorage.getItem('hiddenSeeds') || '[]'); }
  catch (e) { return []; }
}
function saveHiddenSeeds(list) {
  try { localStorage.setItem('hiddenSeeds', JSON.stringify(list)); }
  catch (e) {}
}

// ----- post helpers -----
function getAllPosts() {
  const hidden = getHiddenSeeds();
  const visibleSeeds = SEED_POSTS.filter(function (p) { return hidden.indexOf(p.id) === -1; });
  // newest user posts first, then the built-in ones
  return getUserPosts().slice().reverse().concat(visibleSeeds);
}
function findPost(id) {
  return getAllPosts().find(function (p) { return p.id === id; });
}
function isSeed(id) {
  return id.indexOf('seed') === 0;
}

// Deletes a post. Built-in posts are hidden, your own posts are removed for good.
function deletePost(id) {
  if (isSeed(id)) {
    const hidden = getHiddenSeeds();
    if (hidden.indexOf(id) === -1) hidden.push(id);
    saveHiddenSeeds(hidden);
  } else {
    saveUserPosts(getUserPosts().filter(function (p) { return p.id !== id; }));
  }
}

function pickGradient(id) {
  let sum = 0;
  for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
  return GRADIENTS[sum % GRADIENTS.length];
}
function backgroundFor(post) {
  return post.image ? 'url("' + post.image + '")' : pickGradient(post.id);
}
function esc(text) {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

// Turns the plain text of a post into HTML (## heading, - bullet, blank line = new paragraph)
function renderContent(text) {
  const lines = text.split('\n');
  let html = '';
  let para = [];
  let list = [];

  function flushPara() {
    if (para.length) { html += '<p>' + para.map(esc).join('<br>') + '</p>'; para = []; }
  }
  function flushList() {
    if (list.length) { html += '<ul>' + list.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>'; list = []; }
  }

  lines.forEach(function (raw) {
    const line = raw.trim();
    if (line === '') { flushPara(); flushList(); }
    else if (line.indexOf('## ') === 0) { flushPara(); flushList(); html += '<h2>' + esc(line.slice(3)) + '</h2>'; }
    else if (line.indexOf('- ') === 0) { flushPara(); list.push(line.slice(2)); }
    else { flushList(); para.push(line); }
  });
  flushPara();
  flushList();
  return html;
}

// ================= HOME PAGE: show cards =================
const grid = document.getElementById('post-grid');

function renderHome() {
  grid.innerHTML = '';
  const posts = getAllPosts();

  if (posts.length === 0) {
    grid.innerHTML = '<p class="empty-msg">No posts yet. Click "+ New Post" to write one.</p>';
  }

  posts.forEach(function (post) {
    const card = document.createElement('article');
    card.className = 'post-card';
    card.innerHTML =
      '<div class="bg"></div>' +
      '<button class="card-delete" aria-label="Delete post">🗑 Delete</button>' +
      '<div class="content">' +
        '<span class="tag">' + esc(post.category) + '</span>' +
        '<h3>' + esc(post.title) + '</h3>' +
        '<p class="meta">📅 ' + esc(post.date) + ' &nbsp;•&nbsp; ⏱️ ' + post.readTime + ' min read</p>' +
        '<p class="summary">' + esc(post.summary) + '</p>' +
        '<a class="read-more" href="article.html?id=' + encodeURIComponent(post.id) + '">Read More →</a>' +
      '</div>';
    card.querySelector('.bg').style.backgroundImage = backgroundFor(post);

    card.querySelector('.card-delete').addEventListener('click', function () {
      if (confirm('Delete "' + post.title + '"?')) {
        deletePost(post.id);
        renderHome();
      }
    });

    grid.appendChild(card);
  });

  // "Restore deleted posts" button (only shows if a built-in post was deleted)
  const oldRestore = document.getElementById('restore-wrap');
  if (oldRestore) oldRestore.remove();

  if (getHiddenSeeds().length > 0) {
    const wrap = document.createElement('div');
    wrap.id = 'restore-wrap';
    wrap.className = 'restore-wrap';
    wrap.innerHTML = '<button class="restore-btn">↺ Restore deleted posts</button>';
    wrap.querySelector('button').addEventListener('click', function () {
      saveHiddenSeeds([]);
      renderHome();
    });
    grid.parentNode.appendChild(wrap);
  }
}

if (grid) renderHome();

// ================= ARTICLE PAGE: show one post =================
const postBox = document.getElementById('post-box');
const bgLayer = document.getElementById('bg-layer');
if (postBox) {
  const id = new URLSearchParams(window.location.search).get('id') || 'seed1';
  const post = findPost(id);

  if (!post) {
    postBox.innerHTML = '<h1>Post not found</h1><p>This post may have been deleted.</p>' +
      '<div class="box-actions"><a href="index.html" class="pill-btn">← Back to Home</a></div>';
  } else {
    document.title = post.title + ' | The Daily Byte';
    bgLayer.style.backgroundImage = backgroundFor(post);

    postBox.innerHTML =
      '<span class="tag">' + esc(post.category) + '</span>' +
      '<h1>' + esc(post.title) + '</h1>' +
      '<p class="meta">📅 ' + esc(post.date) + ' &nbsp;•&nbsp; ⏱️ ' + post.readTime + ' min read</p>' +
      renderContent(post.content) +
      '<div class="box-actions">' +
        '<a href="index.html" class="pill-btn">← Back to Home</a>' +
        '<button class="delete-btn" id="delete-btn">Delete Post</button>' +
      '</div>';

    document.getElementById('delete-btn').addEventListener('click', function () {
      if (confirm('Delete this post?')) {
        deletePost(id);
        window.location.href = 'index.html';
      }
    });
  }
}

// ================= NEW POST PAGE: form =================
const form = document.getElementById('post-form');
if (form) {
  const fileInput = document.getElementById('image');
  const preview = document.getElementById('preview');
  const msg = document.getElementById('form-msg');
  let imageData = '';

  // Shrinks the image so it fits in localStorage
  function compressImage(file, done) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const maxW = 1400;
        let w = img.width, h = img.height;
        if (w > maxW) { h = h * maxW / w; w = maxW; }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        done(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  fileInput.addEventListener('change', function () {
    const file = fileInput.files[0];
    if (!file) { imageData = ''; preview.hidden = true; return; }
    compressImage(file, function (data) {
      imageData = data;
      preview.src = data;
      preview.hidden = false;
      bgLayer.style.backgroundImage = 'url("' + data + '")';   // live preview as the page background
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const content = document.getElementById('content').value.trim();
    const words = content.split(/\s+/).length;

    const newPost = {
      id: 'user' + Date.now(),
      title: document.getElementById('title').value.trim(),
      category: document.getElementById('category').value.trim(),
      summary: document.getElementById('summary').value.trim(),
      content: content,
      image: imageData,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      readTime: Math.max(1, Math.round(words / 200))
    };

    const list = getUserPosts();
    list.push(newPost);

    if (saveUserPosts(list)) {
      window.location.href = 'article.html?id=' + encodeURIComponent(newPost.id);
    } else {
      msg.textContent = 'Could not save. The image may be too big, try a smaller one.';
    }
  });
}