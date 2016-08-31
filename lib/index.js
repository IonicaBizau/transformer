"use strict";

const EventEmitter = require("events").EventEmitter
    , ul = require("ul")
    , deffy = require("deffy")
    , typpy = require("typpy")
    , noop = require("noop6")
    , asyncer = require("asyncer.js")
    , fnResult = require("fn-result")
    ;

class Transformer extends EventEmitter {

    /**
     * Transformer
     * Transforms the data using synchronous and asynchronous functions.
     *
     * @name transformer
     * @function
     * @param {Object} data The data object.
     * @param {Object} opts The options object:
     *
     *  - `autostart` (Boolean): If `true`, the functions will be executed,
     *    without calling the `start()` method.
     *
     * @return {Number} Return description.
     */
    constructor (data, opts) {

        super();

        this._originalData = data;

        this._cUnordered = [];
        this._lastFn = {};

        this._asyncerTasks = [
            this._parallel = []
          , this._ordered = []
        ];


        opts = ul.merge(opts, {
            autostart: true
        });

        this.autostart = opts.autostart;
        process.nextTick(() => {
            debugger
            this.autostart && this.start()
        });
    }

    _wrapFn (fn) {
        return cb => {
            fnResult(fn, [this._originalData], cb);
        };
    }

    /**
     * add
     * Adds a new function.
     *
     * There are three levels where the functions are added to be executed:
     *
     * Parallel:               | <0: [.............................................]>
     * Unordered (don't wait): |                                <4a: [........]>
     *                         +                                <4b: [....]>
     *                         +                                <4c: [......]>
     * Ordered (wait):         | <1: [...]> <2: [.]> <3:[.....]>                <5: [....]>
     *
     * @name add
     * @function
     * @param {Function|Transformer} fn The function to add. Note you can add
     * an existing transformer instance as well.
     * @param {TransformerType} type One of the following:
     *
     *    - `Transformer.PARALLEL`: Used to append on the parallel timeline.
     *    - `Transformer.UNORDERED`: Grouped, but unordered.
     *    - `Transformer.ORDERED`: Grouped, but ordered.
     *
     */
    add (fn, type) {

        if (typpy(fn, Array)) {
            fn.forEach(c => this.add(c, type));
            return this;
        }


        type = deffy(type, Transformer.ORDERED);
        if (typpy(fn, Transformer)) {
            let tr = fn;
            tr.autostart = false;
            fn = (data, cb) => {
                debugger
                tr.start(data, cb);
            };
        }

        fn = this._wrapFn(fn);

        switch (type) {
            case Transformer.PARALLEL:
                this._parallel.push(fn);
                break;
            case Transformer.UNORDERED:
                if (this._lastFn.type !== Transformer.UNORDERED) {
                    this._cUnordered = [];
                    this._ordered.push({
                        parallel: this._cUnordered
                    });
                }
                this._cUnordered.push(fn);
                break;
            case Transformer.ORDERED:
                this._ordered.push(fn);
                break;
        }

        this._lastFn = {
            fn: fn
          , type: type
        };

        this._ordered.push();
    }

    /**
     * start
     * Starts the function execution.
     *
     * @name start
     * @function
     * @param {Object} data The data object.
     * @param {Function} fn The callback function.
     */
    start (data, fn) {

        if (fn) {
            this._originalData = data;
        } else {
            fn = data;
        }

        fn = fn || noop;
        asyncer(this._asyncerTasks, err => {
            this.emit("end", err, this._originalData);
            fn(err, this._originalData);
        });
    }
}

Transformer.PARALLEL = 1;
Transformer.UNORDERED = 2;
Transformer.ORDERED = 3;

module.exports = Transformer;
