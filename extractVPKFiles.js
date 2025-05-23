const parser = require("@node-steam/vdf");
const fs = require("fs");
const vpk = require("vpk");
const temp = "./temp";
const dir = `./static`;

const vpkFiles = [
  "resource/csgo_brazilian.txt",
  "resource/csgo_bulgarian.txt",
  "resource/csgo_czech.txt",
  "resource/csgo_danish.txt",
  "resource/csgo_dutch.txt",
  "resource/csgo_english.txt",
  "resource/csgo_finnish.txt",
  "resource/csgo_french.txt",
  "resource/csgo_german.txt",
  "resource/csgo_greek.txt",
  "resource/csgo_hungarian.txt",
  "resource/csgo_italian.txt",
  "resource/csgo_japanese.txt",
  "resource/csgo_koreana.txt",
  "resource/csgo_latam.txt",
  "resource/csgo_norwegian.txt",
  "resource/csgo_polish.txt",
  "resource/csgo_portuguese.txt",
  "resource/csgo_romanian.txt",
  "resource/csgo_russian.txt",
  "resource/csgo_schinese.txt",
  "resource/csgo_schinese_pw.txt",
  "resource/csgo_spanish.txt",
  "resource/csgo_swedish.txt",
  "resource/csgo_tchinese.txt",
  "resource/csgo_thai.txt",
  "resource/csgo_turkish.txt",
  "resource/csgo_ukrainian.txt",
  "resource/csgo_vietnamese.txt",
  "scripts/items/items_game.txt",
];

vpkDir = new vpk(`${temp}/pak01_dir.vpk`);
vpkDir.load();

extractVPKFiles(vpkDir)

function extractVPKFiles(vpkDir) {
  console.log("Extracting vpk files");

  for (const f of vpkFiles) {
    let found = false;
    for (const path of vpkDir.files) {
      if (path.startsWith(f)) {
        let file = vpkDir.getFile(path);
        const filepath = f.split("/");
        const fileName = filepath[filepath.length - 1].replace(
          ".txt",
          ""
        );

        // Remove BOM from file (https://en.wikipedia.org/wiki/Byte_order_mark)
        // Convenience so down stream users don't have to worry about decoding with BOM
        file = trimBOM(file);
        file = file.toString("utf-8");

        const parsedData = parser.parse(file);

        try {
          fs.writeFileSync(
            `${dir}/${fileName}.json`,
            JSON.stringify(parsedData, null, 4)
          );
        } catch (err) {
          throw err;
        }

        found = true;
        break;
      }
    }

    if (!found) {
      throw `could not find ${f}`;
    }
  }
}

function trimBOM(buffer) {
  // Check if the Buffer starts with the BOM character
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xef &&
    buffer[1] === 0xbb &&
    buffer[2] === 0xbf
  ) {
    // Trim the first two bytes (BOM)
    return buffer.slice(3);
  } else {
    // No BOM, return the original Buffer
    return buffer;
  }
}
