function printo(obj, skipPrototype, printFunctionsBody, maxDepth) {
    "use strict";

    if (skipPrototype === undefined) skipPrototype = false;
    if (printFunctionsBody === undefined) printFunctionsBody = false;

    const ROOT_KEY = "root";

    const TYPE_START = " (";
    const TYPE_END = ")";

    const PROTO_IDENTIFIER = "__proto__.";
    const MAXDEPTH_IDENTIFIER = "/* MAX DEPTH */";
    const POINTER_IDENTIFIER = "*";

    const PATH_START = "/* POINTER(";
    const PATH_END = ") */";
    const PATH_SEPARATOR = ".";

    var mem = {
        nodes: [],
        memo: []
    };

    var wrapper = {};
    wrapper[ROOT_KEY] = obj;

    var result = expandObject(wrapper, ROOT_KEY, '', 0); //inicia a varredura
    return result;

    function visit(obj, key, path) {
        var i = mem.nodes.length;
        mem.nodes[i] = obj;
        mem.memo[i] = { key: key, path: path };
    }

    function isVisited(obj) {
        var i = mem.nodes.indexOf(obj);
        if (i < 0) return false;
        else return mem.memo[i];
    }

    function kindOf(variable) {
        var type;
        if (variable === null) {
            type = 'null';
        }
        else if (Object.prototype.toString.call(variable) === '[object Array]') {
            type = 'array';
        }
        else {
            type = typeof variable;
        }
        return type;
    }

    function isHTMLElement(o) {
        return getConstructor(o).match(/HTML/);
    }

    function printableObj(obj) {
        if (typeof obj === "object") {
            var x = Object.prototype.toString.call(obj);
            switch (x) {
                case "[object Date]":
                    return obj.toString();
                case "[object RegExp]":
                    return obj.toString();
            }
            if (isHTMLElement(obj)) return obj.outerHTML;
        }
        return false;
    }

    function getConstructor(obj) {
        if (typeof obj === 'object') {
            try {
                return obj.constructor.name;
            } catch (e) {
                return "Unknown Constructor";
            }
        }
        return "NOT_OBJECT";
    }

    function expandObject(obj, parentKey, path, level) {
        if (level === undefined) level = 0;

        var str = {};

        visit(obj, parentKey, path);

        for (var key in obj) {
            var child;

            var fromProto = !Object.prototype.hasOwnProperty.call(obj, key);
            if (skipPrototype && fromProto) continue;
            var protoFlag = (fromProto ? PROTO_IDENTIFIER : "");

            try {
                child = obj[key];
            } catch (err) {
                str["/* EXCEPTION " + Math.random() + " */"] = err;
                continue;
            }

            var kind = kindOf(obj[key]);

            if (typeof child === "object" && child !== null) { //key is an Object (have children)
                var constructorName = getConstructor(child);

                var p;
                if (p = isVisited(child)) {
                    str["" + protoFlag + key + TYPE_START + kind + " " + constructorName + TYPE_END + POINTER_IDENTIFIER] = PATH_START + p.path.substr(PATH_SEPARATOR.length) + PATH_END;
                }
                else {
                    if (level < maxDepth || maxDepth === undefined) {
                        var toStr;
                        if (toStr = printableObj(child)) {
                            visit(child, key, path + PATH_SEPARATOR + key);
                            str["" + protoFlag + key + TYPE_START + kind + " " + constructorName + TYPE_END] = toStr;
                        }
                        else {
                            str["" + protoFlag + key + TYPE_START + kind + " " + constructorName + TYPE_END] = expandObject(child, key, path + PATH_SEPARATOR + key, level + 1); //print children using recursion
                        }
                    }
                    else {
                        str["" + protoFlag + key + TYPE_START + kind + " " + constructorName + TYPE_END] = MAXDEPTH_IDENTIFIER;

                    }
                }
            }
            else { //obj is a property (does not have children)

                //str.push(tab(level));
                if (kind === "function") {
                    if (!printFunctionsBody) {
                        str["" + protoFlag + key + TYPE_START + kind + TYPE_END] = child.toString().match(/.*/)[0].substr(0, 200) + "...";
                    }
                    else {
                        str["" + protoFlag + key + TYPE_START + kind + TYPE_END] = child.toString();
                    }
                }
                else {
                    str["" + protoFlag + key + TYPE_START + kind + TYPE_END] = child;
                }
            }

        }
        return str;
    }
}

export default printo;