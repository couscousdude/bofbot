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
	name: 'buy',
    description: 'Buy items from the Bof Bot Shop',
    dmUseAllowed: false,
    usage: '<item>',
    cooldown: 5,
    aliases: ['purchase'],
	execute(message, args) {
        async function buyItem(message, args) {
            await initCurrency(Users, currency);
            const item = await CurrencyShop.findOne({ where: { name: { [Op.like]: args } } });
            if (!item) return message.channel.send(`That item doesn't exist.`);
            if (item.cost > currency.getBalance(message.author.id)) {
                return message.channel.send(`You currently have ${currency.getBalance(message.author.id)}, but the ${item.name} costs ${item.cost}!`);
            }

            const user = await Users.findOne({ where: { user_id: message.author.id } });
            currency.add(message.author.id, -item.cost);
            await user.addItem(item);

            message.channel.send(`You've bought: ${item.name}.`);
        }

        buyItem(message, args);
    },  
};