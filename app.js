// jshint esversion: 6

const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const { Http2ServerRequest } = require("http2");
const { url } = require("inspector");
const https = require("https");

const app = express();

app.use(express.static("public")); // for the css: public is the folder where we have the static css and image.
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
})


app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    var jsonData = JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/fcbd692335";

    const options = {
        method: "POST",
        auth: "shai:f6af2fb27a863f439e615fa05abc6ddc-us8"
    }

    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }


        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res) {
    res.redirect("/");
})





app.listen(process.env.PORT || 3000, function() {
    console.log("server's running on port 3000")
})

// f6af2fb27a863f439e615fa05abc6ddc-us8
// fcbd692335