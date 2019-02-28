const API_AI_TOKEN = "595e0807a549431c9a0f3bba6f5726a5";
const apiAiClient = require("apiai")(API_AI_TOKEN);
const FACEBOOK_ACCESS_TOKEN = "EAAMVT32OZBEgBAIGg7iqDHVuih3BfUaObyjAeqz99YQKihMV5xdXE97m6ZC25bXs2kBFaREu0gyZBZCV73uLzfQR3u7UijxDYVVXdBfpFMDKwWD2xTOZBMfqh4UTLjQRa1hfATdeVfI1GAECqlvM6s8OClmw58V4ZCZAveBzZB1pfuVfZA9WQbOrs";
const request = require("request");


const sendTextMessage = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: FACEBOOK_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: senderId
            },
            message: {
                text
            },
        }
    });
};
module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;
    const apiaiSession = apiAiClient.textRequest(message, {
        sessionId: "crowdbotics_bot"
    });
    apiaiSession.on("response", (response) => {
        const result = response.result.fulfillment.speech;
        sendTextMessage(senderId, result);
    });
    apiaiSession.on("error", error => console.log(error));
    apiaiSession.end();
};