// ── MOBILE MENU ──────────────────────────────────
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

// ── NAVBAR SCROLL ────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// ── TYPING ANIMATION ─────────────────────────────
const roles = [
  'ML models.',
  'React frontends.',
  'Node.js backends.',
  'full stack apps.',
  'AI-powered tools.',
  'data pipelines.'
];
let roleIndex = 0, charIndex = 0, isDeleting = false;
function typeRole() {
  const el = document.getElementById('roleText');
  if (!el) return;
  const current = roles[roleIndex];
  if (isDeleting) {
    el.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeRole, 500);
      return;
    }
  } else {
    el.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) {
      isDeleting = true;
      setTimeout(typeRole, 2000);
      return;
    }
  }
  setTimeout(typeRole, isDeleting ? 55 : 95);
}
typeRole();

// ── SKILL BAR ANIMATION ──────────────────────────
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width') + '%';
      });
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-category').forEach(el => barObserver.observe(el));

// ── FADE IN ON SCROLL ────────────────────────────
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.project-card, .info-card, .tech-icon, .contact-card, .skill-category, .featured-project, .gh-stat'
).forEach(el => {
  el.classList.add('fade-in');
  fadeObserver.observe(el);
});

// ── ACTIVE NAV LINK ──────────────────────────────
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current ? '#00ff88' : '';
  });
});

// ── GITHUB API — LIVE FETCH ───────────────────────
const GITHUB_USERNAME = 'sachumonpsajeev-cyber';
const langColors = {
  JavaScript: '#f7df1e',
  Python: '#3776ab',
  HTML: '#e34f26',
  CSS: '#264de4',
  TypeScript: '#3178c6',
  'Jupyter Notebook': '#da5b0b',
  Shell: '#89e051',
  Java: '#b07219',
  default: '#7878a0'
};

async function fetchGitHubRepos() {
  const grid = document.getElementById('reposGrid');
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`
    );
    if (!res.ok) throw new Error('API error');
    const repos = await res.json();

    // Stats
    document.getElementById('repoCount').textContent = repos.length;
    document.getElementById('starCount').textContent = repos.reduce((s, r) => s + r.stargazers_count, 0);
    document.getElementById('forkCount').textContent = repos.reduce((s, r) => s + r.forks_count, 0);
    document.getElementById('lastUpdated').textContent = repos[0]?.updated_at
      ? new Date(repos[0].updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'N/A';

    // Cards
    grid.innerHTML = repos.map(repo => {
      const lang = repo.language || 'Unknown';
      const color = langColors[lang] || langColors.default;
      const updated = new Date(repo.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const desc = repo.description
        ? repo.description.substring(0, 100) + (repo.description.length > 100 ? '…' : '')
        : 'No description provided.';
      return `
        <a class="repo-card fade-in" href="${repo.html_url}" target="_blank" rel="noopener">
          <div class="repo-card-top">
            <div class="repo-name"><i class="fas fa-book"></i> ${repo.name}</div>
          </div>
          <p class="repo-desc">${desc}</p>
          <div class="repo-footer">
            <div class="repo-lang"><span class="lang-dot" style="background:${color}"></span>${lang}</div>
            <div class="repo-stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</div>
            <div class="repo-forks"><i class="fas fa-code-branch"></i> ${repo.forks_count}</div>
            <span class="repo-updated">Updated ${updated}</span>
          </div>
        </a>`;
    }).join('');

    document.querySelectorAll('.repo-card').forEach(card => fadeObserver.observe(card));

  } catch (err) {
    grid.innerHTML = `
      <div class="repo-loading">
        <i class="fas fa-exclamation-triangle" style="color:var(--amber)"></i>
        <span>Could not load repos.
          <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" style="color:var(--accent)">View on GitHub →</a>
        </span>
      </div>`;
  }
}

fetchGitHubRepos();
