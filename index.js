import fs from 'fs';
import axios from 'axios';

import { getToken } from './auth.service.js';
import { getArtist } from './artist.service.js';

const defaultSeedId = "6eUKZXaKkcviH0Ku9w2n3V"; // Ed Sheeran, most popular on spotify 🤨
const [seedId = defaultSeedId] = process.argv;

try {
  let count = 0;
  const crawled = new Set();
  const written = new Set();

  const token = await getToken();

  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  axios.defaults.headers.common['Accept'] = "application/json";
  axios.defaults.headers.common['Content-Type'] = "application/json";

  const vertices = fs.createWriteStream('./output/vertices.csv', { encoding: 'utf8' });
  const edges = fs.createWriteStream('./output/edges.csv', { encoding: 'utf8' });

  vertices.write(`~id, name:String, popularity:Number, ~label\n`);
  edges.write(`~id, ~from, ~to, ~label\n`);
  
  const recursion = async(id) => {    
    count++;
    crawled.add(id);

    try {
      console.log('\ncount: ', count);
      const artists = (await getArtist(id, token))
        .filter(a => !a.id || !written.has(a.id))
        .filter(({ popularity }) => popularity > 60);

      artists.forEach(a => {
          written.add(a.id);
          vertices.write(`${a.id}, "${a.name}", ${a.popularity}, artist\n`);
          edges.write(`${id}, "${a.id}", related\n`);
        });
        
      if(count === 30000) {
        vertices.end();
        edges.end();
        return;
      }

      let nextId;

      /*
        When there are no popular routes to go down
        avoid the rabbit holes and find another artist
        to continue with. There are some interesting
        rabbit holes 🐰
      */
      if(!artists.length) {
        console.log('no artists!');

        const iterator = written[Symbol.iterator]();

        let result = iterator.next();
        while (!result.done) {
          result = iterator.next();
          if(!crawled.has(result.value)) {
            console.log(`recommence with ${result.value}`);
            nextId = result.value;
            break;
          }
        }
      }

      // TODO this reads a bit backwards as it's the most likely outcome
      if(!nextId) {
        nextId = artists.find(({ id }) => !crawled.has(id)).id;
      }

      if(!nextId) {
        return console.log('💥 no next id!');
      }

      recursion(nextId);
    } catch(e) {
      vertices.end();
      edges.end();
      console.log(e);
    }
  }

  recursion(seedId);
} catch(e) {
  console.error(e);
}
