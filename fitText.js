(function() {
	var elements = [].slice.apply(document.querySelectorAll('[fit-text]')),
		getClone = function(elem) {
			return ( elem.fitClone ) ? elem.fitClone : (function() { 
				var clone = elem.cloneNode(true);
				
				clone.style.opacity = 0;
				clone.style.position = "absolute";
				clone.style.fontSize = "";
				clone.style.width = elem.offsetWidth + "px";
				
				(elem.nextElementSibling) ? elem.parentNode.insertBefore(clone, elem.nextElementSibling) : 	elem.parentNode.appendChild(clone);
				
				return elem.fitClone = clone;
			})();
		},
		removeClone = (function(elem) { 
			elem.parentNode.removeChild(elem.fitClone);
			elem.fitClone = null;
		}),
		getTextFitSize = function(elem) {
			var clone = getClone(elem),
				fontSize = Math.ceil(parseFloat( window.getComputedStyle(clone).fontSize )),
				height = clone.offsetHeight;

			if ( height > (fontSize * 2)) { 
				clone.style.fontSize = ( fontSize - 1) + "px";
				elem.processed = true;				
				getTextFitSize(elem);
			} else {
				elem.style.fontSize = (elem.processed===true) ? (fontSize+"px") : "";
				removeClone(elem);
			}
		},
		FitText = function(elements) {
			var that = this;
						
			if ( !that.init ) {
				that.init = true;
				window.addEventListener("resize", function() {
					clearTimeout(fitText.resizing);
					fitText.resizing = setTimeout(function() {
						that.elements.forEach(function(elem) {
							elem.processed = false;
							elem.style
							window.requestAnimationFrame(function() { getTextFitSize(elem); });
						});
					}, 300);
				});
			}

			(Array.isArray(elements) ? elements : [elements]).forEach(function(elem) {
				elem.processed = false;
				that.elements.push(elem);
				getTextFitSize(elem);
			});
		},
		fitText = function(elements) {
			return elements ? new FitText(elements) : null;
		}

	FitText.prototype.elements = [];
	FitText.prototype.init = false;
		
	fitText.resizing = null;
	
	fitText( elements );
	
	window.fitText = fitText;
})();