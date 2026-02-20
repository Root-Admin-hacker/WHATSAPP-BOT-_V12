// getProfile.js
const axios = require('axios');

async function getProfileCommand(sock, chatId, senderId, mentionedJids, message) {
    const isOwner = message.key.fromMe;
    if (!isOwner) {
        await sock.sendMessage(chatId, { 
            text: 'This command can only be used by the bot owner.'
        }, { quoted: message });
        return;
    }

    let targetUser = null;

    // Check if replying to a message
    if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        targetUser = message.message.extendedTextMessage.contextInfo.participant;
    }
    // Check if mentioning a user
    else if (mentionedJids && mentionedJids.length > 0) {
        targetUser = mentionedJids[0];
    }
    // Check if in private chat (then get profile of the person you're chatting with)
    else if (!chatId.endsWith('@g.us')) {
        targetUser = senderId;
    }
    // If in group with no reply/mention, get sender's own profile
    else if (chatId.endsWith('@g.us')) {
        targetUser = senderId;
    }

    if (!targetUser) {
        await sock.sendMessage(chatId, { 
            text: '❌ Please reply to a user\'s message or mention them to get profile picture!\n\n' +
                  'Usage:\n' +
                  '• Reply to their message with .getpp\n' +
                  '• .getpp @username\n' +
                  '• In private chat, just send .getpp\n' +
                  '• In group without mention, gets your own profile'
        }, { quoted: message });
        return;
    }

    try {
        // Send processing message
        await sock.sendMessage(chatId, { 
            text: '🔄 Fetching profile picture...'
        }, { quoted: message });

        // Get user info for display
        let userDisplay = targetUser.split('@')[0];
        
        // Try to get contact name if available
        try {
            const contact = await sock.getContact(targetUser);
            if (contact && contact.name) {
                userDisplay = contact.name;
            } else if (contact && contact.notify) {
                userDisplay = contact.notify;
            }
        } catch (e) {
            // Ignore contact fetch errors
        }

        // Try to get profile picture
        let profilePicUrl;
        try {
            profilePicUrl = await sock.profilePictureUrl(targetUser, 'image');
        } catch (e) {
            // If no profile picture, send default response
            if (e.message.includes('not found') || e.data === 404 || e.message.includes('404')) {
                await sock.sendMessage(chatId, { 
                    text: `👤 @${userDisplay} does not have a profile picture set.`,
                    mentions: [targetUser]
                });
                return;
            }
            throw e; // Re-throw other errors
        }

        if (profilePicUrl) {
            // Download the profile picture using axios
            const response = await axios({
                method: 'get',
                url: profilePicUrl,
                responseType: 'arraybuffer'
            });
            
            const imageBuffer = Buffer.from(response.data, 'binary');

            // Simple caption with just the mention
            const caption = `Profile Picture of @${targetUser.split('@')[0]}`;

            // Send the profile picture with contextInfo
            await sock.sendMessage(chatId, { 
                image: imageBuffer,
                caption: caption,
                mentions: [targetUser],
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: 'https://github.com/Root-Admin-hacker/WHATSAPP-BOT-_V12',
                        newsletterName: '🅡🅞🅞🅣_🅐🅓🅜🅘🅝 🅘 ✅',
                        serverMessageId: -1
                    }
                }
            });
        } else {
            await sock.sendMessage(chatId, { 
                text: `👤 @${userDisplay} does not have a profile picture set.`,
                mentions: [targetUser]
            });
        }

    } catch (error) {
        console.error('Error in getProfile command:', error);
        
        // Handle specific error cases
        let errorMessage = '❌ Failed to fetch profile picture.';
        
        if (error.message.includes('404') || error.message.includes('not found')) {
            errorMessage = '❌ User has no profile picture or the profile is private.';
        } else if (error.message.includes('rate-overlimit')) {
            errorMessage = '❌ Rate limit exceeded. Please try again later.';
        } else if (error.message.includes('connection') || error.message.includes('ECONNREFUSED')) {
            errorMessage = '❌ Network error. Please try again.';
        } else if (error.message.includes('403')) {
            errorMessage = '❌ Access denied. The profile picture is private.';
        }

        await sock.sendMessage(chatId, { 
            text: errorMessage
        }, { quoted: message });
    }
}

module.exports = getProfileCommand;