var nunjucks = require("nunjucks");

function BaseModule()
{
    this.config = {};
}

BaseModule.prototype = {
    getUI: function () {
        if (this.config.template)
        {
            // this sets the path for the templates to the current folder
            var env = nunjucks.configure(__dirname);
            console.log(__dirname);
            return nunjucks.render(this.config.template);
        }
        else
        {
            return null;
        }
    }
}

module.exports = BaseModule;