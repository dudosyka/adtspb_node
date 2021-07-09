let fs = require("fs");
let Db = require("./Db.js");
let dir = process.argv[2];

let db = new Db();

if (typeof dir == 'undefined')
{
	console.error('Command syntax is "node migrate.js <migrate_name>"');
	process.exit();
}

let path = "../config/migrations/" + dir;

fs.readdirSync(path).map(async el => {
	let query = fs.readFileSync(path+"/"+el).toString();
	await db.query(query, []);
});

console.log('All success! Press <ctlr + c> to exit');
