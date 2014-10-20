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
            }
        }

        // event handlers
        $('#startgame').click(function() {
            g.set('startgameclicked', true);
        });
        $('#writecode').click(function() {
            u.write(1);
        });
        $('#hirebtn1').click(function() {
            var cost = g.get('hirebtn1cost');
            g.set('lines', g.get('lines') - cost);
            g.set('hirecnt1', g.get('hirecnt1') + 1);
            g.set('hirebtn1cost', Math.floor(cost * 1.1));
            g.update('#linecount, #hire');
        });
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
            $('#hire, #hire1').show('slow');
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

        // intialize timers
        g.addTimer('persecond', 1000, function() {
            u.write(g.get('hirecnt1') * g.get('hirerate1'));
        });

        // set everything up
        g.update('*[data-mininc]');
    });
});
