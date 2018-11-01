!function(){"use strict";var i;function c(r,a){Object.keys(a).forEach(function(e){var t=Object.getOwnPropertyDescriptor(a,e);if("value"in t){var n=t.value;e in r&&"object"==typeof n?c(r[e],n):r[e]=n}else Object.defineProperty(r,e,t)})}function r(n,r,a,o){return function(t){function e(e){t[o](e,r,a)}Array.isArray(n)?n.forEach(e):e(n)}}window.art=function(e){var t;t=e instanceof Node?e:"function"==typeof e?e.call(art):document.createElement(e);for(var n=arguments.length,r=0;++r<n;){var a=arguments[r];if(a instanceof Node)t.appendChild(a);else if(null!=a){var o=typeof a;"object"===o?c(t,a):"function"===o?a.call(art,t):t.appendChild(document.createTextNode(a))}}return t},art.off=function(e,t,n){return r(e,t,n,"removeEventListener")},art.on=function(e,t,n){return r(e,t,n,"addEventListener")},art.css=function(e,t){var n,r,a,o;!function(e){if(!i){var t=art("STYLE");art(document.head,t),i=t.sheet}i.insertRule(e,i.cssRules.length)}((n=e,a=t,o=function(e,t){var n=e+":"+t;return n},r=Object.keys(a).map(function(e){var t=a[e],n=o(e,t);return n}),n+"{"+r.join(";")+"}"))}}(),function(e){"use strict";function n(e){var t,n=typeof e;try{t="string"===n?'"'+e+'"':0===e&&1/e<0?"-0":Array.isArray(e)?e.length?"[…]":"[]":"bigint"===n?e+"n":"symbol"!==n?String(e):e.toString()}catch(e){}return t}e.formatValue=function(e){var t;if(Array.isArray(e))try{t="["+e.map(n).join(", ")+"]"}catch(e){}else t=n(e);return t},e.formatValueType=function(e){var t;if(null!==e){var n=typeof e;if("function"===n||"object"===n||"undefined"===n)switch(function(e){var t;try{t=Object.prototype.toString.call(e)}catch(e){return}return t.slice(8,-1)}(e)){case"Array":switch(e.length){case 0:t="an empty array";break;case 1:t="a one element array";break;default:t="an array"}break;case"Date":t="a date";break;default:t=e instanceof RegExp?"a regular expression":"function"===n?"a function":"an object"}}return t}}(this),function(){"use strict";function R(e){function t(){c.className="button focusable",i("off")}function n(e){e.target!==c&&a()&&t()}function r(e){!e.relatedTarget&&a()&&t()}function a(){return/\bactive\b/.test(c.className)}function o(){return!c.hasAttribute("tabindex")}function i(e){var t=art[e];art(document,t("mousemove",n),t("mouseout",r))}var c=art("SPAN",{className:"button focusable"},A,art.on("click",function(e){o()&&e.stopImmediatePropagation(),e.preventDefault()}),art.on("keydown",function(e){13===e.keyCode&&(c.click(),e.preventDefault())}),art.on("keyup",function(e){32===e.keyCode&&(c.click(),e.preventDefault())}),art.on("mouseup",function(e){1===e.which&&a()&&(document.releaseCapture(),t())}),art("SPAN",e),art("SPAN"));return c.msMatchesSelector&&(c.firstChild.setAttribute("unselectable","on"),art(c,art.on("mousedown",function(e){1!==e.which||o()||a()||(c.setCapture(),c.className="active button focusable",i("on"))}))),Object.defineProperty(c,"disabled",{configurable:!0,get:function(){return o()},set:function(e){(e=Boolean(e))!==o()&&(e?(art(c,u),a()&&(document.releaseCapture(),i("off")),c.blur()):art(c,A),c.className="",c.className="button focusable")}}),c}function O(){var r,t,a,o,i,c,e,l,n,u,s=[{name:"Chrome",versions:[{featureName:"CHROME_69",number:"69+"}]},{name:"Edge",versions:[{featureName:"EDGE_40",number:"40+"}]},{name:"Firefox",versions:[{featureName:"FF_54",number:"54–61"},{featureName:"FF_62",number:"62+"}]},{name:"Internet Explorer",versions:[{featureName:"IE_9",number:"9"},{featureName:"IE_10",number:"10"},{featureName:"IE_11",number:"11"},{featureName:"IE_11_WIN_10",number:"11 (W10)"}]},{name:"Safari",versions:[{featureName:"SAFARI_7_0",number:"7.0"},{featureName:"SAFARI_7_1",number:"7.1–8"},{featureName:"SAFARI_9",number:"9"},{featureName:"SAFARI_10",number:"10–11"},{featureName:"SAFARI_12",number:"12+"}]},{name:"Opera",versions:[{featureName:"CHROME_69",number:"56+"}]},{name:"Android Browser",versions:[{featureName:"ANDRO_4_0",number:"4.0"},{featureName:"ANDRO_4_1",number:"4.1–4.3"},{featureName:"ANDRO_4_4",number:"4.4"}]},{name:"Node.js",versions:[{featureName:"NODE_0_10",number:"0.10"},{featureName:"NODE_0_12",number:"0.12"},{featureName:"NODE_4",number:"4"},{featureName:"NODE_5",number:"5"},{featureName:"NODE_10",number:"10"},{featureName:"NODE_11",number:"11+"}]}],d="Generate strict mode code",f="Support web workers",p="10.5pt";function m(e,t){return art("LABEL",{style:{display:"inline-table"}},art("SPAN",{style:{display:"table-cell",verticalAlign:"middle"}},art("INPUT",{style:{margin:"0 .25em 0 0"},type:"checkbox"},t)),art("SPAN",{style:{display:"table-cell"}},e))}function b(e){var t=art("DIV",{className:"help-text"});return t.innerHTML=e,art("SPAN",{className:"focusable",style:{background:"black",borderRadius:"1em",color:"white",cursor:"pointer",display:"inline-table",fontSize:"8pt",fontWeight:"bold",lineHeight:p,position:"relative",textAlign:"center",top:"-1.5pt",width:p},title:"Learn more…"},"?",A,art.on("click",function(){L(t)}))}function v(){var t=r.checked;Array.prototype.forEach.call(o,function(e){e.checked=t})}function y(){setTimeout(function(){r.indeterminate||v()})}function h(){var t=JScrewIt.Feature,e=Array.prototype.filter.call(o,function(e){return e.checked}).map(function(e){return++n,t[e.featureName]}),n=e.length;r.checked=n,r.indeterminate=n&&n<o.length,a=t.commonOf.apply(null,e)||t.DEFAULT,c.checked&&(a=a.restrict("web-worker",e)),i.checked&&(a=a.restrict("forced-strict-mode",e))}function g(){var e;h(),(e=document.createEvent("Event")).initEvent("input",!0,!1),t.dispatchEvent(e)}return e=art(m("Select/deselect all"),{style:{margin:"0 0 .5em"}},art.on("change",v),art.on(["keyup","mouseup"],y)),l=art("TABLE",{style:{borderSpacing:"0",width:"100%"}}),n=m(d),u=m(f),t=art("FIELDSET",{className:"engine-selection-box",get feature(){return a}},art("DIV",art("P",{style:{margin:".25em 0 .75em"}},"Select the engines you want your code to support."),e,l,art("HR"),art("DIV",u," ",b("<p>Web workers are part of a standard HTML technology used to perform background tasks in JavaScript.<p>Check the option <dfn>Support web workers</dfn> only if your code needs to run inside a web worker. To create or use a web worker in your code, this option is not required.")),art("DIV",n," ",b("<p>The option <dfn>Generate strict mode code</dfn> instructs JScrewIt to avoid optimizations that don't work in strict mode JavaScript code. Check this option only if your environment disallows non-strict code. You may want to do this for example in one of the following circumstances.<ul><li>To encode a string or a number and embed it in a JavaScript file in a place where strict mode code is expected, like in a scope containing a use strict directive or in a class body.<li>To encode a script and run it in Node.js with the option <code>--use_strict</code>.<li>To encode an ECMAScript module. Note that module support in JSFuck is <em>very</em> limited, as <code>import</code> and <code>export</code> statements don't work at all. If your module doesn't contain these statements, you can encode it using this option.</ul><p>In most other cases, this option is not required, even if your script contains a top level <code>\"use strict\"</code> statement.")),art.on("change",g))),s.forEach(function(e,t){for(var n,r=e.versions,a=1&t?{className:"even-field"}:null,o=(r.length+2)/3^0,i=3*o,c=0;c<i;++c){var u=r[c];c%3||(n=art("TR",a),c||art(n,art("TD",{rowSpan:o,style:{padding:"0 .5em 0 0"}},e.name)),art(l,n));var s=u?m(u.number,{checked:!0,featureName:u.featureName}):null;art(n,art("TD",{style:{padding:"0 0 0 .5em",width:"6em"}},s))}}),r=e.querySelector("INPUT"),o=l.querySelectorAll("INPUT"),i=n.querySelector("INPUT"),c=u.querySelector("INPUT"),h(),t}function L(e,t){function r(){var e=document.body;e.removeChild(c),art(e,art.off("keydown",o),art.off("focus",a,!0)),void 0!==t&&t()}function n(){i.focus()}function a(e){i.contains(e.target)||n()}function o(e){var t=e.keyCode;if(13===t||27===t){var n=document.activeElement;!n.contains(i)&&n.contains(e.target)||(r(),e.preventDefault())}}var i=art("DIV",{style:{borderRadius:"25px",display:"inline-block",maxWidth:"500px",width:"100%"}},A,art("DIV",{className:"focusable",id:"modalBox",style:{background:"whitesmoke",border:"10px solid blue",borderRadius:"23px",margin:"2px"}},art("DIV",{style:{margin:"1.5em 1.5em .25em",overflow:"hidden"}},e,art("DIV",{style:{margin:"1.25em 0"}},art(R("OK"),{style:{maxWidth:"5em",width:"100%"}},art.on("click",r)))))),c=art("DIV",{style:{background:"rgba(0, 0, 0, .25)",overflow:"auto",position:"fixed",textAlign:"center",left:"0",top:"0",bottom:"0",width:"100%"}},art("DIV",{style:{display:"table",tableLayout:"fixed",width:"100%",height:"100%"}},art("DIV",{style:{display:"table-cell",verticalAlign:"middle"}},i)));art(document.body,c,art.on("focus",a,!0),art.on("keydown",o)),setTimeout(n)}function u(e){e.removeAttribute("tabindex")}function A(e){e.setAttribute("tabindex",0)}art.css(".button",{background:"#e0e0e0",color:"#212121",cursor:"default",display:"inline-block",position:"relative"}),art.css(".button, .button>:last-child",{"border-radius":".1em"}),art.css(".button.active, .button[tabindex]:active",{background:"#29b3e5"}),art.css(".button.active>:first-child, .button[tabindex]:active>:first-child",{left:".1em",top:".1em"}),art.css(".button.active>:last-child, .button[tabindex]:active>:last-child",{"border-color":"#0088b6"}),art.css(".button:not([tabindex])",{background:"#e9e9e9",color:"#707070"}),art.css(".button:not([tabindex])>:last-child",{"border-color":"#bababa"}),art.css(".button>:first-child",{display:"inline-block",margin:".15em .5em",position:"relative","user-select":"none","-moz-user-select":"none","-ms-user-select":"none","-webkit-user-select":"none"}),art.css(".button>:last-child",{"border-color":"#707070","border-style":"solid","border-width":"1px",display:"inline-block",position:"absolute",left:"0",right:"0",top:"0",bottom:"0"}),art.css(".button[tabindex]:hover:not(.active):not(:active)",{background:"#a3f4ff"}),art.css(".button[tabindex]:hover:not(.active):not(:active)>:last-child",{"border-color":"#189fdd"}),art.css(".engine-selection-box",{background:"#f0f0f0"}),art.css(".engine-selection-box .even-field",{background:"#fff"}),art.css(".help-text",{"font-size":"11pt","text-align":"justify"}),art.css(".help-text code",{"white-space":"pre"}),art.css(".help-text dfn",{"font-style":"normal","font-weight":"bold"}),art.css(".help-text li",{margin:".5em 0"}),art.css("#modalBox p:first-child",{"margin-top":"0"}),art.css("#modalBox p:last-child",{"margin-bottom":"0"}),function(){var e="application/javascript";function n(){(E=new Worker(D)).onmessage=i}function t(){URL.revokeObjectURL(D),D=void 0}function c(){var e,t=r();try{e=JScrewIt.encode(inputArea.value,t)}catch(e){return m(),void v(String(e))}y(e)}function u(){var e=r(),t={input:inputArea.value,options:e};S&&(E.terminate(),n(),t.url=N),E.postMessage(t),m(),b(!0),inputArea.onkeyup=null}function r(){return{features:g.canonicalNames}}function a(e){9!==e.keyCode&&u()}function o(){k.disabled=!1;var e=this.result;null!=e&&(inputArea.value=e),inputArea.oninput(),inputArea.disabled=!1}function s(){var t,e;try{e=(0,eval)(outputArea.value)}catch(e){t=art("P",String(e))}if(void 0!==e){var n=formatValue(e),r=formatValueType(e);if(n)t=art("DIV",art("P",r?"Evaluation result is "+r+":":"Evaluation result is"),art("P",{style:{overflowX:"auto"}},art("DIV",{style:{display:"inline-block",textAlign:"left",whiteSpace:"pre"}},n)));else t=art("DIV",art("P","Evaluation result is "+r+"."))}if(null!=t){var a=this;L(t,function(){a.focus()})}}function i(e){var t=e.data,n=t.error;n?v(n):y(t.output),b(!1)}function l(){var e,t;if(document.querySelector("body>*>div").style.display="block",inputArea.value=inputArea.defaultValue,art(outputArea,art.on("input",h)),art(stats.parentNode,art(R("Run this"),{style:{bottom:"0",fontSize:"10pt",position:"absolute",right:"0"}},art.on("click",s))),e=_.COMPACT,g=_.AUTO.includes(e)?e:_.BROWSER,compMenu.value=g.name,compMenu.previousIndex=compMenu.selectedIndex,E)(t=u)();else{var n=art(R("Encode"),art.on("click",c));art(controls,n),t=p,outputArea.value=""}if("undefined"!=typeof File){var r=art("INPUT",{accept:".js",style:{display:"none"},type:"file"},art.on("change",f)),a=HTMLInputElement.prototype.click.bind(r);k=art(R("Load file…"),art.on("click",a)),art(controls,k,r)}inputArea.oninput=t;var o=function(){var e=compMenu.selectedIndex,t=compMenu.options[e].value,n=t?_[t]:A.feature;!w&&_.areEqual(n,g)||(g=n,this()),e!==compMenu.previousIndex&&(compMenu.previousIndex=e,I.rollTo(+!t))}.bind(t);if(art(compMenu,art.on("change",o)),A=art(O(),art.on("input",o)),I=function(){function n(){var e=+new Date;0<=((f=u+(e-s)*d/250)-i)*d&&(f=i,r()),a.height=1===f?"":t.scrollHeight*f+"px",o.display=0===f?"none":""}function e(e){if(e===f)r();else{var t=f<e?1:-1;t!==d&&(u=f,s=+new Date,d=t),i=e,c||(c=setInterval(n,0))}}function r(){clearInterval(c),c=null,d=0}var t,a,o,i,c,u,s,l,d=0,f=0;return l=art("DIV"),(o=l.style).display="none",(t=art("DIV",l)).container=l,Object.defineProperty(t,"rollTo",{configurable:!0,value:e,writable:!0}),(a=t.style).height="0",a.overflowY="hidden",t}(),art(I.container,art("DIV",{className:"frame"},art("SPAN","Custom Compatibility Selection"),A)),art(controls.parentNode,I),inputArea.createTextRange){var i=inputArea.createTextRange();i.move("textedit",1),i.select()}else inputArea.setSelectionRange(2147483647,2147483647);inputArea.focus()}function d(){document.addEventListener("DOMContentLoaded",l)}function f(){var e=this.files[0];if(e){inputArea.disabled=!0,inputArea.value="",k.disabled=!0;var t=new FileReader;t.addEventListener("loadend",o),t.readAsText(e)}}function p(){x&&h(!0)}function m(){x=!1,outputArea.value="",stats.textContent="…"}function b(e){S=e,outputArea.disabled=e}function v(e){L(art("P",e))}function y(e){outputArea.value=e,h()}function h(e){var t=outputArea.value.length,n=1===t?"1 char":t+" chars";w=!!e,e&&(E&&(inputArea.onkeyup=a),n+=" – <i>out of sync</i>"),x=!0,stats.innerHTML=n}var g,A,N,k,w,x,I,S,E,D,T,_=JScrewIt.Feature;if("undefined"!=typeof Worker){D=URL.createObjectURL(new Blob(['"use strict";self.onmessage=function(t){var r=t.data,e=r.url;null!=e&&importScripts(e);var s=r.input;if(null!=s){var n;try{n={output:JScrewIt.encode(s,r.options)}}catch(t){n={error:String(t)}}postMessage(n)}};'],{type:e}));try{n()}catch(e){t()}}E?((T=new XMLHttpRequest).onerror=function(){E.terminate(),E=void 0,t()},T.onload=function(){N=URL.createObjectURL(T.response),E.postMessage({url:N})},T.onloadend=function(){"loading"===document.readyState?d():l()},T.open("GET","lib/jscrewit.min.js",!0),T.overrideMimeType(e),T.responseType="blob",T.send()):d()}()}();