// block.js
async function blockCommand(sock, chatId, senderId, mentionedJids, message) {
    const isOwner = message.key.fromMe;
    if (!isOwner) {
        await sock.sendMessage(chatId, { 
            text: 'This command can only be used by the bot owner.'
        }, { quoted: message });
        return;
    }

    let userToBlock = null;

    // Check if replying to a message
    if (message.message?.extendedTextMessage?.contextInfo?.participant) {
        userToBlock = message.message.extendedTextMessage.contextInfo.participant;
    }
    // Check if mentioning a user
    else if (mentionedJids && mentionedJids.length > 0) {
        userToBlock = mentionedJids[0];
    }
    // Check if in private chat (then block the person you're chatting with)
    else if (!chatId.endsWith('@g.us')) {
        // In private chat, block the sender
        userToBlock = senderId;
    }

    if (!userToBlock) {
        await sock.sendMessage(chatId, { 
            text: '❌ Please reply to a user\'s message or mention them to block!\n\n' +
                  'Usage:\n' +
                  '• Reply to their message with .block\n' +
                  '• .block @username\n' +
                  '• In private chat, just send .block'
        }, { quoted: message });
        return;
    }

    // Don't allow blocking the bot itself
    const botId = sock.user?.id || '';
    const botNumber = botId.split(':')[0] || botId.split('@')[0] || '';
    
    if (userToBlock.includes(botNumber) || userToBlock === botId || userToBlock.includes('254739006966')) {
        await sock.sendMessage(chatId, { 
            text: '❌ I cannot block myself!'
        }, { quoted: message });
        return;
    }

    try {
        // Send processing message
        await sock.sendMessage(chatId, { 
            text: '🔄 Blocking user...'
        }, { quoted: message });

        // Block the user
        await sock.updateBlockStatus(userToBlock, 'block');
        
        // Get user info for display
        let userDisplay = userToBlock.split('@')[0];
        
        // Try to get contact name if available
        try {
            const contact = await sock.getContact(userToBlock);
            if (contact && contact.name) {
                userDisplay = contact.name;
            } else if (contact && contact.notify) {
                userDisplay = contact.notify;
            }
        } catch (e) {
            // Ignore contact fetch errors
        }

        // Send success message
        await sock.sendMessage(chatId, { 
            text: `✅ Successfully blocked @${userDisplay}\n\n` +
                  `User: ${userToBlock}\n` +
                  `They will no longer be able to message you.`,
            mentions: [userToBlock]
        });

        // Log the block action
        console.log(`🚫 Blocked user: ${userToBlock} in ${chatId}`);

    } catch (error) {
        console.error('Error in block command:', error);
        
        // Handle specific error cases
        let errorMessage = '❌ Failed to block user.';
        
        if (error.message.includes('not-authorized')) {
            errorMessage = '❌ You are not authorized to block this user.';
        } else if (error.message.includes('invalid')) {
            errorMessage = '❌ Invalid user ID.';
        } else if (error.message.includes('rate-overlimit')) {
            errorMessage = '❌ Rate limit exceeded. Please try again later.';
        }

        await sock.sendMessage(chatId, { 
            text: errorMessage
        }, { quoted: message });
    }
}

module.exports = blockCommand;