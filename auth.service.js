import axios from 'axios';
import querystring from 'querystring';

export default async function() {

  const encodedToken = Buffer
    .from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)
    .toString('base64')

  try {

    //TODO: use fetch?
    const { data } = await axios.post('https://accounts.spotify.com/api/token', 
      querystring.stringify({ grant_type: 'client_credentials' })
    , { 
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${encodedToken}`
      }
    });

    return data.access_token;
  } catch(e) {
    console.log(e);
    throw e;
  }

}
