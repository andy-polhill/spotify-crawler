import axios from "axios";
import { stringify } from "querystring";

export async function getToken(id, secret) {

  const encodedToken = Buffer
    .from(`${id}:${secret}`)
    .toString("base64");

  const { data } = await axios.post("https://accounts.spotify.com/api/token", 
    stringify({ grant_type: "client_credentials" }), { 
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${encodedToken}`
      }
    });

  return data.access_token;
}
