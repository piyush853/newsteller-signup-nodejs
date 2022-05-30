const express = require('express');
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const listID = "ea80362c0d";

mailchimp.setConfig({
  apiKey: "ec36b81efa641239f049c302624d4cfc-us17",
  server: "us17",
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res){
  res.sendFile(__dirname+"/signup.html");
});

app.post('/', function(req,res){
  var fName = req.body.fName;
  var lName = req.body.sName;
  var email = req.body.txtemail;

  async function run() {
    const response = await mailchimp.lists.addListMember(listID,{
      email_address: email,
      status:"subscribed",
      merge_fields:{
        FNAME: fName,
        LNAME: lName}

      }).then(responses => {
          console.log(responses);
          if(responses.id !== "") {
              res.sendFile(__dirname+"/success.html");
          }

        }).catch(err => {
              res.sendFile(__dirname+"/failure.html");
              console.log('Error')
        });



  }

  run();

});
app.post("/failure",function(req,res){
  res.redirect("/")
})
app.listen(process.env.PORT,function(){

});
