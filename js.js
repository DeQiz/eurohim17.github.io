var NO_JQUERY={}; (function(f,m,r){if(!("console"in f)){var p=f.console={};p.log=p.warn=p.error=p.debug=function(){}}m===NO_JQUERY&&(m={fn:{},extend:function(){for(var a=arguments[0],b=1,c=arguments.length;b<c;b++){var e=arguments[b],h;for(h in e)a[h]=e[h]}return a}});m.fn.pm=function(){console.log("usage: \nto send: $.pm(options)\nto receive: $.pm.bind(type, fn, [origin])");return this};m.pm=f.pm=function(a){c.send(a)};m.pm.bind=f.pm.bind=function(a,b,d,e){c.bind(a,b,d,e)};m.pm.unbind=f.pm.unbind=function(a,b){c.unbind(a, b)};m.pm.origin=f.pm.origin=null;m.pm.poll=f.pm.poll=200;var c={send:function(a){a=m.extend({},c.defaults,a);var b=a.target;if(a.target)if(a.type){var d={data:a.data,type:a.type};a.success&&(d.callback=c._callback(a.success));a.error&&(d.errback=c._callback(a.error));"postMessage"in b&&!a.hash?(c._bind(),b.postMessage(JSON.stringify(d),a.origin||"*")):(c.hash._bind(),c.hash.send(a,d))}else console.warn("postmessage type required");else console.warn("postmessage target window required")},bind:function(a, b,d,e){"postMessage"in f&&!e?c._bind():c.hash._bind();e=c.data("listeners.postmessage");e||(e={},c.data("listeners.postmessage",e));var h=e[a];h||(h=[],e[a]=h);h.push({fn:b,origin:d||m.pm.origin})},unbind:function(a,b){var d=c.data("listeners.postmessage");if(d)if(a)if(b){var e=d[a];if(e){for(var h=[],n=0,k=e.length;n<k;n++){var l=e[n];l.fn!==b&&h.push(l)}d[a]=h}}else delete d[a];else for(n in d)delete d[n]},data:function(a,b){return b===r?c._data[a]:c._data[a]=b},_data:{},_CHARS:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), _random:function(){for(var a=[],b=0;32>b;b++)a[b]=c._CHARS[0|32*Math.random()];return a.join("")},_callback:function(a){var b=c.data("callbacks.postmessage");b||(b={},c.data("callbacks.postmessage",b));var d=c._random();b[d]=a;return d},_bind:function(){c.data("listening.postmessage")||(f.addEventListener?f.addEventListener("message",c._dispatch,!1):f.attachEvent&&f.attachEvent("onmessage",c._dispatch),c.data("listening.postmessage",1))},_dispatch:function(a){try{var b=JSON.parse(a.data)}catch(d){console.warn("postmessage data invalid json: ", d);return}if(b.type){var e=(c.data("callbacks.postmessage")||{})[b.type];if(e)e(b.data);else for(var e=(c.data("listeners.postmessage")||{})[b.type]||[],h=0,n=e.length;h<n;h++){var k=e[h];if(k.origin&&a.origin!==k.origin)console.warn("postmessage message origin mismatch",a.origin,k.origin),b.errback&&c.send({target:a.source,data:{message:"postmessage origin mismatch",origin:[a.origin,k.origin]},type:b.errback});else try{var l=k.fn(b.data);b.callback&&c.send({target:a.source,data:l,type:b.callback})}catch(f){b.errback&& c.send({target:a.source,data:f,type:b.errback})}}}else console.warn("postmessage message type required")},hash:{send:function(a,b){var d=a.target,e=a.url;if(e){var e=c.hash._url(e),h,n=c.hash._url(f.location.href);if(f==d.parent)h="parent";else try{for(var k=0,l=parent.frames.length;k<l;k++)if(parent.frames[k]==f){h=k;break}}catch(t){h=f.name}null==h?console.warn("postmessage windows must be direct parent/child windows and the child must be available through the parent window.frames list"):(h={"x-requested-with":"postmessage", source:{name:h,url:n},postmessage:b},n="#x-postmessage-id="+c._random(),d.location=e+n+encodeURIComponent(JSON.stringify(h)))}else console.warn("postmessage target window url is required")},_regex:/^\#x\-postmessage\-id\=(\w{32})/,_regex_len:50,_bind:function(){c.data("polling.postmessage")||(setInterval(function(){var a=""+f.location.hash,b=c.hash._regex.exec(a);b&&(b=b[1],c.hash._last!==b&&(c.hash._last=b,c.hash._dispatch(a.substring(c.hash._regex_len))))},m.pm.poll||200),c.data("polling.postmessage", 1))},_dispatch:function(a){if(a){try{if(a=JSON.parse(decodeURIComponent(a)),!("postmessage"===a["x-requested-with"]&&a.source&&null!=a.source.name&&a.source.url&&a.postmessage))return}catch(b){return}var d=a.postmessage,e=(c.data("callbacks.postmessage")||{})[d.type];if(e)e(d.data);else for(var e="parent"===a.source.name?f.parent:f.frames[a.source.name],h=(c.data("listeners.postmessage")||{})[d.type]||[],n=0,k=h.length;n<k;n++){var l=h[n];if(l.origin){var t=/https?\:\/\/[^\/]*/.exec(a.source.url)[0]; if(t!==l.origin){console.warn("postmessage message origin mismatch",t,l.origin);d.errback&&c.send({target:e,data:{message:"postmessage origin mismatch",origin:[t,l.origin]},type:d.errback,hash:!0,url:a.source.url});continue}}try{var m=l.fn(d.data);d.callback&&c.send({target:e,data:m,type:d.callback,hash:!0,url:a.source.url})}catch(s){d.errback&&c.send({target:e,data:s,type:d.errback,hash:!0,url:a.source.url})}}}},_url:function(a){return(""+a).replace(/#.*$/,"")}}};m.extend(c,{defaults:{target:null, url:null,type:null,data:null,success:null,error:null,origin:"*",hash:!1}})})(this,"undefined"===typeof jQuery?NO_JQUERY:jQuery);"JSON"in window&&window.JSON||(JSON={}); (function(){function f(a){return 10>a?"0"+a:a}function m(a){c.lastIndex=0;return c.test(a)?'"'+a.replace(c,function(a){var b=d[a];return"string"===typeof b?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function r(c,d){var k,l,f,p,s=a,q,g=d[c];g&&"object"===typeof g&&"function"===typeof g.toJSON&&(g=g.toJSON(c));"function"===typeof e&&(g=e.call(d,c,g));switch(typeof g){case "string":return m(g);case "number":return isFinite(g)?String(g):"null";case "boolean":case "null":return String(g); case "object":if(!g)return"null";a+=b;q=[];if("[object Array]"===Object.prototype.toString.apply(g)){p=g.length;for(k=0;k<p;k+=1)q[k]=r(k,g)||"null";f=0===q.length?"[]":a?"[\n"+a+q.join(",\n"+a)+"\n"+s+"]":"["+q.join(",")+"]";a=s;return f}if(e&&"object"===typeof e)for(p=e.length,k=0;k<p;k+=1)l=e[k],"string"===typeof l&&(f=r(l,g))&&q.push(m(l)+(a?": ":":")+f);else for(l in g)Object.hasOwnProperty.call(g,l)&&(f=r(l,g))&&q.push(m(l)+(a?": ":":")+f);f=0===q.length?"{}":a?"{\n"+a+q.join(",\n"+a)+"\n"+ s+"}":"{"+q.join(",")+"}";a=s;return f}}"function"!==typeof Date.prototype.toJSON&&(Date.prototype.toJSON=function(a){return this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z"},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var p=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, c=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,a,b,d={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},e;"function"!==typeof JSON.stringify&&(JSON.stringify=function(c,d,f){var l;b=a="";if("number"===typeof f)for(l=0;l<f;l+=1)b+=" ";else"string"===typeof f&&(b=f);if((e=d)&&"function"!==typeof d&&("object"!==typeof d||"number"!==typeof d.length))throw Error("JSON.stringify");return r("",{"":c})}); "function"!==typeof JSON.parse&&(JSON.parse=function(a,b){function c(a,d){var e,f,g=a[d];if(g&&"object"===typeof g)for(e in g)Object.hasOwnProperty.call(g,e)&&(f=c(g,e),void 0!==f?g[e]=f:delete g[e]);return b.call(a,d,g)}var d;p.lastIndex=0;p.test(a)&&(a=a.replace(p,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))return d=eval("("+a+")"),"function"===typeof b?c({"":d},""):d;throw new SyntaxError("JSON.parse");})})();
function getOffsetTop(a){return a.getBoundingClientRect?getOffsetTopRect(a):getOffsetTopSum(a)}function getOffsetTopSum(a){for(var b=0;a;)b+=parseInt(a.offsetTop),a=a.offsetParent;return b}function getOffsetTopRect(a){a=a.getBoundingClientRect();var b=document.body,c=document.documentElement;return Math.round(a.top+(window.pageYOffset||c.scrollTop||b.scrollTop)-(c.clientTop||b.clientTop||0))};
;(function(w, d){
	if(!('fdforms' in w)){
		return false;
	}
			
	for(var i in w.fdforms){
		createForm(w.fdforms[i]);
		delete w.fdforms[i];
	}	
	
	w.FDSetData = function(id, data) {
		var iframe = d.getElementById(id).getElementsByTagName('iframe')[0];
		if(iframe.loaded) {
			pm({
				target: w.frames[iframe.id],
				type: "setdata", 
				data: data,
				url: iframe.contentWindow.location
	        });
		}
		else {
			attachEvent(iframe, 'load', function(){
				pm({
					target: w.frames[iframe.id],
					type: "setdata", 
					data: data,
					url: iframe.contentWindow.location
		        }); 
			});
		} 
	};
	
	function createForm(formOptions){
		var defaultHeight = (formOptions.formHeight ? parseInt(formOptions.formHeight): 100)+'px';
		var iframe = d.createElement('iframe');
		var name = 'form'+formOptions.formId+'-'+Math.round(Math.random()*1000);
		iframe.style.height = defaultHeight;
		iframe.style.width = "100%";
		iframe.style.border = 0;
		iframe.allowTransparency = "true";
		iframe.scrolling = 'no';
		iframe.frameborder = '0';
		iframe.marginheight = '0';
		iframe.marginwidth = '0';
		iframe.id = name;
		iframe.name = name;
		iframe.src = (d.location.protocol == "https:" ? "https:" : "http:")+'//'+(typeof formOptions.host != 'undefined' ? formOptions.host: 'formdesigner.ru')+'/form/iframe/'+formOptions.formId+(formOptions.center ? '?center=1': '');
		var callback = false; 
		iframe.onload = function(){
			var data = {id:iframe.id, referrer: d.referrer, url: d.location.href};
			if(formOptions.fields){
				data.fields = formOptions.fields;
			}
			if(typeof formOptions.title != 'undefined'){
				data.title = formOptions.title;
			}
			
			iframe.loaded = 1;
			
			var scroll = true;
			if(typeof formOptions.scroll != 'undefined'){
				scroll = formOptions.scroll;
			}
			
			pm({
				target: w.frames[iframe.id],
				type: "register", 
				data: data,
				url: iframe.contentWindow.location
	        });       
	        pm.bind(iframe.id, function(data) {
				var frame = d.getElementById(data.id);
				if (frame == null) return;
				if(data.height){
					frame.style.height = (data.height+6).toString() + "px";	
				} 
				if(data.scrollTop && scroll){
					w.scrollTo(0, getOffsetTop(frame) + data.scrollTop);
				}  
				if(data.success && !callback && formOptions.callback){
					formOptions.callback();
					callback = true;
				}          
	        });     	
		};
		var el = formOptions.el ? formOptions.el: 'form_'+formOptions.formId;
		d.getElementById(el).appendChild(iframe);
	}
	
	function attachEvent(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,c)}
})(window, document);