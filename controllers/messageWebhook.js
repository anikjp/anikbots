// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const functions = require('firebase-functions');
const {
    WebhookClient
} = require('dialogflow-fulfillment');

var admin = require("firebase-admin");

var serviceAccount = require("../config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://anik-bot.firebaseio.com"
});

const {
    Card,
    Suggestion,
    Image,
    Payload
} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    // if (response.intent) {
    //     console.log(`  intent matched.`);
    // } else {
    //     response.json({ 'fulfillmentText': "No intent matched" });
    //     console.log(`  No intent matched.`);
    // }
    const agent = new WebhookClient({
        request,
        response,
    });

    function welcome(agent) {
        agent.add("welcome welcome welcome");
        agent.add(new Suggestion('Suggestion1'));
        agent.add(new Suggestion('Suggestion2'));
        agent.add(new Suggestion('Suggestion3'));
        agent.add(new Suggestion('Suggestion4'));
    }

    function fallback(agent) {
        agent.add("I didn't understand");
        agent.add("I'm sorry, can you try again?");
    }


    function createBooking(agent) {
        let guests = agent.parameters.guests;
        let time = new Date(agent.parameters.time);
        let date = new Date(agent.parameters.date);
        console.log('createBooking guests : ' + JSON.stringify(guests));
        console.log('createBooking time: ' + JSON.stringify(time));
        console.log('createBooking date: ' + JSON.stringify(date));
        let bookingDate = new Date(date);
        bookingDate.setHours(time.getHours());
        bookingDate.setMinutes(time.getMinutes());
        console.log('bookingDate date1: ' + bookingDate);
        let now = new Date();

        if (guests < 1) {
            agent.add('This message is from Dialogflow\'s Cloud Functions for Firebase editor!');
        } else if (bookingDate < now) {
            agent.add("You can't make a reservation in the past. Please try again!");
        } else if (bookingDate.getFullYear() > now.getFullYear()) {
            agent.add("You can't make a reservation for ${bookingDate.getFullYear()} yet. Please choose a date in ${now.getFullYear()}.");
        } else {
            console.log('bookingDate date2: ' + bookingDate);
            agent.add(new Image({
                imageUrl: 'https://developers.google.com/actions/assistant.png',
            }));
            let timezone = parseInt(agent.parameters.time.toString().slice(19, 22));
            bookingDate.setHours(bookingDate.getHours() + timezone);
            console.log('bookingDate date3: ' + bookingDate);
            agent.add(`You have successfully booked a table for ${guests} guests on ${bookingDate.toString().slice(0,21)}`);
            agent.add(new Card({
                title: 'Title: this is a card title',
                imageUrl: 'https://developers.google.com/actions/assistant.png',
                text: 'This is the body text of a card.  You can even use line\n  breaks and emoji! 💁',
                buttonText: 'This is a button',
                buttonUrl: 'https://assistant.google.com/'
            }));
            agent.add(new Suggestion('Suggestion'));
        }
    }

    //   // Uncomment and edit to make your own intent handler
    //   // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
    //   // below to get this function to be run when a Dialogflow intent is matched
    //   function yourFunctionHandler(agent) {
    //      agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
    //      agent.add(new Card({
    //          title: `Title: this is a card title`,
    //          imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
    //          text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
    //          buttonText: 'This is a button',
    //          buttonUrl: 'https://assistant.google.com/'
    //       })
    //      );
    //      agent.add(new Suggestion(`Quick Reply`));
    //      agent.add(new Suggestion(`Suggestion`));
    //      agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
    //   }

    //   // Uncomment and edit to make your own Google Assistant intent handler
    //   // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
    //   // below to get this function to be run when a Dialogflow intent is matched
    //   function googleAssistantHandler(agent) {
    //      let conv = agent.conv(); // Get Actions on Google library conv instance
    //      conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
    //      agent.add(conv); // Add Actions on Google library responses to your agent's response
    //   }
    // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
    // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('restaurant.booking.create', createBooking);
    //   intentMap.set('your intent name here', yourFunctionHandler);
    //   intentMap.set('your intent name here', googleAssistantHandler);
    agent.handleRequest(intentMap);
});