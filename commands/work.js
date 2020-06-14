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
	name: 'work',
    description: 'Work for cash',
    dmUseAllowed: false,
    cooldown: 1800,
	execute(message) {
		async function workForCash(message) {
			await initCurrency(Users, currency);

			const target = message.author;
			currency.add(target.id, 20);
			message.channel.send('Congratulations on working! You\'ve earned 20 Bof Bocks. Come back in 30 minutes to work again!');
		}
		
		workForCash(message);
	}
};