const {MongoClient} = require('mongodb');
const sendResponse = require('../src/general/sendResponse');
// const connectionUrl = "mongodb://127.0.0.1:27017"
const connectionUrl = process.env.DATABASE_URI;
const dbName = "database-for-cbner";
MongoClient.connect(connectionUrl, {useNewUrlParser: true, useUnifiedTopology: true}, async (err, client) => {
	if (err) {
		return console.log('Failed to connect to database');
	}
	console.log("Connect successfully");
	const users = await client.db(dbName).collection('users-data').find({}).toArray();
	let userIndex = 0;
	const response = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "button",
				"text": "Helluuuuu, lâu rồi chúng mình không gặp lại nhau nhỉ... \nThi quốc gia xong rồi đóoooo, vào chat ẩn danh quẩy thôi nàoooooooooo 🥳🥳🥳",
				"buttons": [
					{
						"type": "postback",
						"title": "Chat ẩn danh",
						"payload": "chatRoom"
					}
				]
			}
		}
	};

	// console.log(users);
	let sendPromises = [];
	users.forEach(user => {
		sendPromises.push(sendResponse(user.sender_psid, response));
	});

	// sendPromises.push(sendResponse(3785286158180365, response));
	Promise.all(sendPromises).then(() => {
		console.log("DONE!");
	}).catch(err => {
		console.log(err);
	});
});
