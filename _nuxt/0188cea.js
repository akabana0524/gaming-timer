(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{457:function(e,t,n){"use strict";n.r(t);n(88),n(45);var r=n(6),o=n(1),c=n(294),m=o.a.extend({data:function(){return{}},mounted:function(){return Object(r.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c.timerStore.load();case 2:case"end":return e.stop()}}),e)})))()},computed:{timers:function(){return c.timerStore.timers}},methods:{test:function(){return Object(r.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c.timerStore.add({duration:1e4,name:"test"});case 2:case"end":return e.stop()}}),e)})))()},remove:function(e){return Object(r.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("delete",{id:e}),t.next=3,c.timerStore.remove(e);case 3:case"end":return t.stop()}}),t)})))()},toggle:function(e){var t=this;return Object(r.a)(regeneratorRuntime.mark((function n(){var r;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if(!(r=t.timers.find((function(t){return t.id===e})))){n.next=9;break}if("pause"!==r.state){n.next=7;break}return n.next=5,c.timerStore.play(e);case 5:n.next=9;break;case 7:return n.next=9,c.timerStore.pause(e);case 9:case"end":return n.stop()}}),n)})))()},play:function(e){return Object(r.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,c.timerStore.play(e);case 2:case"end":return t.stop()}}),t)})))()},pause:function(e){return Object(r.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,c.timerStore.pause(e);case 2:case"end":return t.stop()}}),t)})))()}}}),f=n(83),v=n(421),d=n.n(v),l=n(452),w=n(456),x=n(458),k=n(453),_=n(454),component=Object(f.a)(m,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",[n("v-container",[n("v-row",[n("v-btn",{on:{click:function(t){return e.test()}}},[e._v("test")])],1),e._v(" "),e._l(e.timers,(function(t){return n("v-row",{key:t.id},["play"!==t.state?n("v-btn",{on:{click:function(n){return e.play(t.id)}}},[n("v-icon",[e._v("mdi-play")])],1):e._e(),e._v(" "),"play"===t.state?n("v-btn",{on:{click:function(n){return e.pause(t.id)}}},[n("v-icon",[e._v("mdi-pause")])],1):e._e(),e._v(" "),n("v-btn",{on:{click:function(n){return e.remove(t.id)}}},[n("v-icon",[e._v("mdi-close")])],1),e._v(" "),n("span",[e._v(e._s(JSON.stringify(t)))])],1)}))],2)],1)}),[],!1,null,null,null);t.default=component.exports;d()(component,{VApp:l.a,VBtn:w.a,VContainer:x.a,VIcon:k.a,VRow:_.a})}}]);