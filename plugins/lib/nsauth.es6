// Plugin responsible for authenticating owners against NickServ.
// Plugins that perform administrative functions may use this to 
// validate bot owners. A nick must be in the owners array in the
// config file and be identified (STATUS == 3) to be recognized.
// Note: this is not a "classic" plugin, in that it is meant to be
// included and used by way of its exports.authorize method.

// TODO: I'd like to cache the response, but it would be
// risky without somehow watching for the user to disconnect
// and resetting the authorization, or some such. Too much
// trouble for the moment.

import _ from 'lodash';

export default function (bot) {
    return Promise.method(function authorize(msg) {
        const nick = _.isString(msg) ? msg : msg.nick;
  
        if (!bot.config.owners || !bot.config.owners.length) {
            throw new Error('No owners set in config file.');
        }

        if (!~_.indexOf(bot.config.owners, nick)) {
            throw new Error(`But you are not my master, ${nick}!`);
        }

        return new Promise((resolve, reject) => {
            bot.on('notice', (from, to, text) => {
                if (from === 'NickServ' && new RegExp(`^STATUS ${nick}`).test(text)) {
                    if (!new RegExp(`^STATUS ${nick} 3`).test(text)) {
                        return reject(new Error('Try identifying to NickServ, dickhead.'));
                    }
       
                    resolve();
                }
            });

            bot.say('NickServ', `STATUS ${nick}`);
        });
    });
};
