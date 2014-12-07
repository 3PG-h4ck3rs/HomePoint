var fs = require("fs");

module.exports = function (file_) {
    with (global) {
        eval(fs.readFileSync(file_) + '');
    };
};
