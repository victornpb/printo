function printo(obj, options) {
    'use strict';

    options = {
        maxDepth: 50,
        skipPrototype: false,
        truncateFunctions: true,
        formatter,
        pathFormatter
    };

    const ROOT_KEY = 'root';
    const MAXDEPTH_IDENTIFIER = '/* MAX DEPTH */';
    
    function formatter(obj, prop, type, value, constructorName, path, isPrototype, isPointer, maxDepth) {
        const PROTO_IDENTIFIER = '__proto__.';
        const POINTER_IDENTIFIER = ' *POINTER';
        
        var key = (isPrototype ? PROTO_IDENTIFIER : '') + prop + ' (' + type + (type === 'object' ? ' ' + constructorName : '') + ')' + (isPointer ? POINTER_IDENTIFIER : '');
        var val = maxDepth ? value : value;
        
        return {
            key,
            val
        };
    }
    
    function pathFormatter(path) {
        const PREFIX = '/*';
        const SUFIX = '*/';
        const PATH_SEPARATOR = '.';
        
        return PREFIX + ' '+ path.join(PATH_SEPARATOR)+' ' + SUFIX;
    }

    function functionFormatter(fn) {
        let source = fn.toString();
        if (options.truncateFunctions) {
            if (source.length > 50) {
                source = source.substr(0, source.indexOf(')'));
            }
        }
        return source;
    }
    
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
        }
        else if (Object.prototype.toString.call(variable) === '[object Array]') {
            return 'array';
        }
        else {
            return typeof variable;
        }
    }

    function getConstructor(obj) {
        if (typeof obj === 'object') {
            try {
                return '' + obj.constructor.name;
            }
            catch (e) {
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
            }
            catch (err) {
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
            }
            else if (type === 'function') {
                printVal = functionFormatter(child);
            }
            else if (type === 'object' || type === 'array') {

                let str = stringifableObj(child);
                if (str) {
                    visit(child, [].concat(path, prop));
                    printVal = str;
                }
                else {
                    if (isMaxDepth) {
                        printVal = MAXDEPTH_IDENTIFIER;
                    }
                    else {
                        printVal = expandObject(child, [].concat(path, prop)); // print children using recursion
                    }
                }
            }
            else { // primitive
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