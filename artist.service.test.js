import axios from "axios";
import { getArtist } from "./artist.service";
import relatedArtist from "./__fixtures__/related-artist.json";

jest.mock("axios");

const testId = "123456789";

describe("artist.service", () => {
  test("calls the api with the correct id", async() => {
    axios.get.mockResolvedValue({ data: relatedArtist });
    await getArtist(testId);
    expect(axios.get.calledOnce);
    expect(axios.get.mock.calls[0][0]).toContain(testId);
  });

  test("returns the required properties", async() => {
    axios.get.mockResolvedValue({ data: relatedArtist });
    const artists = await getArtist(testId);
  
    expect(artists).toEqual([{
      name: "artist 1",
      id: "1",
      popularity: 80
    }, {
      name: "artist 2",
      id: "2",
      popularity: 80
    }]);
  });

  test("throws an error when the api call fails", async() => {
    axios.get.mockRejectedValue(new Error());
    await expect(getArtist(testId)).rejects.toThrow();
  });

  test("does not throws an error when the api call succeeds", async() => {
    axios.get.mockResolvedValue({ data: relatedArtist });
    await expect(getArtist(testId)).resolves.not.toThrow();
  });
});

