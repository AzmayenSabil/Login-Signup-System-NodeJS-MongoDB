var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");

//var User = require("./models/user");

const mongoose = require('mongoose');

//mongoose.set('useNewUrlParser', true);
//mongoose.set('useFindAndModify', false);
//mongoose.set('useCreateIndex', true);
//mongoose.set('useUnifiedTopology', true);

mongoose.connect('mongodb://localhost:27017/gfg-login-signup');

var db = mongoose.connection;

db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
	console.log("connection succeeded");
})

var app = express()

//app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));


//---login

app.post('/log_in', async(req,res) => {
	try{

		const studentID = req.body.studentID;
		const password = req.body.password;

		// console.log(`${studentID} and password is ${password}`)

		const user = await db.collection('details').findOne({studentID: studentID});
		// res.send(user);
		// console.log(user);

		if(user.password == password){
			res.status(201).redirect('login_success.html');
		}
		else{
			res.send("passwords are not matching");
		}

		
	}catch(error){
		res.status(400).send("invalid input")
	}
})

//---//


//--sign up 
app.post('/sign_up', function(req,res){
	var name = req.body.name;
	var email =req.body.email;
	var pass = req.body.password;
	var studentID =req.body.studentID;

	var data = {
		"name": name,
		"email":email,
		"password":pass,
		"studentID":studentID
	}
    
    db.collection('details').insertOne(data,function(err, collection){
		if (err) throw err;
		console.log("Record inserted Successfully");
			
	});
		
	return res.redirect('signup_success.html');
})

//---------//


app.get('/',function(req,res){

    res.set({
	    'Access-control-Allow-Origin': '*'
	});

    return res.redirect('index.html');

}).listen(3000)


console.log("server listening at port 3000");


// http://127.0.0.1:3000/