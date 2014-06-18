var baseStr = "\n%col1%########%col2%#%col1%##%col2%#%col1%#\n%col1%########%col2%#%col1%##%col2%#%col1%#\n%col1%#########%col2%##%col1%##\n%col1%########%col2%###%col1%##\n%col1%#########%col2%##%col1%##\n%col1%##%col2%#########%col1%##\n%col1%#%col2%##########%col1%##\n%col1%#%col2%##########%col1%##\n%col1%#%col2%#%col1%#%col2%#%col1%####%col2%#%col1%#%col2%#%col1%##\n%col1%#%col2%#%col1%#%col2%#%col1%####%col2%#%col1%#%col2%#%col1%##\n%col1%#%col2%#%col1%#%col2%#%col1%####%col2%#%col1%#%col2%#%col1%##";

module.exports = function (bot) {
    bot.on("cmd_deer", function (nick, to, text) {
        var col = getColours();

        bot.say(to, baseStr.replace(/%col1%/g, col[0] + "," + col[0]).replace(/%col2%/g, col[1] + "," + col[1]));
    });

    bot.on("cmd_deergalaxy", function (nick, to, text) {
        var str = baseStr.split('\n').map(function (str) {
            var col = getColours();

            return str.replace(/%col1%/g, col[0] + "," + col[0]).replace(/%col2%/g, col[1] + "," + col[1]);
        }).join('\n');

        bot.say(to, str);
    });
};

function getColours () {
    var col1 = -1;
    var col2 = -1;
    var MAX_COLOUR = 15;

    if (col1 < 0 || col1 > MAX_COLOUR || isNaN(col1))
    {
        col1 = Math.floor(Math.random()*MAX_COLOUR);
    }

    if (col2 < 0 || col2 > MAX_COLOUR || isNaN(col2))
    {
        col2 = col1;
        while (col2 === col1)
        {
            col2 = Math.floor(Math.random()*MAX_COLOUR);
        }
    }

    return [col1, col2];
}