/*
 * JavaDoc Filter v1.6
 * https://junk-box.github.io/javadoc-filter/index.html
 * 
 * Copyright (C) 2025 S.Ishigaki
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Date: 2025-08-08
 */
(function() {

var
	version = "1.6",

	defaultStr = "フィルター",

	frameDocument = top.packageFrame.document,

	emptyStr = "",

	defaultColor = "#969696",

	inputColor = "#000000",

	initialChar = [
		"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
		"n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
		"$", "_"
	],

	initialClass,

	classList = {},

	initialFix = {},

	initialName,

	nameList = {},

	filter,

	divAll,

	divList,

	splash = function() {
		let splashContent = document.createElement("div");
		splashContent.style.padding = "2px 3px";
		splashContent.style.fontSize = "80%";
		splashContent.innerHTML = "JavaDoc Filter Ver" + version + "<br>Initializing ... ";

		let splashFrame = document.createElement("div");
		splashFrame.style.position = "absolute";
		splashFrame.style.top = "8px";
		splashFrame.style.left = "8px";
		splashFrame.style.width = "80%";
		splashFrame.style.fontWeight = "bold";
		splashFrame.style.backgroundColor = "#e5ecf9";
		splashFrame.style.border = "1px solid #000";
		splashFrame.style.borderColor = "#c5d7ef";
		splashFrame.appendChild(splashContent);

		frameDocument.body.appendChild(splashFrame);

		setTimeout(initialize, 500);
	},

	initialize = function() {
		let existingFilter  = frameDocument.getElementById("filter");
		if (existingFilter != null) {
			alert("JavaDoc Filter is already runnning.");
			existingFilter.parentNode.removeChild(existingFilter);
			location.reload();
			return;
		}

		var aList = frameDocument.getElementsByTagName("a");
		var list = [];
		var classes = [];
		var names = [];
		var indexCount = 0;
		var cIndex;
		for (var i = 0; i < aList.length; i++) {
			var a = aList[i];
			if (a.childNodes[0].childNodes.length > 0) a = a.firstChild;

			// for JavaSE7jp
			if (a.innerHTML == "クラス") a.innerHTML = "Class";
			if (a.innerHTML == " ContentHandlerFactory") a.innerHTML = "ContentHandlerFactory";
			if (a.innerHTML == " CookiePolicy") a.innerHTML = "CookiePolicy";
			if (a.innerHTML == "llegalStateException") a.innerHTML = "IllegalStateException";
			if (a.innerHTML == "NamingContextExtStub") a.innerHTML = "_NamingContextExtStub";

			var c = a.innerHTML.toLowerCase().substring(0, 1);
			cIndex = initialChar[indexCount];
			if (c != cIndex) {
				var index = getIndex(c, indexCount);
				if (index < 0) {
					alert("Unexpected initials\n\"" + a.innerHTML + "\" [" + c + "] - [" + cIndex + "] indexCount=" + indexCount);
					break;
				}
				if (classes.length > 0) {
					classList[cIndex] = classes;
					initialFix[cIndex] = classes.join("<br>");
					nameList[cIndex] = names;
				}
				classes = [];
				names = [];
				indexCount = index;
				cIndex = c;
			}

			var aStr = toHtml(aList[i])
			list.push(aStr);
			classes.push(aStr);
			names.push(a.innerHTML.toLowerCase());

		}

		var all = list.join("<br>");
		classList[cIndex] = classes;
		initialFix[cIndex] = classes.join("<br>");
		nameList[cIndex] = names;

		let splash = frameDocument.body.lastChild;
		splash.parentNode.removeChild(splash);
		// ～ java 6
		let before6 = frameDocument.getElementsByTagName("table");
		if (before6.length > 0) before6[0].style.visibility = "hidden";
		// java 7 ～
		let after7 = frameDocument.getElementsByTagName("ul");
		if (after7.length > 0) after7[0].style.visibility = "hidden";

		let input = document.createElement("input");
		input.id = "filter";
		input.type = "text";
		input.onclick = "this.select()";
		input.style.width = "95%";

		let divInput = document.createElement("div");
		divInput.appendChild(input);

		let divClassListAll = document.createElement("div");
		divClassListAll.id = "classListAll";
		divClassListAll.style.width = "100%";
		divClassListAll.style.height = "100%";
		divClassListAll.style.padding = "8px";
		divClassListAll.style.position = "absolute";
		divClassListAll.style.top = "0px";
		divClassListAll.innerHTML = all;

		let divClassList = document.createElement("div");
		divClassList.id = "classList";
		divClassList.style.width = "100%";
		divClassList.style.height = "100%";
		divClassList.style.padding = "8px";
		divClassList.style.position = "absolute";
		divClassList.style.top = "0px";
		divClassList.style.visibility = "hidden";

		let clsList = document.createElement("div");
		clsList.style.position = "relative";
		clsList.append(divClassListAll);
		clsList.append(divClassList);

		let divFilter = document.createElement("div");
		divFilter.style.position = "absolute";
		divFilter.style.top = "8px";
		divFilter.style.left = "8px";
		divFilter.style.width = "80%";
		divFilter.style.fontSize = "90%";
		divFilter.style.fontFamily = "Helvetica,Arial,sans-serif";
		divFilter.appendChild(divInput);
		divFilter.appendChild(clsList);

		frameDocument.body.appendChild(divFilter);

		input.value = defaultStr;
		input.style.color = defaultColor;
		input.onfocus = function() {
			if (this.value == defaultStr) {
				this.value = emptyStr;
				this.style.color = inputColor;
			}
		};
		input.onblur = function() {
			if (this.value == emptyStr) {
				input.value = defaultStr;
				input.style.color = defaultColor;
			} else if (this.value != defaultStr) {
				this.style.color = inputColor;
			}
		};

		input.onkeyup = function() {
			if (this.value == "") {
				divAll.style.visibility = "visible";
				divList.style.visibility = "hidden";
				return;
			}
			divAll.style.visibility = "hidden";
			divList.style.visibility = "visible";
			setTimeout(filtering(this.value.toLowerCase()), 0);
		};

		filter = input;
		divAll = divClassListAll;
		divList = divClassList;
		input.focus();
	},

	filtering = function(filterStr) {
		if (filterStr.length == 1) {
			divList.innerHTML = initialFix[filterStr] == undefined ? "" : initialFix[filterStr];
			return;
		}

		var c = filterStr.substring(0, 1);
		if (classList[c] == undefined) {
			divList.innerHTML = "";
			return;
		}
		initialClass = classList[c];
		initialName = nameList[c];

		var aList = [];
		for (var i = 0; i < initialClass.length; i++) {
			if (initialName[i].indexOf(filterStr) == 0) aList.push(initialClass[i]);
		}
		if (filterStr == filter.value.toLowerCase()) {
			divList.innerHTML= aList.join("<br>");
		}
	},

	getIndex = function(initials, count) {
		for (var i = count; i < initialChar.length; i++) {
			if (initials == initialChar[i]) return i;
		}
		return -1;
	},

	toHtml = function(a) {
		var html = [];
		html.push("<a");
		for (var i = 0; i < a.attributes.length; i++) {
			html.push(" ");
			html.push(a.attributes[i].nodeName);
			html.push("=");
			html.push(a.attributes[i].nodeValue);
		}
		html.push(">");
		html.push(a.innerHTML);
		html.push("</a>");

		return html.join("");
	}

	splash();
})();
