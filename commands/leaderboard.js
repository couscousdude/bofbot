// const Discord = require('discord.js');
// const client = new Discord.Client;

// // setup the currency database
// const { Users, CurrencyShop } = require('./dbObjects');
// const { Op } = require('sequelize');
// const currency = new Discord.Collection();

// // create some useful functions for later
// Reflect.defineProperty(currency, 'add', {
// 	value: async function add(id, amount) {
// 		const user = currency.get(id);
// 		if (user) {
// 			user.balance += Number(amount);
// 			return user.save();
// 		}
// 		const newUser = await Users.create({ user_id: id, balance: amount });
// 		currency.set(id, newUser);
// 		return newUser;
// 	},
// });

// Reflect.defineProperty(currency, 'getBalance', {
// 	value: function getBalance(id) {
// 		const user = currency.get(id);
// 		return user ? user.balance : 0;
// 	},
// });

// async function initCurrency(users, curr) {
//     const storedBalances = await Users.findAll();
//     storedBalances.forEach(b => currency.set(b.user_id, b));
// }

// module.exports = {
// 	name: 'leaderboard',
//     description: 'Check top rich ranking in the server',
//     dmUseAllowed: false,
//     cooldown: 5,
//     aliases: ['rank', 'rich'],
// 	execute(message) {
//         console.log(currency)
//         async function showLeaderboard(message) {
//             await initCurrency(Users, currency);
//             message.channel.send(
//                 currency.sort((a, b) => b.balance - a.balance)
//                     .filter(user => client.users.cache.has(user.user_id))
//                     .first(10)
//                     .map((user, position) => `(${position + 1}) ${(client.users.cache.get(user.user_id).tag)}: ${user.balance}💰 Bof Bock(s)`)
//                     .join('\n'),
//                 { code: true }
//             );
//         }
//         showLeaderboard(message);
//     },  
// };