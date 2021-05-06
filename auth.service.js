import axios from 'axios';
import querystring from 'querystring';

export default async function() {

  //TODO get from process
  // const id = '65a2a72c15c94b1fa3c0da2cfd1ffea5';
  // const secret = '096a277cfaf4464a93a6c34275d252a5';

  const encodedToken = Buffer
    .from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)
    .toString('base64')

  try {
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
