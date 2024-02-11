const querystring = require("querystring");
const express = require('express');
const router = express.Router();
function getGoogleAuthURL() {
    const rootURL = "https://accounts.google.com/o/oauth2/v2/auth";
    const options= {
        redirect_uri: 'http://lcoalhost:5000/auth/google/callback',
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: 'consent',
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
        ].join(" ")
    };

    return `${rootURL}?${querystring.stringify(options)}`;
}
router.get("/getURL", (req,res,next) => {
    res.send(getGoogleAuthURL());
});

module.exports = router;