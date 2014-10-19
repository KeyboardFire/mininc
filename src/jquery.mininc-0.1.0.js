(function($) {
    $.mininc = function(callback) {
        var mininc = {
            vars: {},
            hooks: {},
            set: function(varname, val) {
                mininc.vars[varname] = val;
                if (mininc.hooks[varname]) {
                    for (var i = 0; i < mininc.hooks[varname].length; ++i) {
                        if (mininc.hooks[varname][i].condition(val)) {
                            mininc.hooks[varname][i].callback(val);
                        }
                    }
                }
            },
            get: function(varname) {
                return mininc.vars[varname];
            },
            hook: function(varname, condition, callback) {
                if (!mininc.hooks[varname]) mininc.hooks[varname] = [];
                mininc.hooks[varname].push({
                    condition: condition,
                    callback: callback
                });
            },
            update: function() {
                var toUpdate = $();
                for (var i = 0; i < arguments.length; ++i) {
                    toUpdate = toUpdate.add($(arguments[i]).find('*[data-mininc]'));
                }
                toUpdate.each(function() {
                    var x = $(this), d = x.attr('data-mininc');
                    // so much evil packed into one line
                    x.text(eval('with(mininc.vars){' + d + '}'));
                });
            }
        };
        callback(mininc);
    };
})(jQuery);
