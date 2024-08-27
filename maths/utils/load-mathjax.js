window.MathJax = {
  tex: {
    inlineMath: [['$', '$']]
  },
  svg: {
    fontCache: 'global'
  }
};

(function () {
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/gh/upriss/educaJS/maths/utils/mathJax3_tex-svg.js';
  script.async = true;
  document.head.appendChild(script);
})();
