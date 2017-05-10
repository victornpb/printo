/**
 * Visualize an Object in a printable string
 * @param  {Object}   obj                        An object to be visualized
 * @param  {String}   [linebreak="\n"]           Line break character (default:\n)
 * @param  {String}   [tabulation="\t"]          Tabulation character (default:\t)
 * @param  {String}   [skipPrototype=false]      Skip prototype properties
 * @param  {String}   [printFunctionsBody=false] Print functions body or just the signature
 * @param  {String}   [maxDeep=-1]               Max deepness to traverse the tree
 * @return {String}   The output string
 *
 * @author Victor N. wwww.victorborges.com
 * @date   2006
 * @see https://github.com/victornpb/printo.js
 */
function printo(obj, linebreak, tabulation, skipPrototype, printFunctionsBody, maxDeep) {
	"use strict";

	if (skipPrototype === undefined) skipPrototype = false;
	if (printFunctionsBody === undefined) printFunctionsBody = false;

	const ROOT_KEY = "root";
	const FAMILY_START = "{";
	const FAMILY_END = "}";
	const TYPE_START = " (";
	const TYPE_END = ")";
	const VALUE_ARRROW = " => ";
	const PATH_START = "(";
	const PATH_END = ")";
	const PATH_SEPARATOR = ".";
	const PROTO_IDENTIFIER = "(proto) ";
	const POINTER_IDENTIFIER = "POINTER";
	const MAXDEEP_IDENTIFIER = "MAXDEEP";
	

	var n = linebreak ? linebreak : "\n";
	var tabtoken = tabulation ? tabulation : "\t";
	
	var mem = {
		nodes: [],
		memo: []
	};

	var wrapper = {};
	wrapper[ROOT_KEY] = obj;

	return expandObject(wrapper, ROOT_KEY, '', 0); //inicia a varredura
	
	function tab(n) {
		// return new Array(n+1).join(tabtoken);
		var str = [];
		while (n > 0) {
			str.push(tabtoken);
			n--;
		}
		return (str.join(''));
	}

	
	function visit(obj, key, path) {
		var i = mem.nodes.length;
		mem.nodes[i] = obj;
		mem.memo[i] = {key: key, path: path};
		
	}
	function isVisited(obj) {
		// for (var i = 0; i < nodes.length; i++) {
		// 	if (nodes[i].pointer === obj) {
		// 		return nodes[i];
		// 	}
		// }
		// return false;
		
		var i = mem.nodes.indexOf(obj);
		if(i<0) return false;
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
			if (isHTMLElement(obj)) return obj.tagName;
		}
		return false;
	}

	function getConstructor(obj) {
		if(typeof obj==='object') {
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

		var str = [];

		visit(obj, parentKey, path);

		for (var key in obj) {
			var child;

			var fromProto = !Object.prototype.hasOwnProperty.call(obj, key);
			if (skipPrototype && fromProto) continue;
			var protoFlag = (fromProto ? PROTO_IDENTIFIER : "");

			try {
				child = obj[key];
			} catch (err) {
				str.push("(!!!)" + err + "(/!!!)");
				continue;
			}

			var kind = kindOf(obj[key]);

			if (typeof child === "object" && child !== null) { //key is an Object (have children)
				var constructorName = getConstructor(child);

				var p;
				if (p = isVisited(child)) {
					str.push(tab(level) + "" + protoFlag + key + TYPE_START + kind + " " + constructorName + TYPE_END + VALUE_ARRROW + POINTER_IDENTIFIER + PATH_START + p.path.substr(PATH_SEPARATOR.length) + PATH_END + n);
				}
				else {
					if (level < maxDeep || maxDeep === undefined) {
						var toStr;
						if (toStr = printableObj(child)) {
							visit(child, key, path + PATH_SEPARATOR + key);
							str.push(tab(level) + "" + protoFlag + key + TYPE_START + kind + " " + constructorName + TYPE_END + VALUE_ARRROW + toStr + n);
						}
						else {
							str.push(tab(level) + "" + protoFlag + key + TYPE_START + kind + " " + constructorName + TYPE_END + VALUE_ARRROW + FAMILY_START + n);
							str.push(expandObject(child, key, path + PATH_SEPARATOR + key, level + 1)); //print children using recursion
							str.push(tab(level) + FAMILY_END + n);
							str.push(tab(level) + n);
						}
					}
					else {
						str.push(tab(level) + "" + protoFlag + key + TYPE_START + kind + " " + constructorName + TYPE_END + VALUE_ARRROW + MAXDEEP_IDENTIFIER + n);

					}
				}
			}
			else { //obj is a property (does not have children)

				str.push(tab(level));
				if (kind === "function"){
					if(!printFunctionsBody){
						str.push("" + protoFlag + key + TYPE_START + kind + TYPE_END + VALUE_ARRROW + child.toString().match(/.*/)[0].substr(0, 200) + "..." + n);
					}
					else{
						str.push("" + protoFlag + key + TYPE_START + kind + TYPE_END + VALUE_ARRROW + child.toString().replace(/\n/g, '\n'+tab(level)) + n);
					}
				}
				else{
					str.push("" + protoFlag + key + TYPE_START + kind + TYPE_END + VALUE_ARRROW + child + n);
				}
			}

		}
		return str.join('');
	}
}

if(typeof module!=="undefined") module.exports = printo;
