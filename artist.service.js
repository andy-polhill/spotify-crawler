import axios from "axios";

export const getArtist = async(artistId) => {

  console.log(artistId);

  try {
    const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/related-artists`);

    return response.data.artists
      .map(({ name, id, popularity }) => ({ name, id, popularity }));

    } catch (error) {

    console.log(error);
    throw error;
  }
}
