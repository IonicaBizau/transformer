"use strict";

const tester = require("tester")
    , Transformer = require("..")
    ;

tester.describe("transformer", test => {
    test.should("transform data using synchronous and asynchronous functions.", cb => {
        let t = new Transformer({ world: "Earth" });

        t.add((data, cb) => {
            setTimeout(() => {
                data.parallel = 42;
                cb();
            }, 20);
        }, Transformer.PARALLEL);

        // Async function, but ordered
        t.add((data, cb) => {
            setTimeout(() => {
                data.oldWorld = data.world;
                data.world = "Mars";
                cb();
            }, 10);
        });

        // Another async function and ordered
        t.add((data, cb) => {
            setTimeout(() => {
                data.baz = 7;
                cb();
            }, 5);
        });

        // Async function, but not ordered
        t.add((data, cb) => {
            setTimeout(() => {
                data.foo = 42;
                cb();
            }, 10);
        }, Transformer.UNORDERED);

        // Another unordered function (this will end sooner)
        t.add((data, cb) => {
            setTimeout(() => {
                data.bar = 42;
                cb(null, data);
            }, 9);
        }, Transformer.UNORDERED);

        // Sync function
        t.add(data => {
            data.planet = data.world;
        });

        // Finally show the data
        t.on("end", (err, data) => {
            test.expect(data).toEqual({
                world: "Mars"
              , parallel: 42
              , oldWorld: "Earth"
              , baz: 7
              , bar: 42
              , foo: 42
              , planet: "Mars"
            });
            cb();
        });
    });

    test.it("concat transformers", cb => {
        let t = new Transformer({ world: "Earth" });
        let t1 = new Transformer();
        let t2 = new Transformer();
        let t3 = new Transformer();
        let t4 = new Transformer();

        t.add((data, cb) => {
            test.expect(data.world, "Earth");
            setTimeout(() => {
                data.parallel = 42;
                cb();
            }, 20);
        }, Transformer.PARALLEL);

        // Async function, but ordered
        t.add(t1);
        t.add([t2, t3, t4]);

        // Another async function and ordered
        t1.add((data, cb) => {
            debugger
            setTimeout(() => {
                data.baz = 7;
                cb();
            }, 5);
        });

        // Async function, but not ordered
        t2.add((data, cb) => {
            setTimeout(() => {
                data.foo = 42;
                cb();
            }, 10);
        }, Transformer.UNORDERED);

        // Another unordered function (this will end sooner)
        t3.add((data, cb) => {
            setTimeout(() => {
                data.bar = 42;
                cb(null, data);
            }, 9);
        }, Transformer.UNORDERED);

        // Sync function
        t2.add(data => {
            data.planet = data.world;
        });

        // Finally show the data
        t.on("end", (err, data) => {
            test.expect(data).toEqual({
                world: "Earth"
              , parallel: 42
              , baz: 7
              , bar: 42
              , foo: 42
              , planet: "Earth"
            });
            cb();
        });
    });
});
