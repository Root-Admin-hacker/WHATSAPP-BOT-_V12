const fs = require('fs');
const path = require('path');

// Comprehensive list of emojis for reactions
const emojiList = [
    // Smileys & Emotion
    '😊', '😂', '🤣', '❤️', '😍', '😒', '😉', '😁', '👍', '👎', '🔥', '✨', '⭐', '🌟',
    '💯', '✅', '❌', '💀', '👀', '💪', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣',
    '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓',
    '😔', '😕', '🙃', '🫠', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦',
    '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '😡', '😠',
    '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🥳', '🥺', '🤠', '🤡', '🤥', '🤫',
    '🤭', '🧐', '🤓', '😈', '👿', '👹', '👺', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖',
    
    // Gestures & People
    '👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '✋',
    '👊', '👋', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦵', '🦶',
    '👂', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸',
    
    // Animals & Nature
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐸',
    '🐙', '🦑', '🦐', '🦞', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆',
    '🦓', '🦍', '🦧', '🦣', '🐘', '🦏', '🦛', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂',
    '🌹', '🌸', '🌺', '🌻', '🌼', '🌷', '🌿', '🍀', '🍁', '🍂', '🍃', '🍄', '🌵', '🌲',
    
    // Food & Drink
    '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍',
    '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄',
    '🧅', '🥔', '🍠', '🥐', '🥖', '🫓', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩',
    '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲',
    '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠',
    
    // Symbols
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓',
    '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️',
    '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓',
    
    // Objects
    '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿',
    '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻',
    '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡',
    
    // Flags
    '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇦🇫', '🇦🇱', '🇩🇿', '🇦🇸', '🇦🇩', '🇦🇴',
    '🇰🇪', '🇺🇬', '🇹🇿', '🇷🇼', '🇧🇮', '🇪🇹', '🇸🇴', '🇸🇸', '🇸🇩', '🇪🇬', '🇿🇦', '🇳🇬', '🇬🇭'
];

// Path for storing auto-reaction state
const USER_GROUP_DATA = path.join(__dirname, '../data/userGroupData.json');

// Load auto-reaction state from file
function loadAutoReactionState() {
    try {
        if (fs.existsSync(USER_GROUP_DATA)) {
            const data = JSON.parse(fs.readFileSync(USER_GROUP_DATA));
            return data.autoReaction || false;
        }
    } catch (error) {
        console.error('Error loading auto-reaction state:', error);
    }
    return false;
}

// Save auto-reaction state to file
function saveAutoReactionState(state) {
    try {
        // Ensure directory exists
        const dir = path.dirname(USER_GROUP_DATA);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const data = fs.existsSync(USER_GROUP_DATA) 
            ? JSON.parse(fs.readFileSync(USER_GROUP_DATA))
            : { groups: [], chatbot: {} };
        
        data.autoReaction = state;
        fs.writeFileSync(USER_GROUP_DATA, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving auto-reaction state:', error);
    }
}

// Store auto-reaction state
let isAutoReactionEnabled = loadAutoReactionState();

function getRandomEmoji() {
    return emojiList[Math.floor(Math.random() * emojiList.length)];
}

// Function to add reaction to any text message - DEBUG VERSION
async function addMessageReaction(sock, message) {
    try {
        // Debug: Log that function was called
        console.log('🔍 addMessageReaction called');
        
        // Check if auto-reaction is enabled
        if (!isAutoReactionEnabled) {
            console.log('❌ Auto-reaction disabled');
            return;
        }
        
        // Check if message exists and has an ID
        if (!message?.key?.id) {
            console.log('❌ No message key/id');
            return;
        }
        
        // Check if it's a text message (conversation or extendedText)
        const isTextMessage = message.message?.conversation || 
                             message.message?.extendedTextMessage?.text ||
                             message.message?.imageMessage?.caption ||
                             message.message?.videoMessage?.caption;
        
        if (!isTextMessage) {
            console.log('❌ Not a text message (might be media without caption)');
            return;
        }
        
        // Don't react to command messages to avoid feedback loop
        const text = isTextMessage.toString().toLowerCase();
        if (text.startsWith('.autoreact')) {
            console.log('❌ Skipping autoreact command');
            return;
        }
        
        console.log(`✅ Will react to: "${isTextMessage.substring(0, 30)}..."`);
        
        // Add random delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 600 + 200));
        
        const emoji = getRandomEmoji();
        console.log(`📤 Sending reaction: ${emoji}`);
        
        await sock.sendMessage(message.key.remoteJid, {
            react: {
                text: emoji,
                key: message.key
            }
        });
        
        console.log(`✅ Reacted with ${emoji} to message: ${isTextMessage.substring(0, 30)}...`);
        
    } catch (error) {
        console.error('❌ Error in addMessageReaction:', error);
    }
}

// Function to handle autoreact command
async function handleAutoReactCommand(sock, chatId, message, isOwner) {
    try {
        if (!isOwner) {
            await sock.sendMessage(chatId, { 
                text: '❌ This command is only available for the owner!',
                quoted: message
            });
            return;
        }

        const messageText = message.message?.conversation || 
                           message.message?.extendedTextMessage?.text || '';
        const args = messageText.split(' ');
        const action = args[1]?.toLowerCase();

        if (action === 'on') {
            isAutoReactionEnabled = true;
            saveAutoReactionState(true);
            await sock.sendMessage(chatId, { 
                text: `✅ *Auto-Reactions Enabled*\n\n` +
                      `Now reacting to all text messages with random emojis!\n` +
                      `Use .autoreact off to disable.`,
                quoted: message
            });
            
            // Add a reaction to confirm
            setTimeout(async () => {
                await sock.sendMessage(chatId, {
                    react: {
                        text: '✅',
                        key: message.key
                    }
                });
            }, 500);
            
        } else if (action === 'off') {
            isAutoReactionEnabled = false;
            saveAutoReactionState(false);
            await sock.sendMessage(chatId, { 
                text: `❌ *Auto-Reactions Disabled*\n\n` +
                      `Auto-reactions have been turned off.\n` +
                      `Use .autoreact on to enable again.`,
                quoted: message
            });
            
    
            setTimeout(async () => {
                await sock.sendMessage(chatId, {
                    react: {
                        text: '💤',
                        key: message.key
                    }
                });
            }, 500);
            
        } else {
            const currentState = isAutoReactionEnabled ? '✅ ENABLED' : '❌ DISABLED';
            const randomExamples = [];
            for (let i = 0; i < 5; i++) {
                randomExamples.push(getRandomEmoji());
            }
            
            await sock.sendMessage(chatId, { 
                text: `🤖 *AUTO-REACTION SETTINGS*\n\n` +
                      `📊 *Status:* ${currentState}\n` +
                      `🎯 *Mode:* Random emojis on all text messages\n` +
                      `📚 *Emoji count:* ${emojiList.length} available\n` +
                      `🎲 *Random examples:* ${randomExamples.join(' ')}\n\n` +
                      `📝 *Commands:*\n` +
                      `• .autoreact on  - Enable auto-reactions\n` +
                      `• .autoreact off - Disable auto-reactions`,
                quoted: message
            });
        }
    } catch (error) {
        console.error('Error handling autoreact command:', error);
        await sock.sendMessage(chatId, { 
            text: '❌ Error controlling auto-reactions',
            quoted: message
        });
    }
}

// Function to get current auto-reaction status
function getAutoReactionStatus() {
    return isAutoReactionEnabled;
}

module.exports = {
    addMessageReaction,
    handleAutoReactCommand,
    getAutoReactionStatus
};