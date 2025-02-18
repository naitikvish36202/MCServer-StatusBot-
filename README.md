# MCServer-StatusBot-
Discord Minecraft Status Bot keeps track of your Minecraft server’s status and displays real-time updates in your Discord server. It fetches player count, server version, and more. Customize it easily for your needs. Need help? Join our support server: https://discord.gg/rBRT7Vs9yf
# Discord Minecraft Status Bot

This is a Discord bot that fetches and displays the status of a Minecraft server. It uses `discord.js`, `axios`, and `gamedig` to get real-time server information and update a message in a specified channel.

## Required Edits

To properly configure this bot for your Minecraft server, you need to edit the following lines:

### 1. **Bot Token**
   - **File:** `index.js`
   - **Line:** `client.login('YOUR_BOT_TOKEN');`
   - **Edit:** Replace `'YOUR_BOT_TOKEN'` with your actual Discord bot token.

### 2. **Minecraft Server Details**
   - **File:** `index.js`
   - **Lines:**
     - `const serverIP = 'YOUR_SERVER_IP';`
     - `const serverPort = 25565;`
   - **Edit:** Replace `'YOUR_SERVER_IP'` with your Minecraft server IP and update the `serverPort` if needed.

### 3. **Embed Message Customization**
   - **File:** `index.js`
   - **Lines:**
     - `.setTitle('**YOUR_SERVER_NAME**')`
     - `.setThumbnail('IMAGE_LINK')`
     - `{ name: 'Server IP', value: 'YOUR_SERVER_IP' }`
     - `{ name: 'Server Port', value: 'YOUR_SERVER_PORT' }`
     - `{ name: 'Games', value: ' YOUR SERVER GAME MODES ' }`
   - **Edit:**
     - Replace `'YOUR_SERVER_NAME'` with your Minecraft server’s name.
     - Replace `'IMAGE_LINK'` with a link to your server logo or any relevant image.
     - Replace `'YOUR_SERVER_GAME_MODES'` with the list of game modes your server offers.

### 4. **Server Configuration JSON**
   - **File:** `serverInfo.json`
   - **Lines:**
     - `"DISCORD_SERVER_ID": { "channelId": "STATUS_CHANNEL_ID", "setupComplete": true, "messageId": "" },`
     - `"miningChannelId": ""`
   - **Edit:**
     - Replace `"DISCORD_SERVER_ID"` with your actual Discord server ID.
     - Replace `"STATUS_CHANNEL_ID"` with the channel ID where the status message should be sent.
     - **Do not change** `"messageId"` and `"miningChannelId"` values.

## Installation & Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/naitikvish36202/MCServer-StatusBot
   cd DISCORD-MC-STATUS-BOT
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the bot:
   ```bash
   node index.js
   ```

## Dependencies
- `discord.js`
- `axios`
- `gamedig`
- `fs`

## License
This project is open-source and free to use. Contributions are welcome!

