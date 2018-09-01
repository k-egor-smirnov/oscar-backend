const crypto = require("crypto");
const fs = require("fs");
const util = require("util");
const path = require("path");

const readFileAsynx = util.promisify(fs.readFile);

const allowedProps = [
  "cripple",
  "animal",
  "slavery",
  "poorness",
  "fatal",
  "religion",
  "cartoon",
  "musical",
  "gender",
  "color"
];

class CacheManager {
  constructor(client) {
    this.client = client;
  }

  _normalizeArguments(obj) {}

  getHash(qs) {
    const filteredQuerystring = Object.keys(qs)
      .sort()
      .reduce(function(a, v) {
        a.push(v);
        return a;
      }, [])
      .filter(key => allowedProps.includes(key))
      .reduce((obj, key) => {
        obj[key] = qs[key];
        return obj;
      }, {});

    const str = JSON.stringify(filteredQuerystring);
    return crypto
      .createHash("sha256")
      .update(str)
      .digest("hex");
  }

  async getImage(qs) {
    const hash = this.getHash(qs);

    try {
      const file = await readFileAsynx(
        path.join(__dirname, "/generated", `${hash}.png`)
      );

      return file;
    } catch (err) {
      return;
    }
  }
}

module.exports = CacheManager;
