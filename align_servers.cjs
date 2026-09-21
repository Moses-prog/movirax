const fs = require("fs");
let content = fs.readFileSync("src/utils/players.ts", "utf8");

// Split into movie and tv sections
const parts = content.split("export const getTvShowPlayers =");

let moviePart = parts[0];
let tvPart = "export const getTvShowPlayers =" + parts[1];

let counter = 1;
moviePart = moviePart.replace(/title:\s*"Movirax Server \d+"/g, () => {
  return `title: "Movirax Server ${counter++}"`;
});

counter = 1;
tvPart = tvPart.replace(/title:\s*"Movirax Server \d+"/g, () => {
  return `title: "Movirax Server ${counter++}"`;
});

fs.writeFileSync("src/utils/players.ts", moviePart + tvPart);
console.log("Servers sequentially aligned!");