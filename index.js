const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActivityType } = require('discord.js');
const axios = require('axios');
const Gamedig = require('gamedig');
const fs = require('fs');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
});

const PREFIX = '!';
const serverIP = 'YOUR_SERVER_IP';
const serverPort = 25565;
const statusInterval = 30000;

client.login('YOUR_BOT_TOKEN');

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Set custom status
    client.user.setPresence({
        status: 'dnd', // Do Not Disturb
        activities: [{ name: 'Created By MiningTvYt 🔥', type: ActivityType.Playing }]
    });

    updateAllServers();
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        const msg = await message.channel.send('Pinging...');
        msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms.`);
    }

    if (command === 'minecraft') {
        try {
            const response = await axios.get(`https://api.mcsrvstat.us/2/${serverIP}:${serverPort}`);
            const data = response.data;

            if (data && data.online) {
                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle('**YOUR_SERVER_NAME**')
                    .setThumbnail('IMAGE_LINK')
                    .addFields(
                        { name: 'Server IP', value: 'YOUR_SERVER_IP' },
                        { name: 'Server Port', value: 'YOUR_SERVER_PORT' },
                        { name: 'Status', value: 'Online', inline: true },
                        { name: 'Version', value: '1.8-1.21x & MCPE', inline: true },
                        { name: 'Players Online', value: `${data.players.online}/500`, inline: true },
                        { name: 'Games', value: ' YOUR SERVER GAME MODES ' }
                    )
                    .setFooter({ text: 'Best MultiPlayer Server 🔥' })
                    .setTimestamp();
                message.channel.send({ embeds: [embed] });
            } else {
                message.channel.send('Server is currently offline.');
            }
        } catch (error) {
            console.error('Error fetching server status:', error);
            message.channel.send('An error occurred while fetching server status.');
        }
    }
});

function updateAllServers() {
    const serverInfo = loadServerInfo();
    client.guilds.cache.forEach(async (guild) => {
        const guildId = guild.id;
        const guildServerInfo = serverInfo[guildId] || {};
        const channelId = guildServerInfo.channelId;

        if (guildServerInfo.setupComplete && channelId) {  
            try {  
                const channel = client.channels.cache.get(channelId);  
                if (!channel) return;  

                let serverMessage;  
                const messageId = guildServerInfo.messageId;  

                if (messageId) {  
                    const fetchedMessage = await channel.messages.fetch(messageId).catch(() => null);  
                    if (fetchedMessage) {  
                        serverMessage = fetchedMessage;  
                    }  
                }  

                async function fetchAndUpdateServerStatus() {  
                    try {  
                        const state = await Gamedig.query({  
                            type: 'minecraft',  
                            host: serverIP,  
                            port: serverPort  
                        });  

                        const players = state.players.length;  
                        const maxPlayers = state.maxplayers;  
                        const status = 'Online';  

                        const embed = generateEmbed(status, players, maxPlayers);  

                        if (!serverMessage || serverMessage.deleted) {  
                            serverMessage = await channel.send({ embeds: [embed] });  
                            guildServerInfo.messageId = serverMessage.id;  
                            saveServerInfo(guildId, guildServerInfo);  
                        } else {  
                            await serverMessage.edit({ embeds: [embed] });  
                        }  
                    } catch (error) {  
                        handleFetchError(channel, serverMessage, error);  
                    }  
                }  

                fetchAndUpdateServerStatus();  
                setInterval(fetchAndUpdateServerStatus, statusInterval);  
            } catch (error) {  
                console.error('Error starting event:', error);  
            }  
        }  
    });
}

function generateEmbed(status, players, maxPlayers) {
    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('YOUR_SERVER_NAME')
        .setThumbnail('YOUR_IMAGE_LINK')
        .addFields(
            { name: 'Server IP', value: 'YOUR SERVER IP' },
            { name: 'Server Port', value: 'YOUR SERVER PORT' },
            { name: 'Status', value: status, inline: true },
            { name: 'Version', value: '1.8-1.21x & MCPE', inline: true },
            { name: 'Players Online', value: `${players}/500`, inline: true },
            { name: 'Games', value: ' YOUR SERVER GAMEMODES ' }
        )
        .setFooter({ text: 'Best MultiPlayer Server 🔥' })
        .setTimestamp();
}

function handleFetchError(channel, serverMessage, error) {
    const errorEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('Server Currently Offline')
        .setDescription('Server will start soon, please wait.')
        .addFields({ name: 'Error', value: `${error}` })
        .setTimestamp();

    if (!serverMessage || serverMessage.deleted) {  
        channel.send({ embeds: [errorEmbed] });  
    } else {  
        serverMessage.edit({ embeds: [errorEmbed] });  
    }
}

function loadServerInfo() {
    try {
        const data = fs.readFileSync('serverInfo.json', 'utf8');
        return JSON.parse(data) || {};
    } catch (err) {
        console.error('Error reading serverInfo.json:', err);
        return {};
    }
}

function saveServerInfo(guildId, info) {
    const serverInfo = loadServerInfo();
    serverInfo[guildId] = info;
    fs.writeFileSync('serverInfo.json', JSON.stringify(serverInfo, null, 2), 'utf8');
}
