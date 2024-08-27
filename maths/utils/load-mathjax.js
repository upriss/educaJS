window.MathJax = {
  tex: {
    inlineMath: [['$', '$']]
  },
  svg: {
    scale: 1.3,
    fontCache: 'global'
  },
  options: {
    enableMenu: false
  }
};

(function () {
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/gh/upriss/educaJS/maths/utils/mathJax3_tex-svg.js';
  script.async = true;
  document.head.appendChild(script);
})();
