const Sequelize = require('sequelize');

const sequelize = new Sequelize('sqlite://./database.sqlite');

const CurrencyShop = sequelize.import('./commands/database/currency_shop');
const Users = sequelize.import('./commands/database/users');
sequelize.import('./commands/database/user_inv');

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
	const shop = [
		CurrencyShop.upsert({ name: 'bof\'s-big-boogie', cost: 1 }),
		CurrencyShop.upsert({ name: 'bof\'s-big-boogie', cost: 2 }),
		CurrencyShop.upsert({ name: 'bof\'s-little-toenail', cost: 5 }),
		CurrencyShop.upsert({ name: 'bof\'s-big-toenail', cost: 10 }),
		CurrencyShop.upsert({ name: 'bof\'s-massive-toenail', cost: 20 }),
		CurrencyShop.upsert({ name: 'bof\'s-stock-share', cost: 50 }),
		CurrencyShop.upsert({ name: 'potato', cost: 15}),
		CurrencyShop.upsert({ name: 'big-potato', cost: 40}),
		CurrencyShop.upsert({ name: 'gucci-potato', cost: 75}),
		CurrencyShop.upsert({ name: 'potato-boi-youtooz', cost: 100}),
		CurrencyShop.upsert({ name: 'p-bof-youtooz', cost: 150})
	];
	await Promise.all(shop);
	console.log('Database synced');
	sequelize.close();
}).catch(console.error);