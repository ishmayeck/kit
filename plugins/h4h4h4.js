module.exports = function (bot) {
	bot.on("message", function (nick, to, text) {
		if (/h4/.test(text)) {
			var count = text.match(/h4/).length, h8 = "";

			for (var i = 0; i < count; i++) {
				h8 += "h8";
			}

			bot.say(to, h8);
		}
	});
};
