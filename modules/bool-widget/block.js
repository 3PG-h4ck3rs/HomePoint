var nunjucks = require("nunjucks");

function BoolWidgetBlock()
{

}

BoolWidgetBlock.prototype = {
    out_bool: function (callback) {
        this.out_bool_callback = callback;
    },

    out_ui: function () {
        var env = nunjucks.configure(__dirname);
        return nunjucks.render("static/partials/ui.html");
    }
};

module.exports = BoolWidgetBlock;