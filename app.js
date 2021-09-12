// CONST values:
const exp = require("constants");
const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const process = require("process");
const dotenv = require("dotenv"); // To get .env variables loaded into code

dotenv.config();

// APP.USE
const app = express();
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));


app.get("/", function(req, res) {
	res.sendFile(__dirname + "/signup.html");	
});

//mailchimp setup:
mailchimp.setConfig({
	apiKey: process.env.API,
	server: process.env.SERVER //These values are unique and can not be shared
});

app.post("/", function(req, res){
// Entering ListID:
	const list_ID = process.env.LISTID;
	// Creating an object with the users data
	const subscrubingUser = {
		firstName: req.body.fname,
		lastName: req.body.lname,
		email: req.body.email
	};
// Uploading the data to the server:
	async function run() {
		const response = await mailchimp.lists.addListMember(list_ID, {
			email_address: subscrubingUser.email,
			status: "pending", // or "subscribed" for direct subscription without email verification
			merge_fields: {
				FNAME: subscrubingUser.firstName,
				LNAME: subscrubingUser.lastName
			}
			
		});
	}
		run().catch(e => res.sendFile(__dirname + "/failure.html"));
// If all goes OK => logging the contact's ID:
		res.sendFile(__dirname + "/success.html");
});

app.listen(process.env.PORT || 3000, function(){
	console.log("Server is running on port 3000.");
});