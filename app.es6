import fs from 'fs';
import _ from 'lodash';
import Bot from './bot';
import globalConfig from './config';

Promise.promisifyAll(fs);

irc.colors.codes.bold = '\u0002';
irc.colors.codes.underline = '\u001f';

fs.readdirAsync('./servers').map((file) => {
        return new Promise((resolve, reject) => {
            const serverConfig = require(`./servers/${file}`);
            const config = _.merge({}, globalConfig, serverConfig);

            if (config.enabled) {
                new Bot(config).initialize().then(resolve);
            }
            else {
                console.log(`- Server ${config.server} is disabled, skipping`);
                resolve();
            }        
        });
    })
    .then(() => console.log('- All done'));
