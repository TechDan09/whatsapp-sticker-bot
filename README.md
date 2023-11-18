# Whatsapp Sticker Bot

Whatsapp Bot to automatically create a whatasapp sticker when mentioned on an image or video

## Getting Started

- Install dependencies by running `yarn`
- Run `yarn start` to start the bot
- A QR code will be generated in the terminal, scan it with your whatsapp phone
- Add the whatsapp number to a group chat
- Mention the bot in a message with an image or video and it will reply with a sticker

## Cavets

- You need to have a valid ffmpeg path to create animated video stickers thats why the project comes with an ffmpeg package. I'm considering improving and removing this dependency in the future. Feel free to open a PR if you want to help with this.
