const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;
const mongo = require('mongodb').MongoClient;

mongo.connect('mongodb://ec2-54-208-228-204.compute-1.amazonaws.com:27017/draw', (error, db) => {
	if (error) throw error;
	console.log('Connected to DB');
	app.use(express.static(__dirname + '/public'));

	function onConnection(socket) {
		console.log('client connected');
		db.collection('paint').find().sort({timestamp:1}).toArray((error, result) => {
			socket.emit('init', result);
			if (error) console.error(error);
		});

		socket.on('paint', (data) => {
			data.timestamp = new Date();
			db.collection('paint').save(data, (error, result) => {
				if (error) console.log(error);
			});
			socket.broadcast.emit('paint', data);
		});
		socket.on('erase', (data) => {
			
			db.collection('paint').drop( (error, result) => {
				if (error) console.log(error);
			});
			socket.broadcast.emit('erase', data);
		});
	}

	io.on('connection', onConnection);

	http.listen(port, () => console.log('running on port ' + port));
});
