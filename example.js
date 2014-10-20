$(function() {
    var KEY = '__example_mininc_game_data';
    $('#intro').show();
    $.mininc(function(g) {
        // util functions
        var u = {
            write: function(lines) {
                g.set('lines', g.get('lines') + lines);
                g.set('totallines', g.get('totallines') + lines);
                g.update('#linecount, #hire');
            },
            hire: function(n) {
                var cost = g.get('hirebtn'+n+'cost');
                g.set('lines', g.get('lines') - cost);
                g.set('hirecnt'+n, g.get('hirecnt'+n) + 1);
                g.set('hirebtn'+n+'cost', Math.floor(cost * 1.1));
                g.update('#linecount, #hire');
            }
        }

        // event handlers
        $('#startgame').click(function() {
            g.set('startgameclicked', true);
        });
        $('#writecode').click(function() {
            u.write(1);
        });
        for (var i = 1; i <= 3; ++i) {
            (function(i) {
                $('#hirebtn' + i).click(function() {
                    u.hire(i);
                });
            })(i);
        }
        $('#reset').click(function(e) {
            e.preventDefault();
            if (confirm('Really reset your game and start from scratch?')) {
                g.reset(KEY);
                window.location.reload(true);
            }
        });

        // game hooks
        g.hook('startgameclicked', g.hook.truthy, function() {
            $('#intro').hide('slow');
            $('#game').show('slow');
        });
        g.hook('totallines', g.hook.gte(10), function() {
            $('#programmertitle').text('You are a beginner programmer.').show('slow');
        });
        g.hook('totallines', g.hook.gte(30), function() {
            $('#programmertitle').text('You are beginning to learn how to code.');
        });
        g.hook('totallines', g.hook.gte(50), function() {
            $('#programmertitle').text('You understand the basics of programming.');
            $('#hire').show('slow');
        });
        g.hook('totallines', g.hook.gte(100), function() {
            $('#programmertitle').text('Your company is just starting out.');
        });

        // save / restore
        g.restore(g.autosave = KEY);

        // initialize default variables
        g.setDefault('lines', 0);
        g.setDefault('totallines', 0);
        g.setDefault('hirecnt1', 0);
        g.setDefault('hirerate1', 0.125);
        g.setDefault('hirebtn1cost', 50);
        g.setDefault('hirecnt2', 0);
        g.setDefault('hirerate2', 1);
        g.setDefault('hirebtn2cost', 350);
        g.setDefault('hirecnt3', 0);
        g.setDefault('hirerate3', 5);
        g.setDefault('hirebtn3cost', 1500);

        // intialize timers
        g.addTimer('persecond', 1000, function() {
            for (var i = 1; i <= 3; ++i) u.write(g.get('hirecnt'+i) * g.get('hirerate'+i));
        });

        // set everything up
        g.update('*[data-mininc]');
    });
});
