import axios from "axios";

export async function getArtist(artistId) {
  return (await axios.get(`https://api.spotify.com/v1/artists/${artistId}/related-artists`))
    .data.artists
    .map(({ name, id, popularity }) => ({ name, id, popularity }));
}
