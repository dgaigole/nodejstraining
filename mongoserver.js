var express = require ('express');
var bp = require ('body-parser');
var _ = require('underscore');

var MongoClient = require ('mongodb').MongoClient

var app = express ();
var db;

app.use(express.static('public'));
app.use(bp.json());

var mytasks = []
var taskid = 0;

MongoClient.connect ('mongodb://admin:admin@ds111188.mlab.com:11188/dipdb', (err, database) => {
	if (err)
		return console.log (err);

	db=database;
});

app.get ('/getmytasks', function (req, res) {
		res.json(mytasks);
});


app.get ('/getmytasks/:id', function (req, res) {
	var todoID=parseInt(req.params.id, 10);

	var matchedTodo = _.findWhere(mytasks, {id:todoID});
	if (matchedTodo)
		res.json(matchedTodo);
	else
		res.status (404).send();

//	res.json (mytasks);
});

app.post ('/postmytasks', function (req, res) {
//	var data=req.body;
//	data.id=taskid++;
//	mytasks.push(data);
//	res.json (mytasks);
	db.collection('userdb').save(req.body, function (err, result) {
		if (err)
			return console.log (err);

		console.log('saved to database');
		res.send('saved to database');
	});
});

app.delete ('/deletetask', function (req, res) {
	db.collection('userdb').findOneAndDelete({description: req.body.description}, function (err, results) {
		if (err)
			return console.log (err);

		console.log('record deleted');
		res.send(results);
		});
});

app.put ('/updatetask', function (req, res) {
	db.collection('userdb').findOneAndUpdate(
			{description: req.body.description}, 
			{ $set: {
					description: req.body.description,
					completed: req.body.completed
					}
			},
			{
				sort: {_id:-1},
				upsert: true
			},
			function (err, results) {
				if (err)
					return console.log (err);
				console.log('record updated');
				res.send('record updated');
			}
		);
});


app.delete ('/deletetask/:id', function (req, res) {
	var todoID=parseInt(req.params.id, 10);

	var matchedTodo = _.findWhere(mytasks, {id:todoID});
	if (matchedTodo) {
		mytasks = _.without(mytasks, matchedTodo);
		res.json(matchedTodo);
	}
	else
		res.status (404).json({"error": "id not found"});

//	res.json (mytasks);
});

app.listen(3000, function () {
	console.log ('app is running on port 3000');
});

