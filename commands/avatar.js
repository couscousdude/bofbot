module.exports = {
	name: 'avatar',
    description: 'Return PFP of specified user',
    dmUseAllowed: false,
    usage: '<user>',
    cooldown: 10,
    aliases: ['profile', 'pfp'],
	execute(message) {
        if (!message.mentions.users.size) {
            message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: "png", dynamic: true })}>`);
        };

        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: <${user.displayAvatarURL({ format: "png", dynamic: true })}>`;
        });
        message.channel.send(avatarList);
	},
};