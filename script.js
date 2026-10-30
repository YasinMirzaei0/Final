(function () {
  var hero = document.getElementById('hero');
  var layers = Array.prototype.slice.call(hero.querySelectorAll('.video-layer'));
  var chapterEls = Array.prototype.slice.call(hero.querySelectorAll('.chapter'));
  var nav = document.getElementById('nav');
  var navChapter = document.getElementById('navChapter');
  var navTitle = document.getElementById('navTitle');
  var ringFg = document.getElementById('ringFg');

  var chapters = [
    { id: '01', title: 'The Origin' },
    { id: '02', title: 'Velocity' },
    { id: '03', title: 'Immersion' }
  ];

  var CIRC = 113.1;
  var count = chapters.length;
  var activeIndex = -1;
  var target = 0;   // real scroll progress (0..1)
  var shown = 0;    // smoothed progress for the ring
  var ticking = false;

  hero.style.height = count * 100 + 'vh';

  function setActive(index) {
    if (index === activeIndex) return;
    activeIndex = index;

    layers.forEach(function (layer, i) {
      layer.classList.toggle('is-active', i === index);
    });

    navChapter.textContent = 'Chapter ' + chapters[index].id;
    navTitle.classList.add('swap');
    setTimeout(function () {
      navTitle.textContent = chapters[index].title;
      navTitle.classList.remove('swap');
    }, 200);
  }

  function readScroll() {
    var rect = hero.getBoundingClientRect();
    var scrollable = hero.offsetHeight - window.innerHeight;
    var progress = scrollable > 0 ? -rect.top / scrollable : 0;
    target = Math.min(Math.max(progress, 0), 1);

    var index = Math.min(Math.floor(target * count), count - 1);
    setActive(index);

    // Show the nav only while the hero is on screen
    var inView = rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5;
    nav.classList.toggle('is-visible', inView);
  }

  function animateRing() {
    shown += (target - shown) * 0.12;
    if (Math.abs(target - shown) < 0.0005) shown = target;
    ringFg.style.strokeDashoffset = (CIRC * (1 - shown)).toFixed(2);
    requestAnimationFrame(animateRing);
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function () { readScroll(); ticking = false; });
    }
  }, { passive: true });
  window.addEventListener('resize', readScroll);

  // Replay text reveal each time a chapter enters the middle of the screen
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { rootMargin: '-20% 0px -20% 0px', threshold: 0 });
  chapterEls.forEach(function (el) { observer.observe(el); });

  readScroll();
  animateRing();
})();
