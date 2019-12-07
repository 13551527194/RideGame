!function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:!1};return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),module.loaded=!0,module.exports}__webpack_require__.m=modules,__webpack_require__.c=installedModules,__webpack_require__.p="",__webpack_require__(0)}([function(module,exports,__webpack_require__){"use strict";var obj,_window=function(obj){if(obj&&obj.__esModule)return obj;var newObj={};if(null!=obj)for(var key in obj)Object.prototype.hasOwnProperty.call(obj,key)&&(newObj[key]=obj[key]);return newObj.default=obj,newObj}(__webpack_require__(1)),_HTMLElement2=(obj=__webpack_require__(4))&&obj.__esModule?obj:{default:obj},global=GameGlobal;GameGlobal.__isAdapterInjected||(GameGlobal.__isAdapterInjected=!0,function(){_window.addEventListener=function(type,listener){_window.document.addEventListener(type,listener)},_window.removeEventListener=function(type,listener){_window.document.removeEventListener(type,listener)},_window.canvas&&(_window.canvas.addEventListener=_window.addEventListener,_window.canvas.removeEventListener=_window.removeEventListener),global.sharedCanvas&&(sharedCanvas.__proto__.__proto__=new _HTMLElement2.default("canvas"),sharedCanvas.addEventListener=_window.addEventListener,sharedCanvas.removeEventListener=_window.removeEventListener);var platform=wx.getSystemInfoSync().platform;if("undefined"==typeof __devtoolssubcontext&&"devtools"===platform){for(var key in _window){var descriptor=Object.getOwnPropertyDescriptor(global,key);descriptor&&!0!==descriptor.configurable||Object.defineProperty(window,key,{value:_window[key]})}for(var _key in _window.document){var _descriptor=Object.getOwnPropertyDescriptor(global.document,_key);_descriptor&&!0!==_descriptor.configurable||Object.defineProperty(global.document,_key,{value:_window.document[_key]})}window.parent=window}else{for(var _key2 in _window)global[_key2]=_window[_key2];global.window=_window,window=global,window.top=window.parent=window}}())},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.cancelAnimationFrame=exports.requestAnimationFrame=exports.clearInterval=exports.clearTimeout=exports.setInterval=exports.setTimeout=exports.canvas=exports.location=exports.localStorage=exports.HTMLElement=exports.FileReader=exports.Audio=exports.Image=exports.WebSocket=exports.XMLHttpRequest=exports.navigator=exports.document=void 0;var _WindowProperties=__webpack_require__(2);Object.keys(_WindowProperties).forEach(function(key){"default"!==key&&"__esModule"!==key&&Object.defineProperty(exports,key,{enumerable:!0,get:function(){return _WindowProperties[key]}})});var _constructor=__webpack_require__(3);Object.keys(_constructor).forEach(function(key){"default"!==key&&"__esModule"!==key&&Object.defineProperty(exports,key,{enumerable:!0,get:function(){return _constructor[key]}})});var _Canvas2=_interopRequireDefault(__webpack_require__(9)),_Util=__webpack_require__(17),_document3=_interopRequireDefault(__webpack_require__(10)),_navigator3=_interopRequireDefault(__webpack_require__(18)),_XMLHttpRequest3=_interopRequireDefault(__webpack_require__(19)),_WebSocket3=_interopRequireDefault(__webpack_require__(20)),_Image3=_interopRequireDefault(__webpack_require__(11)),_Audio3=_interopRequireDefault(__webpack_require__(12)),_FileReader3=_interopRequireDefault(__webpack_require__(21)),_HTMLElement3=_interopRequireDefault(__webpack_require__(4)),_localStorage3=_interopRequireDefault(__webpack_require__(22)),_location3=_interopRequireDefault(__webpack_require__(23));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}exports.document=_document3.default,exports.navigator=_navigator3.default,exports.XMLHttpRequest=_XMLHttpRequest3.default,exports.WebSocket=_WebSocket3.default,exports.Image=_Image3.default,exports.Audio=_Audio3.default,exports.FileReader=_FileReader3.default,exports.HTMLElement=_HTMLElement3.default,exports.localStorage=_localStorage3.default,exports.location=_location3.default;var canvas=(0,_Util.isSubContext)()?void 0:new _Canvas2.default;exports.canvas=canvas,exports.setTimeout=setTimeout,exports.setInterval=setInterval,exports.clearTimeout=clearTimeout,exports.clearInterval=clearInterval,exports.requestAnimationFrame=requestAnimationFrame,exports.cancelAnimationFrame=cancelAnimationFrame},function(module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _wx$getSystemInfoSync=wx.getSystemInfoSync(),screenWidth=_wx$getSystemInfoSync.screenWidth,screenHeight=_wx$getSystemInfoSync.screenHeight,devicePixelRatio=_wx$getSystemInfoSync.devicePixelRatio,innerWidth=exports.innerWidth=screenWidth,innerHeight=exports.innerHeight=screenHeight;exports.devicePixelRatio=devicePixelRatio,exports.screen={availWidth:innerWidth,availHeight:innerHeight},exports.performance={now:function(){return Date.now()/1e3}},exports.ontouchstart=null,exports.ontouchmove=null,exports.ontouchend=null},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.HTMLCanvasElement=exports.HTMLImageElement=void 0;var obj,_HTMLElement4=(obj=__webpack_require__(4))&&obj.__esModule?obj:{default:obj};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}function HTMLCanvasElement(){return _classCallCheck(this,HTMLCanvasElement),_possibleConstructorReturn(this,(HTMLCanvasElement.__proto__||Object.getPrototypeOf(HTMLCanvasElement)).call(this,"canvas"))}function HTMLImageElement(){return _classCallCheck(this,HTMLImageElement),_possibleConstructorReturn(this,(HTMLImageElement.__proto__||Object.getPrototypeOf(HTMLImageElement)).call(this,"img"))}exports.HTMLImageElement=(_inherits(HTMLImageElement,_HTMLElement4.default),HTMLImageElement),exports.HTMLCanvasElement=(_inherits(HTMLCanvasElement,_HTMLElement4.default),HTMLCanvasElement)},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var obj,_Element3=(obj=__webpack_require__(5))&&obj.__esModule?obj:{default:obj},_util=__webpack_require__(8),_WindowProperties=__webpack_require__(2),HTMLElement=function(){function HTMLElement(){var tagName=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"";!function(instance){if(!(instance instanceof HTMLElement))throw new TypeError("Cannot call a class as a function")}(this);var _this=function(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}(this,(HTMLElement.__proto__||Object.getPrototypeOf(HTMLElement)).call(this));return _this.className="",_this.childern=[],_this.style={width:_WindowProperties.innerWidth+"px",height:_WindowProperties.innerHeight+"px"},_this.insertBefore=_util.noop,_this.innerHTML="",_this.tagName=tagName.toUpperCase(),_this}return function(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}(HTMLElement,_Element3.default),function(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}(HTMLElement.prototype,[{key:"setAttribute",value:function(name,value){this[name]=value}},{key:"getAttribute",value:function(name){return this[name]}},{key:"getBoundingClientRect",value:function(){return{top:0,left:0,width:_WindowProperties.innerWidth,height:_WindowProperties.innerHeight}}},{key:"focus",value:function(){}},{key:"clientWidth",get:function(){var ret=parseInt(this.style.fontSize,10)*this.innerHTML.length;return Number.isNaN(ret)?0:ret}},{key:"clientHeight",get:function(){var ret=parseInt(this.style.fontSize,10);return Number.isNaN(ret)?0:ret}}]),HTMLElement}();exports.default=HTMLElement},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var obj,_Node3=(obj=__webpack_require__(6))&&obj.__esModule?obj:{default:obj},ELement=function(){function ELement(){!function(instance){if(!(instance instanceof ELement))throw new TypeError("Cannot call a class as a function")}(this);var _this=function(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}(this,(ELement.__proto__||Object.getPrototypeOf(ELement)).call(this));return _this.className="",_this.children=[],_this}return function(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}(ELement,_Node3.default),ELement}();exports.default=ELement},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var obj,_EventTarget3=(obj=__webpack_require__(7))&&obj.__esModule?obj:{default:obj},Node=function(){function Node(){!function(instance){if(!(instance instanceof Node))throw new TypeError("Cannot call a class as a function")}(this);var _this=function(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}(this,(Node.__proto__||Object.getPrototypeOf(Node)).call(this));return _this.childNodes=[],_this}return function(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}(Node,_EventTarget3.default),function(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}(Node.prototype,[{key:"appendChild",value:function(node){if(!(node instanceof Node))throw new TypeError("Failed to executed 'appendChild' on 'Node': parameter 1 is not of type 'Node'.");this.childNodes.push(node)}},{key:"cloneNode",value:function(){var copyNode=Object.create(this);return Object.assign(copyNode,this),copyNode}},{key:"removeChild",value:function(node){var index=this.childNodes.findIndex(function(child){return child===node});return-1<index?this.childNodes.splice(index,1):null}}]),Node}();exports.default=Node},function(module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _events=new WeakMap,EventTarget=function(){function EventTarget(){!function(instance){if(!(instance instanceof EventTarget))throw new TypeError("Cannot call a class as a function")}(this),_events.set(this,{})}return function(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}(EventTarget.prototype,[{key:"addEventListener",value:function(type,listener,argument_2){var options=2<arguments.length&&void 0!==argument_2?argument_2:{},events=_events.get(this);events||(events={},_events.set(this,events)),events[type]||(events[type]=[]),events[type].push(listener),options.capture&&console.warn("EventTarget.addEventListener: options.capture is not implemented."),options.once&&console.warn("EventTarget.addEventListener: options.once is not implemented."),options.passive&&console.warn("EventTarget.addEventListener: options.passive is not implemented.")}},{key:"removeEventListener",value:function(type,listener){var listeners=_events.get(this)[type];if(listeners&&0<listeners.length)for(var i=listeners.length;i--;)if(listeners[i]===listener){listeners.splice(i,1);break}}},{key:"dispatchEvent",value:function(argument_0){var event=0<arguments.length&&void 0!==argument_0?argument_0:{},listeners=_events.get(this)[event.type];if(listeners)for(var i=0;i<listeners.length;i++)listeners[i](event)}}]),EventTarget}();exports.default=EventTarget},function(module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.noop=function(){},exports.isSubContext=function(){return"undefined"!=typeof GameGlobal&&!0===GameGlobal.__isSubContext}},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(){var canvas=wx.createCanvas();return canvas.type="canvas",canvas.__proto__.__proto__=new _HTMLElement2.default("canvas"),canvas.getContext,canvas.getBoundingClientRect=function(){return{top:0,left:0,width:window.innerWidth,height:window.innerHeight}},canvas},__webpack_require__(3);var _HTMLElement2=_interopRequireDefault(__webpack_require__(4));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}_interopRequireDefault(__webpack_require__(10))},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var window=function(obj){if(obj&&obj.__esModule)return obj;var newObj={};if(null!=obj)for(var key in obj)Object.prototype.hasOwnProperty.call(obj,key)&&(newObj[key]=obj[key]);return newObj.default=obj,newObj}(__webpack_require__(1)),_HTMLElement2=_interopRequireDefault(__webpack_require__(4)),_Image2=_interopRequireDefault(__webpack_require__(11)),_Audio2=_interopRequireDefault(__webpack_require__(12)),_Canvas2=_interopRequireDefault(__webpack_require__(9));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}__webpack_require__(15);var events={},document={readyState:"complete",visibilityState:"visible",documentElement:window,hidden:!1,style:{},location:window.location,ontouchstart:null,ontouchmove:null,ontouchend:null,head:new _HTMLElement2.default("head"),body:new _HTMLElement2.default("body"),createElement:function(tagName){return"canvas"===tagName?new _Canvas2.default:"audio"===tagName?new _Audio2.default:"img"===tagName?new _Image2.default:new _HTMLElement2.default(tagName)},getElementById:function(id){return id===window.canvas.id?window.canvas:null},getElementsByTagName:function(tagName){return"head"===tagName?[document.head]:"body"===tagName?[document.body]:"canvas"===tagName?[window.canvas]:[]},querySelector:function(query){return"head"===query?document.head:"body"===query?document.body:"canvas"===query?window.canvas:query==="#"+window.canvas.id?window.canvas:null},querySelectorAll:function(query){return"head"===query?[document.head]:"body"===query?[document.body]:"canvas"===query?[window.canvas]:[]},addEventListener:function(type,listener){events[type]||(events[type]=[]),events[type].push(listener)},removeEventListener:function(type,listener){var listeners=events[type];if(listeners&&0<listeners.length)for(var i=listeners.length;i--;)if(listeners[i]===listener){listeners.splice(i,1);break}},dispatchEvent:function(event){var listeners=events[event.type];if(listeners)for(var i=0;i<listeners.length;i++)listeners[i](event)}};exports.default=document},function(module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(){return wx.createImage()}},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var obj,_HTMLAudioElement3=(obj=__webpack_require__(13))&&obj.__esModule?obj:{default:obj},_util=__webpack_require__(8);function _possibleConstructorReturn(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}var _innerAudioContext=new WeakMap,_src=new WeakMap,Audio=(new WeakMap,new WeakMap,function(){function Audio(url){!function(instance){if(!(instance instanceof Audio))throw new TypeError("Cannot call a class as a function")}(this);var _this=_possibleConstructorReturn(this,(Audio.__proto__||Object.getPrototypeOf(Audio)).call(this));if(_this.HAVE_NOTHING=0,_this.HAVE_METADATA=1,_this.HAVE_CURRENT_DATA=2,_this.HAVE_FUTURE_DATA=3,_this.HAVE_ENOUGH_DATA=4,(_this.readyState=0,_util.isSubContext)())return console.warn("HTMLAudioElement is not supported in SubContext."),_possibleConstructorReturn(_this);_src.set(_this,"");var innerAudioContext=wx.createInnerAudioContext();return _innerAudioContext.set(_this,innerAudioContext),innerAudioContext.onCanplay(function(){_this.dispatchEvent({type:"load"}),_this.dispatchEvent({type:"loadend"}),_this.dispatchEvent({type:"canplay"}),_this.dispatchEvent({type:"canplaythrough"}),_this.dispatchEvent({type:"loadedmetadata"}),_this.readyState=2}),innerAudioContext.onPlay(function(){_this.dispatchEvent({type:"play"})}),innerAudioContext.onPause(function(){_this.dispatchEvent({type:"pause"})}),innerAudioContext.onEnded(function(){_this.dispatchEvent({type:"ended"}),_this.readyState=4}),innerAudioContext.onError(function(){_this.dispatchEvent({type:"error"})}),url&&(_innerAudioContext.get(_this).src=url),_this}return function(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}(Audio,_HTMLAudioElement3.default),function(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}(Audio.prototype,[{key:"load",value:function(){console.warn("HTMLAudioElement.load() is not implemented.")}},{key:"play",value:function(){(0,_util.isSubContext)()||_innerAudioContext.get(this).play()}},{key:"pause",value:function(){(0,_util.isSubContext)()||_innerAudioContext.get(this).pause()}},{key:"canPlayType",value:function(argument_0){var mediaType=0<arguments.length&&void 0!==argument_0?argument_0:"";return"string"!=typeof mediaType?"":-1<mediaType.indexOf("audio/mpeg")||mediaType.indexOf("audio/mp4")?"probably":""}},{key:"cloneNode",value:function(){var newAudio=new Audio;return(0,_util.isSubContext)()||(newAudio.loop=_innerAudioContext.get(this).loop,newAudio.autoplay=_innerAudioContext.get(this).loop,newAudio.src=this.src),newAudio}},{key:"currentTime",get:function(){return(0,_util.isSubContext)()?0:_innerAudioContext.get(this).currentTime},set:function(value){(0,_util.isSubContext)()||_innerAudioContext.get(this).seek(value)}},{key:"src",get:function(){return _src.get(this)},set:function(value){_src.set(this,value),(0,_util.isSubContext)()||(_innerAudioContext.get(this).src=value)}},{key:"loop",get:function(){return!(0,_util.isSubContext)()&&_innerAudioContext.get(this).loop},set:function(value){(0,_util.isSubContext)()||(_innerAudioContext.get(this).loop=value)}},{key:"autoplay",get:function(){return!(0,_util.isSubContext)()&&_innerAudioContext.get(this).autoplay},set:function(value){(0,_util.isSubContext)()||(_innerAudioContext.get(this).autoplay=value)}},{key:"paused",get:function(){return!(0,_util.isSubContext)()&&_innerAudioContext.get(this).paused}}]),Audio}());exports.default=Audio},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var obj,_HTMLMediaElement3=(obj=__webpack_require__(14))&&obj.__esModule?obj:{default:obj},HTMLAudioElement=function(){function HTMLAudioElement(){return function(instance){if(!(instance instanceof HTMLAudioElement))throw new TypeError("Cannot call a class as a function")}(this),function(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}(this,(HTMLAudioElement.__proto__||Object.getPrototypeOf(HTMLAudioElement)).call(this,"audio"))}return function(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}(HTMLAudioElement,_HTMLMediaElement3.default),HTMLAudioElement}();exports.default=HTMLAudioElement},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var obj,_HTMLElement3=(obj=__webpack_require__(4))&&obj.__esModule?obj:{default:obj},HTMLMediaElement=function(){function HTMLMediaElement(type){return function(instance){if(!(instance instanceof HTMLMediaElement))throw new TypeError("Cannot call a class as a function")}(this),function(self,call){if(!self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!call||"object"!=typeof call&&"function"!=typeof call?self:call}(this,(HTMLMediaElement.__proto__||Object.getPrototypeOf(HTMLMediaElement)).call(this,type))}return function(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:!1,writable:!0,configurable:!0}}),superClass&&(Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass)}(HTMLMediaElement,_HTMLElement3.default),function(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}(HTMLMediaElement.prototype,[{key:"addTextTrack",value:function(){}},{key:"captureStream",value:function(){}},{key:"fastSeek",value:function(){}},{key:"load",value:function(){}},{key:"pause",value:function(){}},{key:"play",value:function(){}}]),HTMLMediaElement}();exports.default=HTMLMediaElement},function(module,exports,__webpack_require__){"use strict";__webpack_require__(16)},function(module,exports,__webpack_require__){"use strict";var obj,window=function(obj){if(obj&&obj.__esModule)return obj;var newObj={};if(null!=obj)for(var key in obj)Object.prototype.hasOwnProperty.call(obj,key)&&(newObj[key]=obj[key]);return newObj.default=obj,newObj}(__webpack_require__(1)),_document2=(obj=__webpack_require__(10))&&obj.__esModule?obj:{default:obj},_util=__webpack_require__(8);function TouchEvent(type){!function(instance){if(!(instance instanceof TouchEvent))throw new TypeError("Cannot call a class as a function")}(this),this.target=window.canvas,this.currentTarget=window.canvas,this.touches=[],this.targetTouches=[],this.changedTouches=[],this.preventDefault=_util.noop,this.stopPropagation=_util.noop,this.type=type}function touchEventHandlerFactory(type){return function(event){var touchEvent=new TouchEvent(type);touchEvent.touches=event.touches,touchEvent.targetTouches=Array.prototype.slice.call(event.touches),touchEvent.changedTouches=event.changedTouches,touchEvent.timeStamp=event.timeStamp,_document2.default.dispatchEvent(touchEvent)}}wx.onTouchStart(touchEventHandlerFactory("touchstart")),wx.onTouchMove(touchEventHandlerFactory("touchmove")),wx.onTouchEnd(touchEventHandlerFactory("touchend")),wx.onTouchCancel(touchEventHandlerFactory("touchcancel"))},function(module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.noop=function(){},exports.isSubContext=function(){return"undefined"!=typeof GameGlobal&&!0===GameGlobal.__isSubContext}},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _util=__webpack_require__(8),navigator={platform:wx.getSystemInfoSync().platform,language:"zh-cn",appVersion:"5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1",userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 MicroMessenger/6.6.0 MiniGame NetType/WIFI Language/zh_CN",onLine:!0,geolocation:{getCurrentPosition:_util.noop,watchPosition:_util.noop,clearWatch:_util.noop}};exports.default=navigator},function(module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _url=new WeakMap,_method=new WeakMap,_requestHeader=new WeakMap,_responseHeader=new WeakMap,_requestTask=new WeakMap;function _triggerEvent(type){if("function"==typeof this["on"+type]){for(var _len=arguments.length,args=Array(1<_len?_len-1:0),_key=1;_key<_len;_key++)args[_key-1]=arguments[_key];this["on"+type].apply(this,args)}}function _changeReadyState(readyState){this.readyState=readyState,_triggerEvent.call(this,"readystatechange")}var XMLHttpRequest=function(){function XMLHttpRequest(){!function(instance){if(!(instance instanceof XMLHttpRequest))throw new TypeError("Cannot call a class as a function")}(this),this.onabort=null,this.onerror=null,this.onload=null,this.onloadstart=null,this.onprogress=null,this.ontimeout=null,this.onloadend=null,this.onreadystatechange=null,this.readyState=0,this.response=null,this.responseText=null,this.responseType="",this.responseXML=null,this.status=0,this.statusText="",this.upload={},this.withCredentials=!1,_requestHeader.set(this,{"content-type":"application/x-www-form-urlencoded"}),_responseHeader.set(this,{})}return function(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}(XMLHttpRequest.prototype,[{key:"abort",value:function(){var myRequestTask=_requestTask.get(this);myRequestTask&&myRequestTask.abort()}},{key:"getAllResponseHeaders",value:function(){var responseHeader=_responseHeader.get(this);return Object.keys(responseHeader).map(function(header){return header+": "+responseHeader[header]}).join("\n")}},{key:"getResponseHeader",value:function(header){return _responseHeader.get(this)[header]}},{key:"open",value:function(method,url){_method.set(this,method),_url.set(this,url),_changeReadyState.call(this,XMLHttpRequest.OPENED)}},{key:"overrideMimeType",value:function(){}},{key:"send",value:function(argument_0){var _this=this,data=0<arguments.length&&void 0!==argument_0?argument_0:"";if(this.readyState!==XMLHttpRequest.OPENED)throw new Error("Failed to execute 'send' on 'XMLHttpRequest': The object's state must be OPENED.");wx.request({data:data,url:_url.get(this),method:_method.get(this),header:_requestHeader.get(this),responseType:this.responseType,success:function(_ref){var data=_ref.data,statusCode=_ref.statusCode,header=_ref.header;if("string"!=typeof data&&!(data instanceof ArrayBuffer))try{data=JSON.stringify(data)}catch(e){data=data}if(_this.status=statusCode,_responseHeader.set(_this,header),_triggerEvent.call(_this,"loadstart"),_changeReadyState.call(_this,XMLHttpRequest.HEADERS_RECEIVED),_changeReadyState.call(_this,XMLHttpRequest.LOADING),(_this.response=data)instanceof ArrayBuffer){_this.responseText="";for(var bytes=new Uint8Array(data),len=bytes.byteLength,i=0;i<len;i++)_this.responseText+=String.fromCharCode(bytes[i])}else _this.responseText=data;_changeReadyState.call(_this,XMLHttpRequest.DONE),_triggerEvent.call(_this,"load"),_triggerEvent.call(_this,"loadend")},fail:function(_ref2){var errMsg=_ref2.errMsg;-1!==errMsg.indexOf("abort")?_triggerEvent.call(_this,"abort"):_triggerEvent.call(_this,"error",errMsg),_triggerEvent.call(_this,"loadend")}})}},{key:"setRequestHeader",value:function(header,value){var myHeader=_requestHeader.get(this);myHeader[header]=value,_requestHeader.set(this,myHeader)}}]),XMLHttpRequest}();XMLHttpRequest.UNSEND=0,XMLHttpRequest.OPENED=1,XMLHttpRequest.HEADERS_RECEIVED=2,XMLHttpRequest.LOADING=3,XMLHttpRequest.DONE=4,exports.default=XMLHttpRequest},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _util=__webpack_require__(8),_socketTask=new WeakMap,WebSocket=function(){function WebSocket(url){var _this=this,protocols=1<arguments.length&&void 0!==arguments[1]?arguments[1]:[];if(function(instance){if(!(instance instanceof WebSocket))throw new TypeError("Cannot call a class as a function")}(this),this.binaryType="",this.bufferedAmount=0,this.extensions="",this.onclose=null,this.onerror=null,this.onmessage=null,this.onopen=null,this.protocol="",this.readyState=3,(0,_util.isSubContext)())throw new Error("WebSocket is not supported in SubContext.");if("string"!=typeof url||!/(^ws:\/\/)|(^wss:\/\/)/.test(url))throw new TypeError("Failed to construct 'WebSocket': The URL '"+url+"' is invalid");this.url=url,this.readyState=WebSocket.CONNECTING;var socketTask=wx.connectSocket({url:url,protocols:Array.isArray(protocols)?protocols:[protocols]});return _socketTask.set(this,socketTask),socketTask.onClose(function(res){_this.readyState=WebSocket.CLOSED,"function"==typeof _this.onclose&&_this.onclose(res)}),socketTask.onMessage(function(res){"function"==typeof _this.onmessage&&_this.onmessage(res)}),socketTask.onOpen(function(){_this.readyState=WebSocket.OPEN,"function"==typeof _this.onopen&&_this.onopen()}),socketTask.onError(function(res){"function"==typeof _this.onerror&&_this.onerror(new Error(res.errMsg))}),this}return function(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}(WebSocket.prototype,[{key:"close",value:function(code,reason){this.readyState=WebSocket.CLOSING,_socketTask.get(this).close({code:code,reason:reason})}},{key:"send",value:function(data){if("string"!=typeof data&&!(data instanceof ArrayBuffer))throw new TypeError("Failed to send message: The data "+data+" is invalid");_socketTask.get(this).send({data:data})}}]),WebSocket}();WebSocket.CONNECTING=0,WebSocket.OPEN=1,WebSocket.CLOSING=2,WebSocket.CLOSED=3,exports.default=WebSocket},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _util=__webpack_require__(8),FileReader=function(){function FileReader(){!function(instance){if(!(instance instanceof FileReader))throw new TypeError("Cannot call a class as a function")}(this)}return function(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}(FileReader.prototype,[{key:"construct",value:function(){if((0,_util.isSubContext)())throw new Error("FileReader is not supported in SubContext.")}}]),FileReader}();exports.default=FileReader},function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _util=__webpack_require__(8),mainContext={get length(){return wx.getStorageInfoSync().keys.length},key:function(n){return wx.getStorageInfoSync().keys[n]},getItem:function(key){return wx.getStorageSync(key)},setItem:function(key,value){return wx.setStorageSync(key,value)},removeItem:function(key){wx.removeStorageSync(key)},clear:function(){wx.clearStorageSync()}},memLocalStorage={},subContext={get length(){return Object.keys(memLocalStorage).length},key:function(n){return Object.keys(memLocalStorage)[n]},getItem:function(key){return memLocalStorage[key]},setItem:function(key,value){memLocalStorage[key]=value},removeItem:function(key){delete memLocalStorage[key]},clear:function(){memLocalStorage={}}},localStorage=(0,_util.isSubContext)()?subContext:mainContext;exports.default=localStorage},function(module,exports){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default={href:"game.js",reload:function(){}}}]);