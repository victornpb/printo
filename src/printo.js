function printo(obj, skipPrototype, printFunctionsBody, maxDepth) {
    'use strict';

    if (skipPrototype === undefined) skipPrototype = false;
    if (printFunctionsBody === undefined) printFunctionsBody = false;

    const ROOT_KEY = 'root';

    const TYPE_START = ' (';
    const TYPE_END = ')';

    const PROTO_IDENTIFIER = '__proto__.';
    const MAXDEPTH_IDENTIFIER = '/* MAX DEPTH */';
    const POINTER_IDENTIFIER = '*';

    const PATH_START = '/* POINTER(';
    const PATH_END = ') */';
    const PATH_SEPARATOR = '.';

    const mem = {
        nodes: [],
        path: []
    };

    const wrapper = {};

    wrapper[ROOT_KEY] = obj;

    function formatter(prop, type, value, constructorName, path, isPrototype, isPointer, maxDepth) {
        var key = (isPrototype ? PROTO_IDENTIFIER : '') + prop + TYPE_START + type + (type === 'object' ? ' ' + constructorName : '') + TYPE_END + (isPointer ? POINTER_IDENTIFIER : '');
        var val = maxDepth ? value : value;

        return {
            key,
            val
        };
    }

    function pathFormatter(array) {
        return PATH_START + array.join(PATH_SEPARATOR) + PATH_END;
    }

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

    function kindOf(variable) {
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
            return getConstructor(o).match(/HTML/);
        }

        if (typeof obj === 'object') {
            const x = Object.prototype.toString.call(obj);
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
        var level = path.length;

        const isMaxdepth = (level >= maxDepth && maxDepth !== undefined);

        const symbols = {};

        visit(obj, path);

        for (let prop in obj) {

            const isProto = !Object.prototype.hasOwnProperty.call(obj, prop);
            if (skipPrototype && isProto) continue;

            // access child
            let child;
            try {
                child = obj[prop];
            }
            catch (err) {
                symbols['/* ' + prop + ' (ERROR) */'] = err;
                continue; //skip
            }

            const type = kindOf(obj[prop]);
            const constructorName = getConstructor(child);




            let printVal;
            const pointer = isVisited(child);

            if (pointer) {
                printVal = pathFormatter(pointer);
            }
            else if (type === 'function') {
                printVal = child.toString();
            }
            else if (type === 'object' || type === 'array') {
                let str = stringifableObj(child);
                if (str) {
                    visit(child, [].concat(path, prop));
                    printVal = str;
                }
                else {
                    if (isMaxdepth) {
                        printVal = MAXDEPTH_IDENTIFIER;
                    }
                    else {
                        printVal = expandObject(child, [].concat(path, prop)); // print children using recursion
                    }
                }
            }
            else { //primitive
                printVal = child;
            }

            let p = formatter(prop, type, printVal, constructorName, path, isProto, !!pointer, isMaxdepth);
            symbols[p.key] = p.val;

        }
        return symbols;
    }

    const result = expandObject(wrapper, []);
    return result;
}

export default printo;

export default printo;