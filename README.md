# Print Object
Visualize objects of any kind including cyclic structures in a stringifiable object

DEMO JSFiddle: https://jsfiddle.net/Victornpb/nq13wke4/


## Installation

[NPM](https://www.npmjs.com/package/printo)

	npm install printo

[Yarn](https://yarnpkg.com/package/printo)

	yarn add printo
  
[Unpkg](https://unpkg.com/browse/printo)

    https://unpkg.com/browse/printo@3.0.1/lib/printo.min.js

## Usage

See [documentation](./DOCUMENTATION.md)

```js
    printo(any, [options]);
```

## Example

### Javascript
```js
function Point(x, y) {
    this.x = x;
    this.y = y;
}
Point.prototype.a = -1;
Point.prototype.b = -2;

obj = {
    x: 1,
    str: "hello",
    arr: [1, 2, 3],
    arr2: [1, '1', true, false, null, NaN, Infinity, {},
        []
    ],
    boo: {
        foo: {
            bar: "hey",
            baz: {
                hello: {
                    world: "Hey!"
                }
            }
        },
        zzP: {},
        zzz: {
            x: 1,
            y: 2
        },
        www: {
            s: 1,
            d: 2
        },
        wwP: {},
        fn: Point,
        alert: alert,
        d1: new Date(),
        p1: new Point(0, 1),
        rgx: /abc/,
        div: document.createElement('div')

    }

}

//create a few recursions
obj.boo.zzP = obj.boo.zzz;
obj.boo.wwP = obj.boo.www;
obj.boo.wwP = obj.boo.www;
obj.boo.d2 = obj.boo.d1;
obj.boo.rgx2 = obj.boo.rgx;
obj.boo.rec = obj.boo;

//print object
out.innerHTML = printo(obj);

```


### Serialized Output
```json
{
    "root (object Object)": {
        "x (number)": 1,
        "str (string)": "hello",
        "arr (array)": {
            "0 (number)": 1,
            "1 (number)": 2,
            "2 (number)": 3
        },
        "arr2 (array)": {
            "0 (number)": 1,
            "1 (string)": "1",
            "2 (boolean)": true,
            "3 (boolean)": false,
            "4 (null)": null,
            "5 (number)": null,
            "6 (number)": null,
            "7 (object Object)": {},
            "8 (array)": {}
        },
        "boo (object Object)": {
            "foo (object Object)": {
                "bar (string)": "hey",
                "baz (object Object)": {
                    "hello (object Object)": {
                        "world (string)": "Hey!"
                    }
                }
            },
            "zzP (object Object)": {},
            "zzz (object Object)": {
                "x (number)": 1,
                "y (number)": 2
            },
            "www (object Object)": {
                "s (number)": 1,
                "d (number)": 2
            },
            "wwP (object Object)": {},
            "fn (function)": "function Point(x, y)",
            "alert (function)": "function alert() { [native code] }",
            "d1 (object Date)": "Fri Dec 08 2017 12:40:59 GMT-0200 (BRST)",
            "p1 (object Point)": {
                "x (number)": 0,
                "y (number)": 1,
                "__proto__.a (number)": -1,
                "__proto__.b (number)": -2
            },
            "rgx (object RegExp)": "/abc/",
            "div (object HTMLDivElement)": "<div>"
        }
    }
}
```
## Documentation

See [documentation](./DOCUMENTATION.md)

A little background about this function
----------

I wrote this function back in the dark IE6 days, when Development tools (firebug, dragonfly, devtools) wasn't a thing, so the only thing you did back then was scatter alert()'s all over your code that was behaving. Trying to make something very object-oriented was a pain, so I wrote this function that I used to debug and inspect variables at runtime. I could use the `javascript:` protocol to launch a popup with `window.open()` with the result of the `printo(someVeryComplicatedObject)` which outputed a formatted string at the time.
 
Today much of the use cases has been replaced by browser tools like the awesome Chrome DevTools, but it still usefull in some situations and eviroments where dubug tools are not available.

Enjoy.
