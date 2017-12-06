/**
 * 
 * @param {*} obj Any Javascript variable
 * @param {Object} options Options used
 * @param {Number} options.maxDepth Max depth the function should traverse
 * @param {Boolean} options.skipPrototype Set to true to not enumerate properties from prototype
 * @param {String} options.rootKey Name use to represent the top level variable
 * @param {Function} options.formatter Function used to format each key, value in the final JSON
 * @param {Function} options.pathFormatter Function used to format the pointers path
 * @param {Function} options.functionFormatter Function used to turn functions into strings
 */
function printo(obj, options) {
    'use strict';

    //defaults
    options = deepObjectExtend({
        maxDepth: 1024,
        skipPrototype: false,
        rootKey: 'root',
        formatter: function formatter(obj, prop, type, value, constructorName, path, isPrototype, isPointer, maxDepth) {
            const PROTO_IDENTIFIER = '__proto__.';
            const POINTER_IDENTIFIER = ' *POINTER';
            return {
                key: `${(isPrototype ? PROTO_IDENTIFIER : '')}${prop} (${type}${(type === 'object' ? ' ' + constructorName : '')})${(isPointer ? POINTER_IDENTIFIER : '')}`,
                val: maxDepth ? '/* MAX DEPTH */' : value,
            };
        },
        pathFormatter: function pathFormatter(path) {
            return `/* ${path.join('.')} */`;
        },
        functionFormatter: function functionFormatter(fn) {
            var source = fn.toString();
            if (source.length > 50) {
                source = source.substr(0, source.indexOf(')') + 1);
            }
            return source;
        }
    }, options);


    function deepObjectExtend(base, extension) {
        for (var prop in extension) {
            if (extension.hasOwnProperty(prop)) {
                if (base[prop] && typeof extension[prop] === 'object') {
                    deepObjectExtend(base[prop], extension[prop]);
                }
                else {
                    base[prop] = extension[prop];
                }
            }
        }
        return base;
    }

    const ROOT_KEY = options.rootKey;
    const MAXDEPTH_IDENTIFIER = '/* MAX DEPTH */';

    const wrapper = {};
    wrapper[ROOT_KEY] = obj;

    const mem = new WeakMap();

    function visit(obj, path) {
        mem.set(obj, path);
    }

    function isVisited(obj) {
        return mem.get(obj);
    }

    function typeOf(variable) {
        if (variable === null) {
            return 'null';
        } else if (Object.prototype.toString.call(variable) === '[object Array]') {
            return 'array';
        } else {
            return typeof variable;
        }
    }

    function getConstructor(obj) {
        if (typeof obj === 'object') {
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
            return getConstructor(o).match(/HTML|SVG/);
        }

        if (typeof obj === 'object') {
            const x = Object.prototype.toString.call(obj);
            switch (x) {
                case '[object Date]':
                    return obj.toString();
                case '[object RegExp]':
                    return obj.toString();
                case '[object SVGTextElement]':
                    return obj.toString();
            }
            if (isHTMLElement(obj)) return (obj.outerHTML || '').match(/<[^>]+>/) + '';
        }
        return false;
    }

    function expandObject(obj, path) {

        const depth = path.length;
        const isMaxDepth = (depth >= options.maxDepth && options.maxDepth !== undefined);

        const symbols = {};

        visit(obj, path);

        // expand child properties
        for (let prop in obj) {

            // access child
            let child;
            try {
                child = obj[prop];
            } catch (err) {
                symbols['/* ' + prop + ' (EXCEPTION) */'] = err;
                continue; // skip
            }

            const isProto = !Object.prototype.hasOwnProperty.call(obj, prop);
            if (options.skipPrototype && isProto) continue;

            const type = typeOf(obj[prop]);
            const constructorName = getConstructor(child);
            const pointer = isVisited(child);

            let printVal;

            if (pointer) {
                printVal = options.pathFormatter(pointer);
            } else if (type === 'function') {
                printVal = options.functionFormatter(child);
            } else if (type === 'object' || type === 'array') {

                let str = stringifableObj(child);
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
            } else { // primitive
                printVal = child;
            }

            let p = options.formatter(child, prop, type, printVal, constructorName, path, isProto, !!pointer, isMaxDepth);
            symbols[p.key] = p.val;

        }
        return symbols;
    }

    const result = expandObject(wrapper, []);
    return result;
}

export default printo;