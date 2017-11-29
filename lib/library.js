(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("library", [], factory);
	else if(typeof exports === 'object')
		exports["library"] = factory();
	else
		root["library"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _printo = __webpack_require__(1);

var _printo2 = _interopRequireDefault(_printo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _printo2.default;
module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function printo(obj, options) {
    'use strict';

    options = {
        maxDepth: 50,
        skipPrototype: false,
        truncateFunctions: true,
        formatter: formatter,
        pathFormatter: pathFormatter
    };

    var ROOT_KEY = 'root';
    var MAXDEPTH_IDENTIFIER = '/* MAX DEPTH */';

    function formatter(obj, prop, type, value, constructorName, path, isPrototype, isPointer, maxDepth) {
        var PROTO_IDENTIFIER = '__proto__.';
        var POINTER_IDENTIFIER = ' *POINTER';

        var key = (isPrototype ? PROTO_IDENTIFIER : '') + prop + ' (' + type + (type === 'object' ? ' ' + constructorName : '') + ')' + (isPointer ? POINTER_IDENTIFIER : '');
        var val = maxDepth ? value : value;

        return {
            key: key,
            val: val
        };
    }

    function pathFormatter(path) {
        var PREFIX = '/*';
        var SUFIX = '*/';
        var PATH_SEPARATOR = '.';

        return PREFIX + ' ' + path.join(PATH_SEPARATOR) + ' ' + SUFIX;
    }

    var mem = {
        nodes: [],
        path: []
    };

    var wrapper = {};

    wrapper[ROOT_KEY] = obj;

    function visit(obj, path) {
        var i = mem.nodes.length;

        mem.nodes[i] = obj;
        mem.path[i] = path;
    }

    function isVisited(obj) {
        var i = mem.nodes.indexOf(obj);

        if (i < 0) return false;
        return mem.path[i];
    }

    function typeOf(variable) {
        if (variable === null) {
            return 'null';
        } else if (Object.prototype.toString.call(variable) === '[object Array]') {
            return 'array';
        } else {
            return typeof variable === 'undefined' ? 'undefined' : _typeof(variable);
        }
    }

    function getConstructor(obj) {
        if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
            try {
                return '' + obj.constructor.name;
            } catch (e) {
                return 'UNKNOWN';
            }
        }
        return 'PRIMITIVE';
    }

    function stringifableObj(obj) {

        function isHTMLElement(o) {
            return getConstructor(o).match(/HTML/);
        }

        if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
            var x = Object.prototype.toString.call(obj);
            switch (x) {
                case '[object Date]':
                    return obj.toString();
                case '[object RegExp]':
                    return obj.toString();
            }
            if (isHTMLElement(obj)) return obj.outerHTML;
        }
        return false;
    }

    function expandObject(obj, path) {

        var depth = path.length;
        var isMaxDepth = depth >= options.maxDepth && options.maxDepth !== undefined;

        var symbols = {};

        visit(obj, path);

        // expand child properties
        for (var prop in obj) {

            var isProto = !Object.prototype.hasOwnProperty.call(obj, prop);
            if (options.skipPrototype && isProto) continue;

            var type = typeOf(obj[prop]);

            // access child
            var child = void 0;
            try {
                child = obj[prop];
            } catch (err) {
                symbols['/* ' + prop + ' (EXCEPTION) */'] = err;
                continue; //skip
            }

            var constructorName = void 0;

            var printVal = void 0;

            var pointer = isVisited(child);

            if (pointer) {
                printVal = options.pathFormatter(pointer);
            } else if (type === 'function') {
                var source = child.toString();
                printVal = options.truncateFunctions ? source.substr(0, 200) + (source.length > 200 ? '(...)' : '') : source;
            } else if (type === 'object' || type === 'array') {
                constructorName = getConstructor(child);

                var str = stringifableObj(child);
                if (str) {
                    visit(child, [].concat(path, prop));
                    printVal = str;
                } else {
                    if (isMaxDepth) {
                        printVal = MAXDEPTH_IDENTIFIER;
                    } else {
                        printVal = expandObject(child, [].concat(path, prop)); // print children using recursion
                    }
                }
            } else {
                //primitive
                printVal = child;
            }

            var p = options.formatter(child, prop, type, printVal, constructorName, path, isProto, !!pointer, isMaxDepth);
            symbols[p.key] = p.val;
        }
        return symbols;
    }

    var result = expandObject(wrapper, []);
    return result;
}

exports.default = printo;
module.exports = exports['default'];

/***/ })
/******/ ]);
});
//# sourceMappingURL=library.js.map