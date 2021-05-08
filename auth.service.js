const axios = require("axios");
const querystring = require("querystring");

exports.getToken = async() => {

  const encodedToken = Buffer
    .from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)
    .toString("base64");

  const { data } = await axios.post("https://accounts.spotify.com/api/token", 
    querystring.stringify({ grant_type: "client_credentials" }), { 
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${encodedToken}`
      }
    });

  return data.access_token;
};
