var nunjucks = require("nunjucks");

function BoolWidgetBlock()
{

}

BoolWidgetBlock.prototype = {

    in_bool: function (value) {
        this.out_bool_callback.call(this, value);
    },

    out_bool: function (callback) {
        this.out_bool_callback = callback;
    },

    out_ui: function () {
        var env = nunjucks.configure(__dirname);
        return nunjucks.render("static/partials/ui.html");
    }
};

module.exports = BoolWidgetBlock;