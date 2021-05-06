import got from "got";

 export const getArtist = async(artistId, token) => {
  try {
    const response = await got(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
      responseType: 'json',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    return response.body.artists
      .filter(({ popularity }) => popularity > 50)
      .map(({ name, id }) => ({ name, id }));

    } catch (error) {

    console.log(error);
    throw error;
  }
}
