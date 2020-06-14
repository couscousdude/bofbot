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

module.exports = {
	name: 'balance',
    description: 'Check balance of users',
    dmUseAllowed: false,
    usage: '<user>',
    cooldown: 10,
    aliases: ['bal', 'money', 'wallet'],
	execute(message) {
		initCurrency(Users, currency);
		function findBalance(message) {
			const target = message.mentions.users.first() || message.author;
			return message.channel.send(
				`${target.tag} has ${currency.getBalance(target.id)}💰 Bof Bock(s) \n(Note: couscousdude doesn't know how to code so this can take up to 10 seconds to update).`);
		}

		findBalance(message);
	},
};