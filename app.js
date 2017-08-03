const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser');
const expressValidator = require('express-validator')
const expressSession = require('express-session')

var users = require('./users.js');

app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(expressValidator())
app.use(expressSession({secret: "12345689"}))
app.use(express.static(path.join(__dirname, 'public')))
//check if loggedin, if true, send to root, if not send to log in page
function isLoggedIn(req, res, next) {
  if (req.session.isLoggedIn) {
    return next();
  }
  else {
    res.redirect('/login');
  }
}

//render index page
app.get("/", isLoggedIn, function(req, res, next){
  //let name = req.session.loginData.name;
  if (!req.session.views) {
      req.session.views = 0
  }
  req.session.views += 1
  res.render("index", req.session)
//if I add .views to see how many views I have, I can no longer render user name in index
})

//render login page
app.get('/login', function(req,res,next){
  res.render('login')

})
//check to see if name matches login
app.post('/login/add', function(req, res, next){
  resultVar = users.findIndex(function (item){
    if(req.body.name == item.name){
      return true;
    }
  })
  console.log(resultVar)

  //if name matches, check password and if that matches, send to root
  if(resultVar > -1){ // user check
    if(req.body.password == users[resultVar].password){
      req.session.isLoggedIn = true
      req.session.name = users[resultVar].name
      console.log(users[resultVar].name)
      res.redirect("/")
    } else {
      res.redirect("/login")
    }
    //res.send("bad password")-this works
  } else {
  //  res.send("bad user name")-this works
    res.redirect('/login')
  }
})
//this doesn't work
// app.use(function(req,res,next){
//   if(req.session.views){
//     req.session.views += 1
//   }else{req.session.views = 1
//   }


app.listen(3000, function(){
  console.log("App running on port 3000")
})
