import fs from 'fs';
import path from 'path';
import domain from 'domain';
import _ from 'lodash';

Promise.promisifyAll(fs);

export default class Bot extends irc.Client {

    // connection logic only pls
    constructor(config) {
        super(config.server, config.nick, config.ircopts);

        this.lstcache = []
        this.config = config;

        console.log(`- Starting bot for ${this.config.server}`);
    }

    // All initialization after the thing is connected goes here.
    // This needs to be safe to run on "reload" command
    initialize() {
        this.on('error', _.bind(this.handleError, this));
        this.on('message', _.bind(this.parseMessage, this));
        
        return this.initPlugins();
    }

    initPlugins() {
        console.log(' - Loading plugins...');
        return fs.readdirAsync(`${__dirname}/plugins`)
            .map((file) => {
                return fs.lstatAsync(`${__dirname}/plugins/${file}`).then((stats) => {
                    return { file, stats };
                });
            })
            .filter(({ file, stats }) => !stats.isDirectory())
            .each(({ file, stats }) => {
                const name = path.basename(file, path.extname(file));
                const blacklist = this.config.blacklist;

                if (blacklist && ~_.indexOf(blacklist, name)) return;

                console.log(`  - ${name}`);
                require(`${__dirname}/plugins/${name}`)(this);
            });
    }

    parseMessage(nick, to, text, message) {
        const cmdprefix = this.config.cmdprefix;
        const cmds = _.isArray(cmdprefix) ? cmdprefix : [cmdprefix];

        _.forEach(cmds, (cmd) => {
            const r = new RegExp(`^${cmd}(\\w+)`);
            const m = text.match(r);

            if (m) {
                const dom = domain.create();

                dom.on('error', _.bind(this.handleError, this));
                dom.run(() => {
                    this.emit(`cmd_${m[1]}`, nick, to, text.match(/\w+\ ?(.*$)/)[1], message);
                });
            }
        });
    }

    handleError() {
        console.log('Fatal Error: \n', arguments);
    }

    // We need to keep tabs on what listeners the plugins are using, so that we
    // can clear them when we're reloading plugins.
    on(a, b, c, d) {
        super.on(a, b, c, d);
        this.lstcache.push(arguments[0]);
    }

    reload() {
        console.log('- Reloading...');

        this.emit('reload');

        // purge Node require cache so that we re-read all the plugins
        _.forEach(require.cache, (val, key) => {
            delete require.cache[key];
        });

        // we now know that these are plugin/bot listeners, and can be removed
        _.forEach(this.lstcache, (ev) => {
            this.removeAllListeners(ev);
        });

        this.lstcache = []
        this.initialize()
    }
}