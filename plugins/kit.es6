import _ from 'lodash';

const says_things = [
    "I'll gwizzle your gwonk if you're not careful maaaaate",
    "The map screen of the iPhone is what.",
    "The map screen of the iPhone is amusing somehow.",
    "I never burn, I am a shining light!",
    "These why humanity invent the clothes.",
    "And holy shit does this song reflect the thoughts of how you feel.",
    "The body shudders to recall it still.",
    "This game looks fun, if you like bad things.",
    "There's a lot of stupid things in everything.",
    "The foolish name of you is trivial.",
    "If the life is regrettable, not having approached me any longer.",
    "You can consider this as the best news on my life !! seriously !!",
    "Best fuck up cunt or I hook ya in the gabber",
    "веселенькая группа, под неё я много народу напугал."
];

const gratefuls = [
    "I-it's not like I did it for you! baka!!",
    "(　｀ー´)八(｀ー´　) ＨＩ５",
    "Yes I am.",
    "yaw, don't mention it bro",
    "it's what I do. ┐(￣ー￣)┌",
    "n-np..."
];

function random_item(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export default function (bot) {
    bot.on('cmd_kit', (nick, to, text) => {
        bot.say(to, 'yes I am.');
    });

    bot.on('message', (nick, to, text) => {
        if (!/kit/i.test(text) || Math.random()*4 < 3) return;

        bot.say(to, random_item(says_things));
    });

    bot.on('cmd_thanks', (nick, to, text) => {
        bot.say(to, random_item(gratefuls));
    });

    bot.on('cmd_choose', (nick, to, text, message) => {
        let arr = [];

        if (~text.indexOf(',')) {
            arr = text.split(',');
        }
        else if (/\?$/.test(text)) {
            // simple question, delegate to 8ball.
            // Undefined behavior if 8ball plugin isn't loaded.
            return bot.emit('cmd_8ball', nick, to, text, message);
        }
        else if (/(\d+)\ ?\-\ ?(\d+)/.test(text)) {
            const [zero, one, two] = _.map(text.match(/(\d+)\ ?\-\ ?(\d+)/), _.ary(_.parseInt, 1));
            const min = Math.min(one, two);
            const max = Math.max(one, two) + 1;
            const rand = Math.floor(Math.random() * (max - min) + min);

            return bot.say(to, `${nick}: ${rand}`);
        }
        else {
            arr = text.split(' ');
        }

        bot.say(to, `${nick}: ${random_item(arr)}`);
    });
};
