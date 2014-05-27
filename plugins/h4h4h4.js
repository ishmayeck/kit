module.exports = function (app) {
    app.msg('PRIVMSG', function(req, res) {
        if (/h4/.test(req.text)) {
            var count = req.text.match(/h4/g).length, h8 = "";

            for (var i = 0; i < count; i++) {
                h8 += "h8";
            }

            res.say(h8);
        }
    });
};
