(function($) {
    $.mininc = function(callback) {
        // best function name obviously
        var startTimerThingy = function() {
            var oldTime = new Date();
            var timerThingy = function() {
                // calculate delta
                var currentTime = new Date(),
                    deltaTime = currentTime - oldTime;
                oldTime = currentTime;

                for (var i = 0; i < mininc.timers.length; ++i) {
                    var t = mininc.timers[i];
                    if (t.paused) continue;
                    t.cumulDelta += deltaTime;
                    var guard = 100;
                    while (t.cumulDelta >= t.delay && --guard) {
                        t.cumulDelta -= t.delay;
                        t.callback();
                    }
                }

                // requestAnimationFrame polyfill-ish thing
                (window.requestAnimationFrame ||
                 window.webkitRequestAnimationFrame ||
                 window.mozRequestAnimationFrame ||
                 window.msRequestAnimationFrame ||
                 window.oRequestAnimationFrame ||
                 (function(f){setTimeout(f,10)}))(timerThingy);
            }
            timerThingy();

            // self-destruct (we only want to do this once)
            startTimerThingy = function(){};
        }
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
            update: function(toUpdate) {
                $(toUpdate).find('[data-mininc]').addBack('[data-mininc]').each(function() {
                    var x = $(this), d = x.attr('data-mininc');
                    if (d.charAt(0) === '#') {
                        var attr = d.match(/#([^ ]+)/)[1];
                        d = d.replace(/[^ ]+ /, '');
                        // so much evil packed into one line
                        x.attr(attr, eval('with(mininc.vars){' + d + '}'));
                    } else {
                        x.text(eval('with(mininc.vars){' + d + '}'));
                    }
                });
            },
            timers: [],
            addTimer: function(name, delay, callback) {
                mininc.timers.push({
                    name: name,
                    delay: delay,
                    callback: callback,
                    paused: false,
                    cumulDelta: 0
                });
                startTimerThingy();
            },
            pauseTimer: function(name) {
                for (var i = 0; i < mininc.timers.length; ++i) {
                    if (mininc.timers[i].name === name) {
                        mininc.timers[i].paused = true;
                    }
                }
            },
            removeTimer: function(name) {
                for (var i = 0; i < mininc.timers.length; ++i) {
                    if (mininc.timers[i].name === name) {
                        mininc.timers.splice(i--, 1);
                        continue;
                    }
                }
            },
            save: function(key) {
                localStorage.setItem(key, mininc.exportJSON());
            },
            restore: function(key) {
                mininc.importJSON(localStorage.getItem(key));
            },
            reset: function(key) {
                localStorage.removeItem(key);
            },
            exportJSON: function() {
                return JSON.stringify(mininc.vars);
            },
            importJSON: function(json) {
                mininc.vars = JSON.parse(json || '{}');
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
            autosave: false
        };
        mininc.hook.truthy = function(x) { return x; };
        mininc.hook.falsy = function(x) { return !x; };
        mininc.hook.gt = function(n) { return function(x) { return x > n; }; };
        mininc.hook.gte = function(n) { return function(x) { return x >= n; }; };
        mininc.hook.lt = function(n) { return function(x) { return x < n; }; };
        mininc.hook.lte = function(n) { return function(x) { return x <= n; }; };
        mininc.hook.eq = function(y) { return function(x) { return x == y; }; };
        mininc.hook.neq = function(y) { return function(x) { return x != y; }; };
        callback(mininc);
    };
})(jQuery);
