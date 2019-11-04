!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).DelegateCenter=t()}(this,(function(){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}function t(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(){function r(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,r),this.typesMap=Object.create(null),this.matches=null,this._checkMatchesFunction()}var n,i,o;return n=r,(i=[{key:"_createEventType",value:function(e){var t=this;this.typesMap[e]=new Map;var r=this.typesMap[e];document.addEventListener(e,(function(e){t._runExecFunction(r,e)}))}},{key:"_runExecFunction",value:function(e,t){var r=!0,n=!1,i=void 0;try{for(var o,a=e.keys()[Symbol.iterator]();!(r=(o=a.next()).done);r=!0){var s=o.value;this._isMatchValidator(s,t.target)&&e.get(s).forEach((function(e){e(t)}))}}catch(e){n=!0,i=e}finally{try{r||null==a.return||a.return()}finally{if(n)throw i}}}},{key:"_checkMatchesFunction",value:function(){for(var e=["matches","matchesSelector","mozMatchesSelector","msMatchesSelector","oMatchesSelector","webkitMatchesSelector"],t=0,r=e.length;t<r;t++)if(e[t]in Element.prototype)return void(this.matches=e[t])}},{key:"_isMatchSelector",value:function(e,t){var r=this,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(!t)return!1;if("string"==typeof e){if(this.matches)return t[this.matches](e);if(/^\./.test(e)){var i=e.replace(/^\./,"");return t.classList.contains(i)}if(/^#/.test(e)){var o=e.replace(/^#/,"");return t.id===o}var a=e.toUpperCase();return t.tagName===a}if(e instanceof Element)return t.isSameNode(e);if(Array.isArray(e)&&e.length>0)return n?e.some((function(e){return r._isMatchSelector(e,t)})):e.every((function(e){return r._isMatchSelector(e,t)}));throw"Please make sure validator is valid!"}},{key:"_isMatchValidator",value:function(t,r){if(void 0===t||!r)return!1;if(null===t)return!0;if("string"==typeof t||Array.isArray(t)||t instanceof Node)return this._isMatchSelector(t,r);if("function"==typeof t)return t();if("object"===e(t)&&("selector"in t||"exceptSelector"in t)){var n=!1,i=!1;return n=!t.selector||this._isMatchSelector(t.selector,r),i=!t.exceptSelector||!this._isMatchSelector(t.exceptSelector,r,!0),n&&i}throw"Please make sure validator is valid!"}},{key:"add",value:function(e,t,r){if("string"!=typeof e||!e)throw"Please make sure event type is valid!";if(void 0===t)throw"Please make sure validator is valid!";if("function"!=typeof r)throw"Please make sure execute Function is valid!";if(e in this.typesMap){var n=this.typesMap[e];n.has(t)?n.get(t).push(r):n.set(t,[r])}else this._createEventType(e),this.typesMap[e].set(t,[r]);return this}},{key:"remove",value:function(e,t,r){if(e in this.typesMap){var n=this.typesMap[e];if(n.has(t)&&0!==!n.get(t).length){var i=n.get(t),o=i.indexOf(r);return o>=0?(i.splice(o,1),i.length<=0&&n.delete(t),this):void 0}}}}])&&t(n.prototype,i),o&&t(n,o),r}()}));
