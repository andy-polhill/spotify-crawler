import axios from "axios";
import { getToken } from "./auth.service";

jest.mock("axios");

const accessToken = "AAABBBCCC";
const id = "SPOTIFY_CLIENT_ID";
const secret = "SPOTIFY_CLIENT_SECRET";

describe("auth.service", () => {

  test("calls the authentication endpoint", async() => {
    axios.post.mockResolvedValue({ data: { access_token: accessToken } });
    await getToken(id, secret);
    expect(axios.post.calledOnce);
  });

  test("passes an encoded token in the auth header", async() => {
    axios.post.mockResolvedValue({ data: { access_token: accessToken } });
    await getToken(id, secret);
    expect(axios.post.calledOnce);
    expect(axios.post.mock.calls[0][2].headers["Authorization"]).toEqual(`Basic ${Buffer
      .from(`${id}:${secret}`)
      .toString("base64")}`);
  });

  test("it returns the access token", async() => {
    axios.post.mockResolvedValue({ data: { access_token: accessToken } });
    const token = await getToken(id, secret);
    expect(token).toBe(accessToken);
  });
});

