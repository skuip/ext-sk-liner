/* global document, window */

(function (document, window) {
	var x = 0, y = 0;
	/**
	 *
	 */
	document.addEventListener(`mousemove`, function(ev) {
		x = ev.clientX;
		y = ev.clientY;
		findElement(x, y);
	}, true);

	/**
	 *
	 */
	window.addEventListener(`scroll`, function() {
		findElement(x, y);
	}, true);

	function findElement (x, y) {
		var elm, found = null, i, j, rect;
		var range = document.createRange();
		var target = document.elementFromPoint(x,y);

		if (!target) return;

		for (i = 0, j = target.childNodes.length; i < j; i++) {
			elm = target.childNodes[i];
			if (elm.nodeType !== 3) continue;

			range.setStart(elm, 0);
			range.setEnd(elm, elm.length);

			rect = range.getBoundingClientRect();

			if (rect.left < x && rect.right > x && rect.top < y && rect.bottom > y) {
				found = elm;
			}
		}

		decorate(found, x, y);
	}


	function decorate(elm, x, y) {
		let lines = [];

		// Remove all old statistics
		[].forEach.call(document.querySelectorAll(`.sk-liner`), function(div) {
			div.parentNode.removeChild(div);
		});

		if (elm === null) return;

		let range = document.createRange();
		range.setStart(elm, 0);

		for (var i = 0, j = elm.length; i <= j; i++) {
			range.setEnd(elm, i);

			let rects = range.getClientRects();

			if (rects.length === 0) continue;

			let rect = rects[rects.length - 1];

			for (let k = 0, l = lines.length + 1; k < l; k++) {
				if (!lines[k]) {
					lines[k] = {end: i, rect: rect, start: i};
					break;
				} else if (lines[k].rect.top === rect.top) {
					lines[k].end = i;
					lines[k].rect.right = rect.right;
					break;
				}
			}
		}

		let avgLength = [], avgWords = [];
		for (i = 0, j = lines.length; i < j; i++) {
			const lineString = elm.wholeText.substring(lines[i].start, lines[i].end).trim();
			const lineLength = lineString.replace(/\s+/g, ` `).length;
			const lineWords = lineLength - lineString.replace(/\s+/g, ``).length + 1;

			avgLength.push(lineLength);
			avgWords.push(lineWords);

			const div = document.createElement(`div`);
			div.className = `sk-liner`;
			const style = div.style;
			style.background = `#FFF`;
			style.borderRadius = `8px`;
			style.border = `1px solid #AAA`;
			style.color = `red`;
			style.fontFamily = `monospace`;
			style.fontSize = `12px`;
			style.left = lines[i].rect.left + `px`;
			style.lineHeight = 1;
			style.margin = parseInt(lines[i].rect.height/2 - 10/2) + `px 0 0`;
			style.padding = `1px 4px 1px 4px`;
			style.position = `fixed`;
			style.top = (lines[i].rect.top - 2) + `px`;
			style.zIndex = `99999`;
			div.innerHTML = lineLength + `/` + lineWords;

			document.body.appendChild(div);
		}

		// Ignore the first and last line, since it's probably not complete.
		avgLength.shift();
		avgWords.shift();
		avgLength.pop();
		avgWords.pop();

		// Only show the overall average when we got multiple lines.
		if (avgLength.length > 1) {
			avgLength = avgLength.reduce((a,b) => a+b)/avgLength.length;
			avgWords = avgWords.reduce((a,b) => a+b)/avgWords.length;

			const div = document.createElement(`div`);
			div.className = `sk-liner`;
			const style = div.style;
			style.background = `#FFF`;
			style.borderRadius = `8px`;
			style.border = `1px solid #AAA`;
			style.color = `red`;
			style.fontFamily = `monospace`;
			style.fontSize = `12px`;
			style.left = (x + 16) + `px`;
			style.lineHeight = 1;
			style.padding = `1px 4px 1px 4px`;
			style.position = `fixed`;
			style.top = y + `px`;
			style.zIndex = `99999`;
			div.innerHTML = `c:` + avgLength.toFixed(1) + `<br/>w:` + avgWords.toFixed(1);

			document.body.appendChild(div);
		}
	}
})(document, window);
