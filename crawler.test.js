import { createWriteStream } from "fs";
import axios from "axios";

import Crawler from "./crawler";
import { getToken } from "./auth.service.js";
import { getArtist } from "./artist.service.js";
import relatedArtist from "./__fixtures__/related-artist.json";

jest.mock("fs");
jest.mock("axios");
jest.mock("./artist.service.js");
jest.mock("./auth.service.js");

const token = "SPOTIFY_TOKEN";
const id = "123ABC";
const mockWriteStream = {
  end: jest.fn(),
  write: jest.fn()
};

describe("crawler", () => {

  beforeEach(() => {
    createWriteStream.mockReturnValue(mockWriteStream);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });


  describe("constructor", () => {

    beforeEach(() => {
      new Crawler();
    });

    test("creates a write stream for vertices", () => {
      expect(createWriteStream.mock.calls[0][0])
        .toBe("./output/vertices.csv");
    });

    test("creates a write stream for edges", () => {
      expect(createWriteStream.mock.calls[1][0])
        .toBe("./output/edges.csv");
    });
  });

  describe("start", () => {

    beforeEach(() => {
      jest.spyOn(Crawler.prototype, "crawl")
        .mockImplementation(() => {});

      getToken.mockResolvedValue(token);
      (new Crawler()).start(id);
    });

    afterEach(() => {
      Crawler.prototype.crawl.mockClear();
    });

    test("gets an auth token from spotify", () => {
      expect(getToken.mock.calls.length).toEqual(1);
    });

    test("uses the token and secret to authenticate", () => {
      expect(getToken.mock.calls[0][0]).toEqual("SPOTIFY_CLIENT_ID");
      expect(getToken.mock.calls[0][1]).toEqual("SPOTIFY_CLIENT_SECRET");
    });

    test("setting the default http headers", () => {
      expect(axios.defaults.headers.common["Authorization"]).toEqual(`Bearer ${token}`);
    });

    test("writing the vertices header", () => {
      expect(mockWriteStream.write.mock.calls[0][0])
        .toBe("~id, name:String, popularity:Number, ~label\n");
    });

    test("writing the edges header", () => {
      expect(mockWriteStream.write.mock.calls[1][0])
        .toBe("~id, ~from, ~to, ~label\n");
    });

    test("crawling the start id", () => {
      expect(Crawler.prototype.crawl.mock.calls.length).toBe(1);
      expect(Crawler.prototype.crawl.mock.calls[0][0]).toBe(id);
    });
  });

  describe("crawl", () => {

    beforeEach(() => {
      const crawler = new Crawler();
      jest.spyOn(crawler, "crawl")
        .mockImplementationOnce(id => {
          Crawler.prototype.crawl.apply(crawler, [id]);
        })
        .mockImplementation(() => {});

      getArtist.mockResolvedValue(relatedArtist.artists);
      crawler.crawl(id);
    });

    test("fetching the artist with the specified id", () => {
      expect(getArtist.mock.calls[0][0]).toEqual(id);
    });

    test("adding the artist to the edges output", () => {
      expect(mockWriteStream.write.mock.calls[0][0])
        .toBe("1, \"artist 1\", 80, artist\n");
    });

    test("adding the artist to the vertices output", () => {
      expect(mockWriteStream.write.mock.calls[1][0])
        .toEqual("123ABC, \"1\", related\n");
    });
  });
});
