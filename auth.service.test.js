const axios = require("axios");
const { getToken } = require("./auth.service");

jest.mock("axios");

const accessToken = "AAABBBCCC";

describe("auth.service", () => {

  test("calls the authentication endpoint", async() => {
    axios.post.mockResolvedValue({ data: { access_token: accessToken } });
    await getToken();
    expect(axios.post.calledOnce);
  });

  test("passes an encoded token in the auth header", async() => {
    axios.post.mockResolvedValue({ data: { access_token: accessToken } });
    await getToken();
    expect(axios.post.calledOnce);
    expect(axios.post.mock.calls[0][2].headers['Authorization']).toEqual(`Basic ${Buffer
      .from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)
      .toString("base64")}`)
  });

  test("it returns the access token", async() => {
    axios.post.mockResolvedValue({ data: { access_token: accessToken } });
    const token = await getToken();
    expect(token).toBe(accessToken);
  });
});

