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
	name: 'inventory',
    description: 'Check your inventory',
    dmUseAllowed: false,
    usage: '<user>',
    cooldown: 10,
    aliases: ['inv', 'backpack'],
	execute(message) {
        async function getInventory(message) {
            await initCurrency(Users, currency);
            
            const target = message.mentions.users.first() || message.author;
            const user = await Users.findOne({ where: { user_id: target.id } });
            const items = await user.getItems();

            if (!items.length) return message.channel.send(`${target.tag} has nothing!`);
            return message.channel.send(`${target.tag} currently has ${items.map(i => `${i.amount} ${i.item.name}`).join(', ')}`);
        }

        getInventory(message);
    },  
};