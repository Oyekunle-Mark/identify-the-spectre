let http = require('http');
let express = require('express');
let path = require('path');
let bodyParser = require('body-parser');
let logger = require('morgan');

//create an express app
let app = express();

//tell express the views folder and view engine
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

//set up a folder to serve static files such as bootstrap.min.css
let publicFolder = path.resolve(__dirname, 'public');
app.use(express.static(publicFolder));

//create global array and make it available in all views
let entries = [];
app.locals.entries = entries;

//use the morgan middleware
app.use(logger('dev'));

//populates a variable called req.body if the user is submitting a form
app.use(bodyParser.urlencoded({ extended: false }));

//when clients visits homepage
app.get('/', function(req, res) {
	res.render('index');
});

//for new entries
app.get('/new-entry', function(req, res) {
	res.render('new-entry');
});

//when user submits a form
app.post('/new-entry', function(req, res) {
	if (!req.body.title || !req.body.body) {
		res.status(400).send('Entries must have a title and a body.');
	return;
	}
	entries.push({
		title: req.body.title,
		content: req.body.body,
		published: new Date()
	});
	//redirect to the homepage so user views the new entry
	res.redirect('/');
});

//the middleware to respond if client enters wrong url
app.use(function(req, res) {
	res.status(404).render('404');
});

//start the server
http.createServer(app).listen(3000, function() {
	console.log('Guestbook app running on port 3000.');
});
