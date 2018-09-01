const express = require("express");
const bodyparser = require("body-parser");
const generate = require("./generate");
const puppeteer = require("puppeteer");
const path = require("path");
const redis = require("redis");
const client = redis.createClient();
const cors = require("cors");
const qs = require("qs");

const CacheManager = require("./CacheManager");
const cache = new CacheManager(client);

const app = express();

let browser;

app.engine("pug", require("pug").__express);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// app.use(cors())
app.use(bodyparser.json());
app.use(express.static("public"));

app.get("/oscar/api/generate", async (req, res, next) => {
  const text = generate.text(req.query);
  const emojis = generate.emoji(req.query);

  res.render("index", { text, emojis });
});

app.get("/oscar/api/get", async (req, res, next) => {
  const startDate = new Date();

  const cached = await cache.getImage(req.query);

  if (cached) {
    console.log(`[cached] fetch photo in ${new Date() - startDate}ms`);

    res.end(cached);

    return;
  }

  console.log("not cached page");
  (async () => {
    const page = await browser.newPage();
    page.setViewport({
      width: 600,
      height: 350
    });

    page.once("load", async () => {
      console.log("page loaded", new Date() - startDate + "ms");

      const screenshotPath = path.join(
        __dirname,
        "generated",
        cache.getHash(req.query) + ".png"
      );

      const screenshot = await page.screenshot({
        path: screenshotPath
      });

      const endDate = new Date();

      res.end(screenshot, "binary");

      page.close();

      console.log(`[not cached] fetch photo in ${new Date() - startDate}ms`);
    });

    await page.goto(
      "http://localhost/oscar/api/generate?" + qs.stringify(req.query)
    );
  })();
});
(async () => {
  browser = await puppeteer.launch();

  app.listen(3011, err => {
    if (err) console.log(err);
    console.log("browser initialized");
  });
})();
