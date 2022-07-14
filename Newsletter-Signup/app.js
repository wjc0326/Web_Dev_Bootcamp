const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  // Step 1: prepare the data to send to the mailchimp server
  // the data is fetched from the website request sent to the server
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const data = {
    // members is an array of objects
    members: [{
      email_address: email,
      status: "subscribed",
      // merge_fields is a dictionary of merge fields where the keys are the merge tags.
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  const jsonData = JSON.stringify(data);

  // Step 2: send request to the mailchimp server
  const url = "https://us11.api.mailchimp.com/3.0/lists/0fbd78eef5";
  // options is an object
  const options = {
    // auth is a string in the format of "anything:API key"
    auth: "anita:484ce7099b6dbd834e915d3c305e4a1f-us11",
    method: "POST"
  };
  const request = https.request(url, options, function(response){
    // Check whether the user signed up successfully and show the responding website
    // 200 means success
    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});

// API key
// 484ce7099b6dbd834e915d3c305e4a1f-us11

// ListID
// 0fbd78eef5
