module.exports = {
	name: 'ping',
    description: 'Test your latency with the bot(basically meaningless)',
    dmUseAllowed: false,
    cooldown: 5,
    aliases: 'pang',
	execute(message) {
        const ping = message.createdTimestamp - Date.now();
        message.channel.send(`ping: \`${ping}\` ms (this is basically meaningless)`)
	},
};