# printo.js
Function to visualize objects of any kind including recursive structures in a printable string


DEMO JSFiddle: https://jsfiddle.net/Victornpb/nq13wke4/

Usage
------

    printo(/* anything */);

Example
-------

### Javascript
```
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


### Output
```
root (object Object) => {
    x (number) => 1
    str (string) => hello
    arr (array Array) => {
        0 (number) => 1
        1 (number) => 2
        2 (number) => 3
    }

    arr2 (array Array) => {
        0 (number) => 1
        1 (string) => 1
        2 (boolean) => true
        3 (boolean) => false
        4 (null) => null
        5 (number) => NaN
        6 (number) => Infinity
        7 (object Object) => {
        }

        8 (array Array) => {
        }

    }

    boo (object Object) => {
        foo (object Object) => {
            bar (string) => hey
            baz (object Object) => {
                hello (object Object) => {
                    world (string) => Hey!
                }

            }

        }

        zzP (object Object) => {
            x (number) => 1
            y (number) => 2
        }

        zzz (object Object) => POINTER(root.boo.zzP)
        www (object Object) => {
            s (number) => 1
            d (number) => 2
        }

        wwP (object Object) => POINTER(root.boo.www)
        fn (function) => function Point(x, y) {...
        alert (function) => function alert() { [native code] }...
        d1 (object Date) => Wed May 10 2017 14:27:29 GMT-0300 (BRT)
        p1 (object Point) => {
            x (number) => 0
            y (number) => 1
            (proto) a (number) => -1
            (proto) b (number) => -2
        }

        rgx (object RegExp) => /abc/
        div (object HTMLDivElement) => DIV
        d2 (object Date) => POINTER(root.boo.d1)
        rgx2 (object RegExp) => POINTER(root.boo.rgx)
        rec (object Object) => POINTER(root.boo)
    }

}
```


A little background about this function
----------

I wrote this function back in the dark IE6 days, when Develpment tools (firebug, dragonfly, devtools) wasn't a thing, so the only thing you did back then was scatter alert()'s all over your code that was behaving. Trying to make something very object-oriented was a pain, so I wrote this function that I used to debug and inspect variables at runtime. I could use the `javascript:` protocol to launch popup with `window.open()` with the result of the `printo(someVeryComplicatedObject)`. 
Today much of the use cases has been replaced by browser tools like the awesome Chrome DevTools, but it still usefull in some situations and eviroments where dubug tools are not available.

Enjoy.
