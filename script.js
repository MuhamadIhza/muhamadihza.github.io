(function () {
  // copy email
  var toast = function (m) {
    var el = document.getElementById('toast');
    el.textContent = m; el.hidden = false;
    clearTimeout(toast.t); toast.t = setTimeout(function () { el.hidden = true; }, 2200);
  };
  document.getElementById('copy').addEventListener('click', function () {
    var txt = document.getElementById('email').textContent;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(txt).then(function () { toast('Email copied'); }, function () { toast('Select the email and press Ctrl+C'); });
    } else { toast('Select the email and press Ctrl+C'); }
  });

  // subtle reveal on scroll
  var items = document.querySelectorAll('.card, .method > div, .tl, .kit > div, .side, .steps li');
  if (!('IntersectionObserver' in window)) return;
  items.forEach(function (el) { el.classList.add('reveal'); });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  items.forEach(function (el) { io.observe(el); });
})();
