if (typeof $ !== 'undefined' && query)
{
    $.prototype.enable = function () {
        $.each(this, function (index, el) {
            $(el).removeAttr('disabled');
        });
    }

    $.prototype.disable = function () {
        $.each(this, function (index, el) {
            $(el).attr('disabled', 'disabled');
        });
    }    
}

String.prototype.strip = function(chars){
    if (!chars)
    {
        return this.trim();
    }
    else
    {
        var regexp = new RegExp("^["+ chars +"]+|["+ chars +"]+$")
        return this.replace(regexp, "")
    }
}
