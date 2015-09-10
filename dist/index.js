tau.mashups.addModule("ListColumnsResizer/config", {});
/*! v0.1.0 Build Thu Sep 10 2015 12:49:14 GMT+0300 (MSK) */
!function(){var e={},t=function(){var t,n,r,i=Array.prototype.slice.call(arguments,0);"string"==typeof i[0]?(r=i[0],t=i[1],n=i[2]):Array.isArray(i[0])&&(t=i[0],n=i[1]);var a=t.reduce(function(e,t){return e.addDependency(t)},tau.mashups);return a=a.addDependency(r+"/config"),a=a.addMashup(function(){var i=Array.prototype.slice.call(arguments,0);if(t.length>0&&1===i.length)throw new Error("Can't properly load dependencies for mashup \""+r+'", mashup is stopped.');return e.variables=i[i.length-1],i.length-t.length===2?e.config=i[i.length-2]:e.config={},Object.freeze&&(Object.freeze(e.variables),Object.freeze(e.config),Object.freeze(e)),n.apply(null,i)})};t("ListColumnsResizer",["jQuery","tau/configurator","tau/models/board.customize.units/const.entity.types.names","tau/models/board.customize.units/const.card.sizes","tau/models/board.customize.units/board.customize.units.interaction"],function(t,n,r,i,a){return function(t){function n(e){if(r[e])return r[e].exports;var i=r[e]={exports:{},id:e,loaded:!1};return t[e].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var r={};return n.m=t,n.c=r,n.p="",n.p=e.variables?e.variables.mashupPath:n.p,n(0)}([function(e,t,n){e.exports=n(2)},,function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},o=n(3),u=r(o),s=n(4),c=r(s),l=n(12),f=r(l);n(13);var d=void 0,p=void 0,v=function(e){return e.data("unitId")||e.data("id")},g=function(){return p.find(".tau-list-level")},m=function(e){return e.data("list-level")},h=function(e){return g().filter(function(t,n){return m(u["default"](n))==e})},y=function(e){return h(m(e))},b=function(e,t){e.innerWidth(t)},x=function(e,t){e.innerWidth(t)},j=function(e){return e.children(".i-role-headerholder").find(".tau-elems-cell")},C=function(e){return y(e).children(".i-role-headerholder").find(".tau-elems-cell")},z=function(e){return y(e).children(".i-role-cardsholder").children(".i-role-card").children(".tau-list-line").children(".tau-elems-table").find(".tau-board-unit")},L=function(e,t){return C(e).filter(function(e,n){return v(u["default"](n))===t})},O=function(e,t){return z(e).filter(function(e,n){return v(u["default"](n))===t})},R=function(e,t){var n=i({},t,e.toArray().reduce(function(e,t){return a({},e,i({},t.getAttribute("data-unit-id"),u["default"](t).outerWidth()))},{}));return n},A=function(e){Object.keys(e).forEach(function(t){var n=e[t],r=h(t);Object.keys(n).forEach(function(e){var t=n[e],i=L(r,e);x(i,t);var a=O(r,e);b(a,t)})})},w=function(e){return window.loggedUser.isAdministrator?f["default"].setPublic("ListColumnsResizer",d,{data:JSON.stringify(e)}):f["default"].set("ListColumnsResizer",d,{data:JSON.stringify(e)})},D=function(){var e=g().toArray().reduce(function(e,t){var n=u["default"](t),r=j(n);return a({},e,R(r,m(n)))},{});return console.log("RES",e),w(e)},E=function(){return f["default"].get("ListColumnsResizer",d).then(function(e){var t=e.data;try{return JSON.parse(t)}catch(n){return{}}}).then(A)},N=function(e){var t=j(e);t.each(function(e,t){return u["default"](t).append('<div class="ListColumnResizer-resizer"></div>')});var n=t.find(".ListColumnResizer-resizer");n.draggable({axis:"x",containment:t.parent(),cursor:"ew-resize",cursorAt:!1,stop:function(){D(p),n.css({left:"auto"})},drag:function(t,n){var r=n.position,i=n.offset;r.left=r.left-1;var a=u["default"](t.target).parent(),o=i.left-a.offset().left,s=o;if(10>=s)return t.stopPropagation(),!1;var c=v(a),l=L(e,c),f=O(e,c);x(l,s),b(f,s)}})};c["default"].addBusListener("newlist","boardSettings.ready",function(e,t){var n=t.boardSettings;d=n.settings.id});var U=function(){E();var e=g().filter(function(e,t){return!u["default"](t).data("isResizerAdded")});console.log(e),e.each(function(e,t){var n=u["default"](t);n.data("isResizerAdded",!0),N(n)})};c["default"].addBusListener("newlist","overview.board.ready",function(e,t){var n=t.element;p=n,U(),p.on("mouseenter",".i-role-list-root-container",function(){return U()})})},function(e,n){e.exports=t},function(e,t,n){"use strict";var r=n(5),i=n(7),a=n(8);e.exports={addBusListener:i.addBusListener,addBusListenerOnce:i.addBusListenerOnce,getAppConfigurator:r.getAppConfigurator,configurator:r,events:i,customUnits:a}},function(e,t,n){"use strict";var r=n(6),i=n(3),a=new i.Deferred;r.getGlobalBus().once("configurator.ready",function(e,t){a.resolve(t)});var o=function(){return a.promise()};e.exports={getAppConfigurator:o}},function(e,t){e.exports=n},function(e,t,n){"use strict";var r=n(6),i=r.getBusRegistry(),a=function(e){return function(){e.apply(null,Array.prototype.slice.call(arguments).slice(1))}},o=function(e,t,n,r){var o=a(function(i){var a=i.bus;a.name===e&&a[r?"once":"on"](t,n)}),u=i.addEventListener("create",o);return i.addEventListener("destroy",a(function(r){var i=r.bus;i.name===e&&i.removeListener(t,n,u)})),{remove:function(){i.removeListener("create",o,u),i.getBusRegistry().getByName(e).then(function(e){e.removeListener(t,n,u)})}}},u=function(e,t,n){return o(e,t,n,!0)};e.exports={addBusListener:o,addBusListenerOnce:u}},function(e,t,n){"use strict";var r=n(9),i=n(10),a=n(11).openUnitEditor,o=n(5),u=function(e){return e=e||{},e.types=e.types||[r.ANY_TYPE],e.sizes=e.sizes||Object.keys(i).map(function(e){return i[e]}),o.getAppConfigurator().then(function(t){var n=t.getUnitsRegistry();if(!e.id)throw new Error('Field "id" is required for custom unit config');if(n.units[e.id])throw new Error('Custom unit with id "'+e.id+'" has been already registered');e.name=e.name||e.id,e.model=e.model||e.sampleData?e.model:{dummy:1},"string"!=typeof e.model&&"object"==typeof e.model&&(e.model=Object.keys(e.model).reduce(function(t,n){return t.concat(n+":"+e.model[n])},[]).join(", ")),e.sampleData=e.sampleData||{},e.template=e.template||{markup:['<div class="tau-board-unit__value">'+e.id+"</div>"]},"string"==typeof e.template&&(e.template={markup:[e.template]}),"string"==typeof e.template.markup&&(e.template.markup=[e.template.markup]),e.outerClassName&&(e.classId=e.outerClassName),e.isEditable&&(e.interactionConfig={isEditable:e.isEditable},e.editorHandler?e.interactionConfig.handler=e.editorHandler:e.interactionConfig.handler=function(t,n){var r=t.cardDataForUnit,i=e.editorComponentName instanceof Function?e.editorComponentName(r):e.editorComponentName,o=a(i,{});if(e.editorData){var u={};Object.keys(e.editorData).forEach(function(t){var n=e.editorData[t];u[t]=n instanceof Function?n(r):r[n]}),t.cardDataForUnit=u}return o(t,n)}),n.units[e.id]=n.register([e])[e.id]})};e.exports={types:r,sizes:i,add:u}},function(e,t){e.exports=r},function(e,t){e.exports=i},function(e,t){e.exports=a},function(e,t,n){"use strict";var r=n(3),i=n(6),a={get:function(e,t){return r.ajax({type:"GET",url:i.getApplicationPath()+"/storage/v1/"+e+"/"+t,contentType:"application/json; charset=utf-8",dataType:"json"}).then(function(e){return Object.keys(e.userData).length?e.userData:e.publicData},function(e){return 200===e.status?(new r.Deferred).resolve({}):e})},set:function(e,t,n){return r.ajax({type:"POST",url:i.getApplicationPath()+"/storage/v1/"+e+"/"+t,contentType:"application/json; charset=utf-8",dataType:"json",data:JSON.stringify({userData:n,scope:"Public"})})},setPublic:function(e,t,n){return r.ajax({type:"POST",url:i.getApplicationPath()+"/storage/v1/"+e+"/"+t,contentType:"application/json; charset=utf-8",dataType:"json",data:JSON.stringify({publicData:n,scope:"Public"})})}};e.exports=a},function(e,t,n){var r=n(14);"string"==typeof r&&(r=[[e.id,r,""]]);n(16)(r,{});r.locals&&(e.exports=r.locals)},function(e,t,n){t=e.exports=n(15)(),t.push([e.id,".ListColumnResizer-resizer{position:absolute;background-color:#e8e8e8;width:3px;top:0;right:-1px;bottom:0;z-index:99;cursor:ew-resize}.ListColumnResizer-resizer.ui-draggable-dragging,.ListColumnResizer-resizer:hover{background-color:#a8a8a8}",""])},function(e,t){e.exports=function(){var e=[];return e.toString=function(){for(var e=[],t=0;t<this.length;t++){var n=this[t];n[2]?e.push("@media "+n[2]+"{"+n[1]+"}"):e.push(n[1])}return e.join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var r={},i=0;i<this.length;i++){var a=this[i][0];"number"==typeof a&&(r[a]=!0)}for(i=0;i<t.length;i++){var o=t[i];"number"==typeof o[0]&&r[o[0]]||(n&&!o[2]?o[2]=n:n&&(o[2]="("+o[2]+") and ("+n+")"),e.push(o))}},e}},function(e,t,n){function r(e,t){for(var n=0;n<e.length;n++){var r=e[n],i=f[r.id];if(i){i.refs++;for(var a=0;a<i.parts.length;a++)i.parts[a](r.parts[a]);for(;a<r.parts.length;a++)i.parts.push(u(r.parts[a],t))}else{for(var o=[],a=0;a<r.parts.length;a++)o.push(u(r.parts[a],t));f[r.id]={id:r.id,refs:1,parts:o}}}}function i(e){for(var t=[],n={},r=0;r<e.length;r++){var i=e[r],a=i[0],o=i[1],u=i[2],s=i[3],c={css:o,media:u,sourceMap:s};n[a]?n[a].parts.push(c):t.push(n[a]={id:a,parts:[c]})}return t}function a(){var e=document.createElement("style"),t=v();return e.type="text/css",t.appendChild(e),e}function o(){var e=document.createElement("link"),t=v();return e.rel="stylesheet",t.appendChild(e),e}function u(e,t){var n,r,i;if(t.singleton){var u=m++;n=g||(g=a()),r=s.bind(null,n,u,!1),i=s.bind(null,n,u,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=o(),r=l.bind(null,n),i=function(){n.parentNode.removeChild(n),n.href&&URL.revokeObjectURL(n.href)}):(n=a(),r=c.bind(null,n),i=function(){n.parentNode.removeChild(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else i()}}function s(e,t,n,r){var i=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=h(t,i);else{var a=document.createTextNode(i),o=e.childNodes;o[t]&&e.removeChild(o[t]),o.length?e.insertBefore(a,o[t]):e.appendChild(a)}}function c(e,t){var n=t.css,r=t.media;t.sourceMap;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function l(e,t){var n=t.css,r=(t.media,t.sourceMap);r&&(n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var i=new Blob([n],{type:"text/css"}),a=e.href;e.href=URL.createObjectURL(i),a&&URL.revokeObjectURL(a)}var f={},d=function(e){var t;return function(){return"undefined"==typeof t&&(t=e.apply(this,arguments)),t}},p=d(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),v=d(function(){return document.head||document.getElementsByTagName("head")[0]}),g=null,m=0;e.exports=function(e,t){t=t||{},"undefined"==typeof t.singleton&&(t.singleton=p());var n=i(e);return r(n,t),function(e){for(var a=[],o=0;o<n.length;o++){var u=n[o],s=f[u.id];s.refs--,a.push(s)}if(e){var c=i(e);r(c,t)}for(var o=0;o<a.length;o++){var s=a[o];if(0===s.refs){for(var l=0;l<s.parts.length;l++)s.parts[l]();delete f[s.id]}}}};var h=function(){var e=[];return function(t,n){return e[t]=n,e.filter(Boolean).join("\n")}}()}])})}();