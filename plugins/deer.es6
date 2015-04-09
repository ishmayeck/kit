import _ from 'lodash';

const MAX_COLOUR = 15;

const deer = '\
########@##@#\n \
########@##@#\n \
#########@@##\n \
########@@@##\n \
#########@@##\n \
##@@@@@@@@@##\n \
#@@@@@@@@@@##\n \
#@@@@@@@@@@##\n \
#@#@####@#@##\n \
#@#@####@#@##\n \
#@#@####@#@##';

const col = '\u0003';

function getColours(exclude = []) {
    const c1 = getColour();
    const c2 = getColour([c1]);

    return [c1, c2];
}

function getColour(exclude = []) {
    let c = Math.floor(Math.random()*MAX_COLOUR);

    while (~_.indexOf(exclude, c))
    {
        c = Math.floor(Math.random()*MAX_COLOUR);
    }

    return c;
}

function getDeer(x = '#') {
    const [c1, c2] = getColours();

    return _.map(deer.split('\n'), (line) => {
        return _.map(line, (chr) => {
            if (chr === '#') {
                return `${col}${c1},${c1}${x}${col}`;
            }
            else if (chr === '@') {
                return `${col}${c2},${c2}${x}${col}`;
            }

            return chr;
        }).join('');
    }).join('\n');
}

function getDeerGalaxy(x = '#') {
    return _.map(deer.split('\n'), (line) => {
        const [c1, c2] = getColours();

        return _.map(line, (chr) => {
            if (chr === '#') {
                return `${col}${c1},${c1}${x}${col}`;
            }
            else if (chr === '@') {
                return `${col}${c2},${c2}${x}${col}`;
            }

            return chr;
        }).join('');
    }).join('\n');
}

function getDeerUniverse(x = '#') {
    const dc = getColour();

    return _.map(deer.split('\n'), (line) => {
        return _.map(line, (chr) => {
            if (chr === '#') {
                const c = getColour([dc]);

                return `${col}${c},${c}${x}${col}`;
            }
            else if (chr === '@') {
                return `${col}${dc},${dc}${x}${col}`;
            }

            return chr;
        }).join('');
    }).join('\n');
}

function getDeerInverse(x = '#') {
    const dc = getColour();

    return _.map(deer.split('\n'), (line) => {
        return _.map(line, (chr) => {
            if (chr === '@') {
                const c = getColour([dc]);

                return `${col}${c},${c}${x}${col}`;
            }
            else if (chr === '#') {
                return `${col}${dc},${dc}${x}${col}`;
            }

            return chr;
        }).join('');
    }).join('\n');
}

export default function (bot) {
    bot.on('cmd_deer', (nick, to, text) => {
        bot.say(to, getDeer());
    });

    bot.on('cmd_deergalaxy', (nick, to, text) => {
        bot.say(to, getDeerGalaxy());
    });

    bot.on('cmd_deeruniverse', (nick, to, text) => {
        bot.say(to, getDeerUniverse());
    });

    bot.on('cmd_deerinverse', (nick, to, text) => {
        bot.say(to, getDeerInverse());
    });

    bot.on('cmd_fatdeer', (nick, to, text) => {
        const x = _.repeat('#', _.parseInt(text, 10)) || '##';

        bot.say(to, getDeer(x));
    });

    bot.on('cmd_fatdeergalaxy', (nick, to, text) => {
        const x = _.repeat('#', _.parseInt(text, 10)) || '##';

        bot.say(to, getDeerGalaxy(x));
    });

    bot.on('cmd_fatdeeruniverse', (nick, to, text) => {
        const x = _.repeat('#', _.parseInt(text, 10)) || '##';

        bot.say(to, getDeerUniverse(x));
    });

    bot.on('cmd_fatdeerinverse', (nick, to, text) => {
        const x = _.repeat('#', _.parseInt(text, 10)) || '##';

        bot.say(to, getDeerInverse(x));
    });
};
