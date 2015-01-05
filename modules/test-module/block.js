var nunjucks = require("nunjucks");

// A simple test external module that simply
// accepts an input and spits it incremented by one
function TestAddModule(options)
{
    this.options = options;
}

TestAddModule.prototype = {

    in_int: function(value){
        this.out_int_callback.call(this, ++value);
    },

    out_int: function (callback) {
        this.out_int_callback = callback;
    },

    out_ui: function (){
        var env = nunjucks.configure(__dirname);
        return nunjucks.render("templates/test.html");
    },

    out_string: function () {
        return this.options.testString;
    }
};

module.exports = TestAddModule;