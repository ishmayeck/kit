var baseStr = "\n%col1%########%col2%#%col1%##%col2%#%col1%#\n%col1%########%col2%#%col1%##%col2%#%col1%#\n%col1%#########%col2%##%col1%##\n%col1%########%col2%###%col1%##\n%col1%#########%col2%##%col1%##\n%col1%##%col2%#########%col1%##\n%col1%#%col2%##########%col1%##\n%col1%#%col2%##########%col1%##\n%col1%#%col2%#%col1%#%col2%#%col1%####%col2%#%col1%#%col2%#%col1%##\n%col1%#%col2%#%col1%#%col2%#%col1%####%col2%#%col1%#%col2%#%col1%##\n%col1%#%col2%#%col1%#%col2%#%col1%####%col2%#%col1%#%col2%#%col1%##";

module.exports = function (bot) {
    bot.on("cmd_deer", function (nick, to, text) {
        var col1 = -1;
        var col2 = -1;
        var MAX_COLOUR = 15;

        if (text.split(' ').length === 2)
        {
            col1 = Number(text.split(' ')[0]);
            col2 = Number(text.split(' ')[1]);
        }

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
            
        bot.say(to, baseStr.replace(/%col1%/g, col1 + "," + col1).replace(/%col2%/g, col2 + "," + col2));
    });
};
