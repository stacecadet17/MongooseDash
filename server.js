var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, './static')));


app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/dash_db');

var DashSchema = new mongoose.Schema({
  name: String,
  color: String,
  age: Number,
});

var wolves = mongoose.model('Wolves', DashSchema);

///////////All of the Routes
app.get('/', function(req, res) {
  wolves.find({}, function(err, wolves) { //find all instances of wolves thatg exist
    if(err) { console.log(err);}
    res.render('index.ejs', {wolves: wolves}); //display all the wolves by passing the object to the res
  })
});

//create
app.post('/wolves', function(req, res) { //action route to post info for creating a wolf
  wolves.create(req.body, function(err, wolves) { //db query to create a new wolf
    if(err) {console.log(err); }
    res.redirect('/'); //go to to the index which now has saved and displayed the new wolf
  });
});;


//New
app.get('/wolves/new', function(req, res) { //get the html page to add a new wolf
  res.render('new.ejs');
})

//Show
app.get('/wolves/:id', function(req, res) { //route for the specific if of a wolf
  wolves.findOne({ _id: req.params.id}, function(err, wolves){ //find JUST THE ONE from the array
    if (err) { console.log(err); }
    res.render('show.ejs', {wolves: wolves}); //pass the response the object of wolves
  });
});

//Update
app.post('/wolves/:id', function(req, res) { //action route to post new information to update a specific wolf
  console.log(req.body);
  wolves.update({ _id: req.params.id}, req.body,  function(err, wolves) {
    if (err) { console.log(err); }
    res.redirect('/')
  })
})

app.get('/wolves/:id/edit', function(req, res) {
  wolves.findOne({ _id: req.params.id}, function(err, wolves) { //edit the specific ONE param passed to the req
    if (err) { console.log(err); }
    res.render('edit.ejs', {wolves: wolves}); //pass the wolves object to the edit html
  });
})

//Delete
app.post('/wolves/:id/destroy', function(req, res) {
  wolves.remove({ _id: req.params.id}, function(err, wolves) { //removing the specific param passed in the req
    if (err) { console.log(err); }
    res.redirect('/') //now go back to index to reveal the deleted wolf
  })
})

app.listen(8000, function(){
  console.log("running on port 8000, mongoosedash");
})
