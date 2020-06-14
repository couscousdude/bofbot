// setup our discord client
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./commands/config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// setup our command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

// setup our cooldowns
const cooldowns = new Discord.Collection();

// once the client is ready to execute commands, start some processes
client.once('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
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
function msToHMS( ms ) {
    // 1- Convert to seconds:
    var seconds = ms / 1000;
    // 2- Extract hours:
    var hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    var minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;
    return( hours+":"+minutes+":"+seconds.toFixed());
}

const now = Date.now();
const timestamps = cooldowns.get(command.name);
const cooldownAmount = (command.cooldown || 3) * 1000;

if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	if (now < expirationTime) {
		const timeLeft = msToHMS(expirationTime - now);
        return message.reply(`gimme a break aight? Wait \`${timeLeft}\` before reusing the \`${command.name}\` command.`);
    }
}

timestamps.set(message.author.id, now);
setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

// catch errors when executing commands
try {
    command.execute(message, args);
} catch (error) {
    console.error(error);
	message.reply(`uh oh! you made bof bot real mad!`);
	message.channel.send(`As you attempt to make an offering to the almighty Bof Bot, he slips you a note: 
	${error}`, { code: true });
}
});

client.login(token);