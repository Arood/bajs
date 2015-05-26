/**
 * ba.js - Basic (CSS3) Animations in JavaScript
 */
(function() {

  var support = false,
      domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
      prefix  = '',
      test = document.createElement('p'),
      needsPrefix = ['transform'];

  document.body.insertBefore(test,null);

  if (test.style.animationName) { support = true; }
   
  if (!support) {
    for (var i = 0; i<domPrefixes.length; i++) {
      if (test.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
        prefix = domPrefixes[i];
        support = true;
        break;
      }
    }
  }

  document.body.removeChild(test);

  var guid = function() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
  };

  var bajs = function() {
    return this;
  };

  // Animator
  bajs.a = function(el, config, cb) {
    var fullprefix = (prefix !== '' ? "-"+prefix.toLowerCase()+"-" : "");
    var properties = ["duration", "curve", "delay", "repeat", "direction", "fill"];
    var id = guid();

    var duration = config.duration || "1s";
    var curve = config.curve || "ease";
    var delay = config.delay || "0s";
    var repeat = config.repeat || "1";
    var direction = config.direction || "normal";
    var fillMode = config.fill || "none";

    el.style[fullprefix + "animation"] = 'bajs-'+id+' '+duration+' '+curve+' '+delay+' '+repeat+' '+direction+' '+fillMode;

    var styleEl = document.createElement('style');
    styleEl.setAttribute('id','bajs-'+id);
    document.getElementsByTagName('head')[0].appendChild(styleEl);
   
    bajs.ade(el, function() {
      document.getElementsByTagName('head')[0].removeChild(styleEl);
      el.style[fullprefix + "animation"] = null;
      if (cb) { cb.call(el); }
    });

    var kf = '@' + fullprefix + 'keyframes bajs-'+id+' { ';

    for (var key in config) {
      if (config.hasOwnProperty(key) && properties.indexOf(key) === -1) {
        kf += key+' { ';
        for (var property in config[key]) {
          if (config[key].hasOwnProperty(property)) {
            kf += (needsPrefix.indexOf(property) !== -1 ? fullprefix : '')+property+': '+config[key][property]+'; ';
          }
        }
        kf += '} ';
      }
    }

    kf += '}';
   
    styleEl.innerHTML = kf;
  };

  // Animation Did End
  bajs.ade = function(el, cb) {
    var eventName = prefix === 'Webkit' ? 'webkitAnimationEnd' : (prefix === 'O' ? 'oAnimationEnd' : 'animationend');
    var animCB = function() {
      cb.call(el);
      el.removeEventListener(eventName, animCB);
    };
    el.addEventListener(eventName, animCB);
  };

  // Availability Test
  bajs.at = function(testCase) {
    if (!testCase) {
      return support;
    }
  }

  window.bajs = bajs;

  document.appendChild(document.createComment("\uD83D\uDCA9"));

})();