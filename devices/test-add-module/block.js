
// A simple test external module that simply
// accepts an input and spits it incremented by one
function TestAddModule(id)
{
    this.id = id;
}

TestAddModule.prototype = {

    in_int: function(value){
        this.out_int_callback.call(this, ++value);
    },

    out_int: function (callback) {
        this.out_int_callback = callback;
    }
};

module.exports = TestAddModule;