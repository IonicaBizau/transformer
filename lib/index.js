"use strict";

const EventEmitter = require("events").EventEmitter
    , ul = require("ul")
    , deffy = require("deffy")
    , noop = require("noop6")
    , asyncer = require("asyncer")
    , fnResult = require("fn-result")
    ;

/**
 * transformer
 * Transform the data using synchronous and asynchronous functions.
 *
 * @name transformer
 * @function
 * @param {Number} a Param descrpition.
 * @param {Number} b Param descrpition.
 * @return {Number} Return description.
 */
class Transformer extends EventEmitter {

    constructor (data, opts) {

        super();

        this._originalData = data;

        this._cUnordered = [];
        this._lastFn = {};

        // [
        //     [fn1, fn2, fn3, fn4]
        //   , [
        //
        //     ]
        // ]
        this._asyncerTasks = [
            this._parallel = []
          , this._ordered = []
        ];


        opts = ul.merge(opts, {
            autostart: true
        });

        opts.autostart && process.nextTick(() => this.start());
    }

    _wrapFn (fn) {
        return cb => {
            fnResult(fn, [this._originalData], cb);
        };
    }

    add (fn, type) {
        type = deffy(type, Transformer.ORDERED);

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

    start (fn) {
        debugger
        fn = fn || noop;

        asyncer(this._asyncerTasks, err => {
            debugger
            this._originalData;
        });
    }
}

Transformer.PARALLEL = 1;
Transformer.UNORDERED = 2;
Transformer.ORDERED = 3;

module.exports = Transformer;
