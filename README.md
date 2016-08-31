
[![transformer](http://i.imgur.com/2QzGSBl.png)](#)

# transformer

 [![PayPal](https://img.shields.io/badge/%24-paypal-f39c12.svg)][paypal-donations] [![AMA](https://img.shields.io/badge/ask%20me-anything-1abc9c.svg)](https://github.com/IonicaBizau/ama) [![Travis](https://img.shields.io/travis/IonicaBizau/transformer.svg)](https://travis-ci.org/IonicaBizau/transformer/) [![Version](https://img.shields.io/npm/v/transformer.svg)](https://www.npmjs.com/package/transformer) [![Downloads](https://img.shields.io/npm/dt/transformer.svg)](https://www.npmjs.com/package/transformer) [![Get help on Codementor](https://cdn.codementor.io/badges/get_help_github.svg)](https://www.codementor.io/johnnyb?utm_source=github&utm_medium=button&utm_term=johnnyb&utm_campaign=github)

> Transform data using synchronous and asynchronous functions.

## :cloud: Installation

```sh
$ npm i --save transformer
```


## :clipboard: Example



```js
const Transformer = require("transformer");

let t = new Transformer({ world: "Earth" });


// There are three levels where the functions are added to be executed:
//
// Parallel:               | <0: [.............................................]>
// Unordered (don't wait): |                                <4a: [........]>
//                         +                                <4b: [....]>
//                         +                                <4c: [......]>
// Ordered (wait):         | <1: [...]> <2: [.]> <3:[.....]>                <5: [....]>

// This will run in parallel with all the other functions
t.add((data, cb) => {
    setTimeout(() => {
        data.parallel = 42;
        cb();
    }, 2000);
}, Transformer.PARALLEL);

// Async function, but ordered
t.add((data, cb) => {
    setTimeout(() => {
        data.oldWorld = data.world;
        data.world = "Mars";
        cb();
    }, 1000);
});

// Another async function and ordered
t.add((data, cb) => {
    setTimeout(() => {
        data.baz = 7;
        cb();
    }, 500);
});

// Async function, but not ordered
t.add((data, cb) => {
    setTimeout(() => {
        data.foo = 42;
        cb();
    }, 1000);
}, Transformer.UNORDERED);

// Another unordered function (this will end sooner)
t.add((data, cb) => {
    setTimeout(() => {
        data.bar = 42;
        cb(null, data);
    }, 900);
}, Transformer.UNORDERED);

// Sync function
t.add(data => {
    data.planet = data.world;
});

// Finally show the data
t.on("end", (err, data) => console.log(data));
// => { world: 'Mars'
//    , parallel: 42
//    , oldWorld: 'Earth'
//    , baz: 7
//    , bar: 42
//    , foo: 42
//    , planet: 'Mars' }
```

## :memo: Documentation


### `transformer(data, opts)`
Transformer
Transforms the data using synchronous and asynchronous functions.

#### Params
- **Object** `data`: The data object.
- **Object** `opts`: The options object:
 - `autostart` (Boolean): If `true`, the functions will be executed,
   without calling the `start()` method.

#### Return
- **Number** Return description.

### `add(fn, type)`
Adds a new function.

There are three levels where the functions are added to be executed:

Parallel:               | <0: [.............................................]>
Unordered (don't wait): |                                <4a: [........]>
                        +                                <4b: [....]>
                        +                                <4c: [......]>
Ordered (wait):         | <1: [...]> <2: [.]> <3:[.....]>                <5: [....]>

#### Params
- **Function|Transformer** `fn`: The function to add. Note you can add an existing transformer instance as well.
- **TransformerType** `type`: One of the following:
   - `Transformer.PARALLEL`: Used to append on the parallel timeline.
   - `Transformer.UNORDERED`: Grouped, but unordered.
   - `Transformer.ORDERED`: Grouped, but ordered.

#### Return
- **Transformer** The current Transformer instance.

### `start(data, fn)`
Starts the function execution.

#### Params
- **Object** `data`: The data object.
- **Function** `fn`: The callback function.



## :yum: How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].

## :dizzy: Where is this library used?
If you are using this library in one of your projects, add it in this list. :sparkles:


 - [`launchjs`](https://npmjs.com/package/launchjs)—Launch Application Framework
 - [`lien`](https://github.com/LienJS/Lien)—Another lightweight NodeJS framework. Lien is the link between request and response objects.

## :scroll: License

[MIT][license] © [Ionică Bizău][website]

[paypal-donations]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RVXDDLKKLQRJW
[donate-now]: http://i.imgur.com/6cMbHOC.png

[license]: http://showalicense.com/?fullname=Ionic%C4%83%20Biz%C4%83u%20%3Cbizauionica%40gmail.com%3E%20(http%3A%2F%2Fionicabizau.net)&year=2016#license-mit
[website]: http://ionicabizau.net
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
