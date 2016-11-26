var express = require ('express');
var bp = require ('body-parser');
var _ = require('underscore');
var app = express ();

app.use(express.static('public'));
app.use(bp.json());

var mytasks = []
var taskid = 0;

app.get ('/getmytasks', function (req, res) {
		res.json(mytasks);

//	res.json (mytasks);
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
	var data=req.body;
	data.id=taskid++;
	mytasks.push(data);
	res.json (mytasks);
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

