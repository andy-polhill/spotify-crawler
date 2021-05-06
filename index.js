import fs from 'fs';

import auth from './auth.service.js';
import { getArtist } from './artist.service.js';
import axios from 'axios';

try {
  let count = 0;
  const crawled = new Set();
  const written = new Set();

  const token = await auth();

  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  axios.defaults.headers.common['Accept'] = "application/json";
  axios.defaults.headers.common['Content-Type'] = "application/json";

  const seedId = "0OdUWJ0sBjDrqHygGUXeCF";
  const vertices = fs.createWriteStream('./output/vertices.csv', { encoding: 'utf8' });
  const edges = fs.createWriteStream('./output/edges.csv', { encoding: 'utf8' });

  vertices.write(`~id, name:String, popularity:Number, ~label\n`);
  edges.write(`~id, ~from, ~to, ~label\n`);
  
  const recursion = async(id) => {    
    count++;
    crawled.add(id);

    try {
      const artists = await getArtist(id, token);
      console.log('\ncount: ', count);
      artists
        .filter(a => !written.has(a.id))
        .forEach(a => {
          written.add(a.id);
          vertices.write(`${a.id}, "${a.name}", ${a.popularity}, artist\n`);
          edges.write(`${id}, "${a.id}", related\n`);
        });
        
      if(count === 10) {
        vertices.end();
        edges.end();
        return;
      }
    
      const { id: nextId } = artists.find(({ id }) => !crawled.has(id));

      if(!nextId) {
        return console.log('💥 no next id!');
      }

      recursion(nextId);
    } catch(e) {
      console.log(e);
    }
  }

  recursion(seedId);
} catch(e) {
  console.error(e);
}
