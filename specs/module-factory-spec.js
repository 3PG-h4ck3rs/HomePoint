var moduleFactory = require("../module-builder");

describe("module factory", function () {
    it("should chain external modules", function (done) {
        var moduleInfo = {
            modules: {
                m1: {
                    module: "test-add-module"
                },
                m2: {
                    module: "test-add-module"
                }
            },
            relations:[
                {
                    out: {
                        module: "m1",
                        method: "out_int"
                    },

                    in:{
                        module: "m2",
                        method: "in_int"
                    }
                }
            ],
            in_int: "m1",
            out_int: "m2"
        };

        var module = moduleFactory(moduleInfo, "base");

        module.out_int(function (value) {
            expect(value).toBe(3);
            done();
        });

        module.in_int(1);
    });
});