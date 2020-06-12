module.exports = {
	name: 'ping',
    description: 'Ping!',
    dmUseAllowed: false,
    cooldown: 5,
    aliases: 'pang',
	execute(message) {
		message.channel.send('Pong!');
	},
};