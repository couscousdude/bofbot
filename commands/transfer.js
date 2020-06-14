const Discord = require('discord.js');

// setup the currency database
const { Users, CurrencyShop } = require('./dbObjects');
const { Op } = require('sequelize');
const currency = new Discord.Collection();

// create some useful functions for later
Reflect.defineProperty(currency, 'add', {
	value: async function add(id, amount) {
		const user = currency.get(id);
		if (user) {
			user.balance += Number(amount);
			return user.save();
		}
		const newUser = await Users.create({ user_id: id, balance: amount });
		currency.set(id, newUser);
		return newUser;
	},
});

Reflect.defineProperty(currency, 'getBalance', {
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

async function initCurrency(users, curr) {
    const storedBalances = await Users.findAll();
    storedBalances.forEach(b => currency.set(b.user_id, b));
}

initCurrency(Users, currency);

module.exports = {
	name: 'transfer',
    description: 'Send people money',
    dmUseAllowed: false,
    usage: '<user> <amount>',
    cooldown: 5,
    aliases: ['donate', 'gift'],
	execute(message, args) {
        const currentAmount = currency.getBalance(message.author.id);
        const transferAmount = args.find(arg => !/<@!?\d+>/g.test(arg));
        const transferTarget = message.mentions.users.first();

        if (!transferAmount || isNaN(transferAmount)) return message.channel.send(`Sorry ${message.author}, that's an invalid amount.`);
        if (transferAmount > currentAmount) return message.channel.send(`Sorry ${message.author}, you only have ${currentAmount}.`);
        if (transferAmount <= 0) return message.channel.send(`Please enter an amount greater than zero, ${message.author}.`);

        currency.add(message.author.id, -transferAmount);
        currency.add(transferTarget.id, transferAmount);

        return message.channel.send(
            `Successfully transferred ${transferAmount}💰 Bof Bock(s) to ${transferTarget.tag}. Your current balance is ${currency.getBalance(message.author.id)}💰`);
    },  
};