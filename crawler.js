import axios from "axios";
import { createWriteStream } from "fs";

import { getToken } from "./auth.service.js";
import { getArtist } from "./artist.service.js";

export default class Crawler {

  count = 0;

  constructor() {
    this.written = new Set();
    this.crawled = new Set();

    this.vertices = createWriteStream("./output/vertices.csv", { encoding: "utf8" });
    this.edges = createWriteStream("./output/edges.csv", { encoding: "utf8" });
  }

  async start(id) {
    const token = await getToken(
      process.env.SPOTIFY_CLIENT_ID,
      process.env.SPOTIFY_CLIENT_SECRET
    );

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.defaults.headers.common["Accept"] = "application/json";
    axios.defaults.headers.common["Content-Type"] = "application/json";

    this.vertices.write("~id, name:String, popularity:Number, ~label\n");
    this.edges.write("~id, ~from, ~to, ~label\n");
    this.crawl(id);
  }

  stop() {
    this.vertices.end();
    this.edges.end();
  }

  getNextArtist = () => {
    const iterator = this.written[Symbol.iterator]();
  
    let result = iterator.next();
    while (!result.done) {
      result = iterator.next();
      if(!this.crawled.has(result.value)) {
        console.log(`recommence with ${result.value}`);
        return result.value;
      }
    }
  }

  async crawl(id) {
    this.count++;

    const artists = (await getArtist(id))
    .filter(a => !a.id || !this.written.has(a.id))
    .filter(({ popularity }) => popularity > 60);

    artists.forEach(a => {
      this.written.add(a.id);
      this.vertices.write(`${a.id}, "${a.name}", ${a.popularity}, artist\n`);
      this.edges.write(`${id}, "${a.id}", related\n`);
    });

    this.crawled.add(id);

    if(this.count === 30000) {
      this.stop();
    }

    let nextId;

    /*
      When there are no popular routes to go down
      avoid the rabbit holes and find another artist
      to continue with. There are some interesting
      rabbit holes 🐰
    */
    if(!artists.length) {
      nextId = this.getNextArtist();
    }

    if(!nextId) { // Find next un crawled artist
      nextId = artists.find(({ id }) => !this.crawled.has(id)).id;
    }

    if(!nextId) {
      this.stop();
      throw new Error("unable to find an ID to crawl 💥");
    }

    this.crawl(nextId);
  }
}
