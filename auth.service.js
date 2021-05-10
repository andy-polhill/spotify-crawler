const axios = require("axios");
const querystring = require("querystring");

exports.getToken = async(id, secret) => {

  const encodedToken = Buffer
    .from(`${id}:${secret}`)
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
