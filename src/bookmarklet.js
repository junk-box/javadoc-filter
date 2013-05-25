(function() {
	var load = function(url) {
		var s = document.createElement('script');
		s.setAttribute('language', 'javascript');
		s.setAttribute('charset', 'UTF-8');
		s.setAttribute('src', url);
		document.body.appendChild(s);
	};
	load('https://junk-box.appspot.com/js/jquery.js');
	load('https://junk-box.appspot.com/appdocs/java/javadoc-filter-core.js');
})();
