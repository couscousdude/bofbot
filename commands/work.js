module.exports = {
	name: 'work',
    description: 'Work for cash',
    dmUseAllowed: false,
    cooldown: 3600,
	execute(message) {
            message.channel.send(`You've just worked! Of course, you're just a slave in the fields, so it's not like you get anything.`);
	},
};