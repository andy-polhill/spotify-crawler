import Crawler from "./crawler.js";

const defaultSeedId = "6eUKZXaKkcviH0Ku9w2n3V"; // Ed Sheeran, most popular on spotify 🤨
const [path, file, seedId = defaultSeedId] = process.argv;
(new Crawler()).start(defaultSeedId);
