import got from 'got';
import fs from 'fs';

import auth from './auth.service.js';
import { getArtist } from './artist.service.js';

/*
vertx
~id, name:String, age:Int, lang:String, ~label
v1, "marko", 29, , person
v2, "lop", , "java", software

edges
~id, ~from, ~to, ~label, weight:Double
e1, v1, v2, created, 0.4
*/

const seedId = "0OdUWJ0sBjDrqHygGUXeCF";

try {
  const token = await auth();
  const artists = await getArtist(seedId, token);
  console.log(artists)
} catch(e) {
  console.error(e);

}


//   // const stream = fs.createWriteStream("./artists.txt");
// const data = { [seedId]: { crawled: true }};
// try {
//   await getArtist(seedId, data);
// } catch(e) {
//   console.log('💥');
//   fs.writeFileSync('artists.json', JSON.stringify(data));
// }


