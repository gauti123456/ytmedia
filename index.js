const express = require("express");
const youtubedl = require("youtube-dl");
const bodyParser = require("body-parser");
const request = require("request");
const fbdl = require("fbdl-core");
const fs = require('fs')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");

app.use(express.static("public"));

const PORT = 3000 || process.env.PORT;

app.get("/", (req, res) => {
  res.render("index", {
    title:
      "FREE Video Downloader Youtube Facebook Instagram to MP4 - YTMedia.in",
  });
});

app.get("/youtubeDownloader", (req, res) => {
  res.render("youtubeDownloader", {
    title: "FREE Online Youtube Video Downloader to Mp4 - YTMedia.in",
  });
});

app.get("/youtubeThumbnail", (req, res) => {
  res.render("youtubeThumbnail", {
    title: "FREE Online Youtube Video Thumbnail Downloader - YTMedia.in",
  });
});

app.get("/facebookDownloader", (req, res) => {
  res.render("facebookDownloader", {
    title: "FREE Online Facebook Video Downloader to Mp4 - YTMedia.in",
  });
});



app.post("/youtubeDownloader", (req, res) => {
  const url = req.body.url;
  res.header("Content-Disposition", 'attachment; filename="video.mp4"');

  youtubedl.getInfo(url, ["--format=18"]).pipe(res);
});

app.post("/youtubeThumbnail",(req, res) => {
  const url = req.body.url;
  //res.header('Content-Disposition', 'attachment; filename="filename.jpg"');

  youtubedl(url, async (err, info) => {
    if (err) {
      res.send(err);
    }
    var outputFilePath = Date.now() + "output.jpg";
    const data = await download(info.thumbnail, outputFilePath);

  	console.log(data); // The file is finished downloading.

    res.download(outputFilePath, (err) => {
      if (err) {
        res.send(err);
      }
      fs.unlinkSync(outputFilePath);
    });
  });
});

app.post('/facebookDownloader',(req,res) => {
  const url = req.body.url;

  var videoUrl = ""

  fbdl.getInfo(url)
  .then((response) => {
    videoUrl = response.rawVideo

    res.redirect(videoUrl)
  });
})

async function download(url, dest) {
  /* Create an empty file where we can save data */
  const file = fs.createWriteStream(dest);

  /* Using Promises so that we can use the ASYNC AWAIT syntax */
  await new Promise((resolve, reject) => {
    request({
      /* Here you should specify the exact link to the file you are trying to download */
      uri: url,
      gzip: true,
    })
      .pipe(file)
      .on("finish", async () => {
        console.log(`The file is finished downloading.`);
        resolve();
      })
      .on("error", (error) => {
        reject(error);
      });
  }).catch((error) => {
    console.log(`Something happened: ${error}`);
  });
}

app.listen(PORT, () => {
  console.log("Server is listening on Port" + PORT);
});
