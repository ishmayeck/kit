var DDate = require('ddate');

module.exports = function(app) {
    app.cmd('ddate', function(req, res) {
        res.say('Today is ' + new DDate().toOldImmediateDateFormat());
    });
};
