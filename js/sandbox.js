document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.resource-card'));
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

  cards.forEach((card) => card.classList.add('enhanced-hover'));

  const revealCard = (card) => {
    card.classList.add('is-visible');
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealCard(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -5% 0px' });

    cards.forEach((card) => observer.observe(card));
  } else {
    cards.forEach(revealCard);
  }

  const parseTags = (value = '') => value.toLowerCase().split(/[,\s]+/).filter(Boolean);

  const applyFilter = (filter) => {
    cards.forEach((card) => {
      const tags = parseTags(card.dataset.tech);
      const shouldShow = filter === 'all' || tags.includes(filter);
      card.classList.toggle('hidden-card', !shouldShow);
      if (shouldShow) {
        requestAnimationFrame(() => revealCard(card));
      }
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      applyFilter(button.dataset.filter || 'all');
    });
  });

  applyFilter('all');
});
