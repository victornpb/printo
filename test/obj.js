function Point(x, y) {
  this.x = x;
  this.y = y;
}
Point.prototype.a = -1;
Point.prototype.b = {
  x: 1,
  y: 0
};
Point.prototype.c = function cFn(pA, pB) {
  return pA + pB;
};

class P {
  constructor() {
    this.x = undefined;
    this.y = undefined;
  }
}

const obj = {

  'p1': {
    'p2': {
      'p3': {
        'p4': {
          'p5': {
            'p6': {
              'p7': {
                'p8': {
                  'p9': {
                    'p10': "END"
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  x: 1,
  PI: Math.PI,
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
    Point: Point,
    P: P,
    arrowFn: (a, b) => a + b,
    //console: console,
    d1: new Date(),
    p1: new Point(0, 1),
    rgx: /abc/,
    // div: document.createElement('div')
    // svg: document.createElement()

  },

}

//create a few recursions
obj.boo.zzP = obj.boo.zzz;
obj.boo.wwP = obj.boo.www;
obj.boo.wwP = obj.boo.www;
obj.boo.d2 = obj.boo.d1;
obj.boo.rgx2 = obj.boo.rgx;
obj.boo.rec = obj.boo;
obj.a = obj;


module.exports = obj;




// var o = {
//   undefined: undefined,
//   null: null,
//   NaN: NaN,
//   true: true,
//   false: false,
//   trueO: new Boolean(true),
//   falseO: new Boolean(false),
//   number: 1,
//   numberO: new Number(1),
//   string: "Hello",
//   stringO: new String("Hello"),
//   regex: /\d+/g,
//   regexO: new RegExp('\\d+', 'g'),
//   array: [1, 2, 3],
//   arrayO: new Array(1, 2, 3),
//   object: {},
//   objectO: new Object(),
//   function: function sum(a, b) {
//     return a + b;
//   },
//   functionAnnon: function (a, b) {
//     return a + b;
//   },
//   functionArrow: (a, b) => a + b,
//   functionArrowBrackets: (a, b) => {
//     return a + b;
//   },
//   functionAssync: async function () {},
//   generator: function* g() {},
//   class: class Point {
//     constructor(x, y) {
//       this.x = x;
//       this.y = y;
//     }
//   },
//   date: new Date(),
// };
