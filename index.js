const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrGen = require("qrcode-terminal");
const sharp = require("sharp");
const http = require("http");
const port = process.env.PORT || 10000;

const client = new Client({
  authStrategy: new LocalAuth(),
  ffmpegPath: "./ffmpeg.exe",
});

// NOTE: Feel free to ignore this method, it's just for the sake of hosting on render.com, an open port is required.
http
  .createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("WhatsApp bot is running\n");
  })
  .listen(port, function () {
    console.log(`Server is running on port ${port}`);
  });

// Generate QR code
client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrGen.generate(qr, {
    small: true,
  });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  const mentioned = isMentioned(client.info.wid._serialized, msg);

  if (msg.hasMedia && mentioned) {
    console.log(msg);
    const media = await msg.downloadMedia();

    if (media.mimetype.includes("video")) {
      processVideo(media, msg);

      return;
    }

    processImage(media, msg);

    return;
  }

  if (mentioned && !msg.hasMedia) {
    console.log(msg);

    msg.reply("Oga, you gats upload image first na, abi you no get data?");

    return;
  }
});

// Check if the bot is mentioned in the message
function isMentioned(clientId, message) {
  //TODO: Check if the message is from a group also
  return message.mentionedIds.includes(clientId);
}

// Process the received image and convert it to a sticker
async function processImage(media, msg) {
  try {
    const imageBuffer = Buffer.from(media.data, "base64");

    // Convert image to WebP format for sticker
    const stickerBuffer = await sharp(imageBuffer)
      .toFormat("webp")
      .resize(512, 512, {
        withoutEnlargement: true,
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .toBuffer();

    // Create a sticker from the WebP buffer
    const sticker = new MessageMedia(
      "image/webp",
      stickerBuffer.toString("base64"),
      null
    );

    msg.reply(sticker, "", {
      sendMediaAsSticker: true,
    });
  } catch (err) {
    console.error("Error processing image:", err);
  }
}

function processVideo(media, msg) {
  const videoBuffer = Buffer.from(media.data, "base64");

  // Create a MessageMedia object from the GIF data
  const gifMedia = new MessageMedia(
    media.mimetype,
    videoBuffer.toString("base64"),
    null
  );

  msg.reply(gifMedia, "", {
    sendMediaAsSticker: true,
    stickerAuthor: "TechDan's Bot",
    stickerName: "Bloks",
  });
}

client.initialize();
