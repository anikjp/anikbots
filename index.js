const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const verificationController = require("./controllers/verification");
const messageWebhookController = require("./controllers/messageWebhook");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.listen(3000, () => console.log("Webhook server is listening, port 3000"));

app.get("/", verificationController);

app.post("/", messageWebhookController.dialogflowFirebaseFulfillment);

// respond with "hello world" when a GET request is made to the homepage
app.get('/test', function (req, res) {
  res.send('hello world');
});