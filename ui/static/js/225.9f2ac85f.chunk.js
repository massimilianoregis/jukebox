/*! For license information please see 225.9f2ac85f.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkjukeboxpi=self.webpackChunkjukeboxpi||[]).push([[225],{7225:function(e,n,t){t.r(n),t.d(n,{startFocusVisible:function(){return r}});var o="ion-focused",s=["Tab","ArrowDown","Space","Escape"," ","Shift","Enter","ArrowLeft","ArrowRight","ArrowUp","Home","End"],r=function(e){var n=[],t=!0,r=e?e.shadowRoot:document,i=e||document.body,c=function(e){n.forEach((function(e){return e.classList.remove(o)})),e.forEach((function(e){return e.classList.add(o)})),n=e},u=function(){t=!1,c([])},a=function(e){(t=s.includes(e.key))||c([])},d=function(e){if(t&&void 0!==e.composedPath){var n=e.composedPath().filter((function(e){return!!e.classList&&e.classList.contains("ion-focusable")}));c(n)}},f=function(){r.activeElement===i&&c([])};r.addEventListener("keydown",a),r.addEventListener("focusin",d),r.addEventListener("focusout",f),r.addEventListener("touchstart",u),r.addEventListener("mousedown",u);return{destroy:function(){r.removeEventListener("keydown",a),r.removeEventListener("focusin",d),r.removeEventListener("focusout",f),r.removeEventListener("touchstart",u),r.removeEventListener("mousedown",u)},setFocus:c}}}}]);
//# sourceMappingURL=225.9f2ac85f.chunk.js.map