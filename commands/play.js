const yts = require('yt-search');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

async function songCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const searchQuery = text.split(' ').slice(1).join(' ').trim();
        
        if (!searchQuery) {
            return await sock.sendMessage(chatId, { 
                text: "❌ Please provide a song name to download.\n*Example: .song perfect ed sheeran*"
            });
        }

        await sock.sendMessage(chatId, {
            text: "🔍 *Searching for your song...*"
        });

        // Search for the song
        const { videos } = await yts(searchQuery);
        if (!videos || videos.length === 0) {
            return await sock.sendMessage(chatId, { 
                text: "❌ No songs found! Try a different search term."
            });
        }

        await sock.sendMessage(chatId, {
            text: "🩸 *Downloading your song...* This may take a moment."
        });

        const video = videos[0];
        const urlYt = video.url;
        const title = video.title;
        
        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        
        const tempFilePath = path.join(tempDir, `${Date.now()}.mp3`);

        // Download audio
        const audioStream = ytdl(urlYt, {
            filter: 'audioonly',
            quality: 'highestaudio',
        });

        const writeStream = fs.createWriteStream(tempFilePath);
        audioStream.pipe(writeStream);

        await new Promise((resolve, reject) => {
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
            audioStream.on('error', reject);
        });

        // Send the audio
        await sock.sendMessage(chatId, {
            audio: { url: tempFilePath },
            mimetype: "audio/mpeg",
            fileName: `${title.replace(/[^\w\s]/gi, '')}.mp3`,
            caption: `🎵 *${title}*\n\n✅ *Downloaded successfully!*`
        }, { quoted: message });

        // Clean up
        fs.unlink(tempFilePath, (err) => {
            if (err) console.error('Error deleting temp file:', err);
        });

    } catch (error) {
        console.error('Error in song command:', error);
        await sock.sendMessage(chatId, { 
            text: "❌ An error occurred while downloading. Please try again later."
        });
    }
}

module.exports = songCommand;