(function() {
	var load = function(url) {
		var s = document.createElement('script');
		s.setAttribute('language', 'javascript');
		s.setAttribute('charset', 'UTF-8');
		s.setAttribute('src', url);
		document.body.appendChild(s);
	};
	load('https://junk-box.github.io/javadoc-filter/js/javadoc-filter-core.js');
})();
