(function($) {
    $.mininc = function(callback) {
        var mininc = {
            vars: {},
            set: function(varname, val) {
                mininc.vars[varname] = val;
            },
            get: function(varname) {
                return mininc.vars[varname];
            },
            update: function() {
                var toUpdate = $();
                for (var i = 0; i < arguments.length; ++i) {
                    toUpdate = toUpdate.add($(arguments[i]).find('*[data-mininc]'));
                }
                toUpdate.each(function() {
                    var x = $(this), d = x.attr('data-mininc');
                    x.text(mininc.get(d));
                });
            }
        };
        callback(mininc);
    };
})(jQuery);
