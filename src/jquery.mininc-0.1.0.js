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
                        } else {
                            mininc.hooks[varname][i].elsecallback(val);
                        }
                    }
                }
                if (mininc.autosave) mininc.save(mininc.autosave);
            },
            setDefault: function(varname, val) {
                if (typeof mininc.get(varname) === 'undefined') {
                    mininc.set(varname, val);
                }
            },
            get: function(varname) {
                return mininc.vars[varname];
            },
            hook: function(varname, condition, callback, elsecallback) {
                if (!mininc.hooks[varname]) mininc.hooks[varname] = [];
                mininc.hooks[varname].push({
                    condition: condition,
                    callback: callback,
                    elsecallback: elsecallback || function(){}
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
            },
            save: function(key) {
                localStorage.setItem(key, JSON.stringify(mininc.vars));
            },
            restore: function(key) {
                mininc.vars = JSON.parse(localStorage.getItem(key)) || {};
                for (var varname in mininc.hooks) {
                    var val = mininc.get(varname);
                    for (var i = 0; i < mininc.hooks[varname].length; ++i) {
                        if (mininc.hooks[varname][i].condition(val)) {
                            mininc.hooks[varname][i].callback(val);
                        } else {
                            mininc.hooks[varname][i].elsecallback(val);
                        }
                    }
                }
            },
            reset: function(key) {
                localStorage.removeItem(key);
            },
            autosave: false
        };
        callback(mininc);
    };
})(jQuery);
