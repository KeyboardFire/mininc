$(function() {
    $('#intro').show();
    $.mininc(function(g) {
        g.set('clicks', 0);
        $('#startgame').click(function() {
            $('#intro').hide('slow');
            $('#game').show('slow');
        });
        $('#click').click(function() {
            g.set('clicks', g.get('clicks') + 1);
            g.update('#clickcount');
        });
        g.hook('clicks', function(c) { return c >= 10; }, function() {
            $('#click10').show('slow');
        });
    });
});
