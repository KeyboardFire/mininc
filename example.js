$(function() {
    $('#intro').show();
    $.mininc(function(g) {
        // event handlers
        $('#startgame').click(function() {
            g.set('startgameclicked', true);
        });
        $('#click').click(function() {
            g.set('clicks', g.get('clicks') + 1);
            g.update('#clickcount');
        });

        // game hooks
        g.hook('startgameclicked', function(c) { return c }, function() {
            $('#intro').hide('slow');
            $('#game').show('slow');
        });
        g.hook('clicks', function(c) { return c >= 10; }, function() {
            $('#click10').show('slow');
        });

        // save / restore
        g.restore(g.autosave = '__example_mininc_game_data');

        // initialize default variables
        g.setDefault('clicks', 0);

        // set everything up
        g.update('*');
    });
});
