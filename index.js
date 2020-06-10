const Discord = require('discord.js');
const client = new Discord.Client();
// config.json contains general info like token and prefix
const config = require('./config.json');

// RegExp for detecting variants of hello
const helloRegex = /\s*h\s*e+\s*l+\s*[o|0]+\s*/i;

// say hello function
// 1 in 100 chance to actually be nice
function sayHello() {
    const randomNumber = () => Math.floor(Math.random() * 100) === 0;
    console.log(randomNumber);
    if (randomNumber) {
        return 'whats up';
    };
    return 'go away';
};

client.on('message', message => {
    // P bof message sender
	if (message.content === 'p') {
        message.channel.send('bof');
    };
    // stink stonk message sender
    if (message.content === 'stink') {
        message.channel.send('stonk');
    };
    // bof bot has no manners
    if (helloRegex.test(message.content)) {
        message.channel.send(sayHello());
    };
    console.log(message.content);
});

// login the bot
client.login(config.token);