const express = require("express");
//require basicAuth
const basicAuth = require('express-basic-auth');
//require bcrypt
const bcrypt = require('bcrypt');
// set salt
const saltRounds = 2;

const {User, Item} = require('./models');
const { use } = require("bcrypt/promises");

// initialise Express
const app = express();

// specify out request bodies are json
app.use(express.json());

// routes go here
app.get('/', (req, res) => {
  res.send('<h1>App Running</h1>')
})

app.get('/items', async(req, res) => {
  let items = await Item.findAll();
  res.json({items});
})

app.post('/items', async(req,res) =>{
  let newItem = await Item.create(req.body);
  res.json({newItem})
})

app.get('/users', async(req, res) => {
  let users = await User.findAll();
  res.json({users});
})

app.post('/users', async(req,res) =>{

  bcrypt.hash(req.body.password,saltRounds, async function(err,hash){
    let newUser = await User.create({'name':req.body.name, 'password':hash});
    console.log(hash)
    res.json({newUser})
  })

})

app.post('/session', async(req,res) =>{
  const thisUser = await User.findOne({
    where: {name:req.body.name}
  })
  if(!thisUser){
    res.send('User not found')
  } else {
    bcrypt.compare(req.body.password, thisUser.password, async function (err, result){
      if(result){
        res.json(thisUser)
      } else {
        res.send("Passwords do not match")
      }
    })
  }
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});