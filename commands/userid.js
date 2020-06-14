module.exports = {
	name: 'userid',
    description: 'Get user id',
    usage: '<user>',
    dmUseAllowed: false,
    cooldown: 2,
    aliases: ['id', 'uid'],
	execute(message) {
        if (!message.mentions.users.size) {
            message.channel.send(message.author.id);
        } else {
            message.channel.send(message.mentions.users.first().id);
        }
	},
};