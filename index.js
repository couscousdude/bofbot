// setup our discord client
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// setup our command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// setup our cooldowns
const cooldowns = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    
    client.commands.set(command.name, command);
}

// once the client is ready to execute commands, log 'Ready' to console
client.once('ready', () => {
	console.log('Ready!');
});

// command handler
client.on('message', message => {
    // if the message doesn't start with the bot prefix OR if the message was sent by a bot, return early
	if (!message.content.startsWith(prefix) || message.author.bot) return;

    // extracts the command out of the message user sends
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

    // search the command list for the command specified; if not found, search for aliases
    const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // if not a valid command, return
	if (!command) return;

    if (command.args && !args.length) { // handle missing arguments
    	let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
    }        

if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
}

// handle command cooldowns
const now = Date.now();
const timestamps = cooldowns.get(command.name);
const cooldownAmount = (command.cooldown || 3) * 1000;

if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	if (now < expirationTime) {
		const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`woah man, you tryna break me or somethin? Wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
    }
}

timestamps.set(message.author.id, now);
setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

// catch errors when executing commands
try {
    command.execute(message, args);
} catch (error) {
    console.error(error);
    message.reply('whoop. apparently something fricked up, ping coscusdud about this imediately :^)');
}
});

client.login(token);