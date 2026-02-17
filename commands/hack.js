// hack.js
async function hackCommand(sock, chatId, senderId, message) {
    const isOwner = message.key.fromMe;
    if (!isOwner) {
        await sock.sendMessage(chatId, { 
            text: '╔═══════════════════════════════════╗\n' +
                  '║  ❌ ACCESS DENIED                 ║\n' +
                  '║  This command is for owner only   ║\n' +
                  '╚═══════════════════════════════════╝'
        }, { quoted: message });
        return;
    }

    // Get target if mentioned, otherwise use a random name
    let target = "SYSTEM";
    let targetMention = null;
    
    if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
        targetMention = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
        target = `@${targetMention.split('@')[0]}`;
    }

    // Initial message with hacker header
    const startMsg = await sock.sendMessage(chatId, { 
        text: `╔══════════════════════════════════════════════════════════╗\n` +
              `║  🔥 CYBER HACK SEQUENCE INITIATED 🔥                    ║\n` +
              `╚══════════════════════════════════════════════════════════╝\n\n` +
              `TARGET: ${target}\n` +
              `STATUS: CONNECTING...\n` +
              `──────────────────────────────────────────────────────────`
    });

    // Professional hacking steps with double equals and proper formatting
    const steps = [
        { main: "ESTABLISHING SECURE CONNECTION", dots: 3, 
          details: ["PROTOCOL: TLS 1.3", "CIPHER: AES-256-GCM", "HANDSHAKE: COMPLETE"] },
        
        { main: "BYPASSING FIREWALL", dots: 4,
          details: ["PORT SCANNING: 65535 PORTS", "VULNERABILITIES: 23 FOUND", "EXPLOITING: CVE-2024-🤖", "FIREWALL RULES: BYPASSED"] },
        
        { main: "ACCESSING MAINFRAME", dots: 5,
          details: ["REMOTE SHELL: ESTABLISHED", "PRIVILEGE ESCALATION: ROOT", "KERNEL MODULE: LOADED", "SYSTEM CALLS: HOOKED", "BACKDOOR: INSTALLED"] },
        
        { main: "CRACKING ENCRYPTION PROTOCOLS", dots: 6,
          details: ["RSA-4096: CRACKED", "AES-256: DECRYPTED", "HASHES: 1,234 CRACKED", "SALT: BYPASSED", "KEY DERIVATION: COMPLETE", "CERTIFICATES: FORGED"] },
        
        { main: "INJECTING PAYLOAD", dots: 4,
          details: ["SHELLCODE: INJECTED", "MEMORY: OVERWRITTEN", "PROCESS: HIJACKED", "EXECUTION: SUCCESSFUL"] },
        
        { main: "EXTRACTING SENSITIVE DATA", dots: 5,
          details: ["PASSWORDS: 2,547 RETRIEVED", "COOKIES: 8,342 EXPORTED", "TOKENS: 156 CAPTURED", "SESSION DATA: COMPLETE", "DATABASE: DUMPED"] },
        
        { main: "ACCESSING CAMERA FEED", dots: 3,
          details: ["DEVICE: FACETIME HD", "RESOLUTION: 1080p", "STREAM: ACTIVE"] },
        
        { main: "DOWNLOADING CONTACT LIST", dots: 4,
          details: ["CONTACTS: 1,847 SYNCED", "EMAILS: 3,221 HARVESTED", "PHONE NUMBERS: COMPLETE", "SOCIAL PROFILES: LINKED"] },
        
        { main: "SCANNING DEVICE HISTORY", dots: 5,
          details: ["BROWSER HISTORY: 12,547 ENTRIES", "LOCATIONS: 843 TRACKED", "SEARCHES: 5,321 ANALYZED", "APPS USAGE: LOGGED", "TIMELINE: RECONSTRUCTED"] },
        
        { main: "RETRIEVING CREDENTIALS", dots: 4,
          details: ["EMAIL PASSWORDS: 12 FOUND", "BANKING APPS: 3 ACCESSED", "SOCIAL MEDIA: 8 HACKED", "WIFI KEYS: 5 EXTRACTED"] },
        
        { main: "ACCESSING FINANCIAL DATA", dots: 4,
          details: ["BALANCE: $XX,XXX.XX", "TRANSACTIONS: 347 LOGGED", "CARDS: 4 STORED", "CRYPTO WALLETS: 2 FOUND"] },
        
        { main: "TRACING GPS LOCATION", dots: 3,
          details: ["LATITUDE: -1.286389", "LONGITUDE: 36.817223", "ACCURACY: 3 METERS"] },
        
        { main: "ACCESSING MICROPHONE", dots: 3,
          details: ["AUDIO: RECORDING", "FORMAT: WAV 44.1kHz", "DURATION: 00:03:27"] },
        
        { main: "DOWNLOADING GALLERY", dots: 4,
          details: ["PHOTOS: 2,341 DOWNLOADED", "VIDEOS: 347 DOWNLOADED", "METADATA: EXTRACTED", "LOCATION TAGS: MAPPED"] },
        
        { main: "ACCESSING SOCIAL MEDIA", dots: 5,
          details: ["INSTAGRAM DMS: 1,247 READ", "WHATSAPP CHATS: 8,432 LOGGED", "TELEGRAM GROUPS: 23 INFILTRATED", "FACEBOOK MESSAGES: 3,219", "TWITTER DMS: 543 ACCESSED"] },
        
        { main: "CRACKING ENCRYPTED FILES", dots: 4,
          details: ["ZIP ARCHIVES: 12 UNLOCKED", "PDF FILES: 34 DECRYPTED", "VAULT: ACCESSED", "HIDDEN PARTITIONS: MOUNTED"] },
        
        { main: "INSTALLING PERSISTENCE", dots: 3,
          details: ["CRON JOB: CREATED", "STARTUP SCRIPT: ADDED", "ROOTKIT: DEPLOYED"] },
        
        { main: "COVERING TRACKS", dots: 4,
          details: ["LOGS: WIPED", "HISTORY: CLEARED", "TIMESTAMPS: SPOOFED", "FORENSICS: BYPASSED"] }
    ];

    let currentText = `╔══════════════════════════════════════════════════════════╗\n` +
                     `║  🔥 CYBER HACK SEQUENCE INITIATED 🔥                    ║\n` +
                     `╚══════════════════════════════════════════════════════════╝\n\n` +
                     `TARGET: ${target}\n` +
                     `STATUS: CONNECTING...\n` +
                     `──────────────────────────────────────────────────────────\n\n`;

    // Random IP generator
    const generateIP = () => {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    };

    // Random MAC generator
    const generateMAC = () => {
        return Array(6).fill(0).map(() => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':').toUpperCase();
    };

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        // Add main step with progressive dots
        for (let dotCount = 1; dotCount <= step.dots; dotCount++) {
            const dots = '.'.repeat(dotCount);
            const padding = ' '.repeat(step.dots - dotCount);
            const displayText = currentText + 
                `┌──[ ${step.main}${dots}${padding} ]\n`;
            
            await sock.sendMessage(chatId, { 
                text: displayText,
                edit: startMsg.key
            });
            
            await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 100));
        }
        
        // Add main step line
        currentText += `┌──[ ${step.main}${'.'.repeat(step.dots)} ]\n`;
        
        // Add technical details with proper spacing and double equals
        for (const detail of step.details) {
            // Random delay between details
            await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
            
            // Format detail with double equals and proper spacing
            const detailLine = `│  ├──== ${detail}\n`;
            currentText += detailLine;
            
            // Update message
            await sock.sendMessage(chatId, { 
                text: currentText,
                edit: startMsg.key
            });
        }
        
        // Add random system information after each major step
        if (Math.random() > 0.6) {
            const sysInfo = [
                `│  ├──== SESSION_TOKEN: ${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
                `│  ├──== HASH: ${Math.random().toString(36).substring(2, 20)}`,
                `│  ├──== ENCRYPTION_KEY: ${Math.random().toString(36).substring(2, 18)}`,
                `│  ├──== IP_ADDR: ${generateIP()}`,
                `│  ├──== MAC_ADDR: ${generateMAC()}`,
                `│  ├──== PID: ${Math.floor(Math.random() * 65535)}`,
                `│  ├──== UID: ${Math.floor(Math.random() * 10000)}`,
                `│  ├──== GID: ${Math.floor(Math.random() * 10000)}`
            ][Math.floor(Math.random() * 8)];
            
            currentText += `${sysInfo}\n`;
            
            await sock.sendMessage(chatId, { 
                text: currentText,
                edit: startMsg.key
            });
            
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Add separator between major steps
        if (i < steps.length - 1) {
            currentText += `│  ════════════════════════════════════════════════════\n`;
        }
        
        // Random delay between steps
        await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 500));
    }

    // Final hacker-style completion message with professional formatting
    const finalMessages = [
        `│\n└──[ ACCESS GRANTED ]────────────────────────────────────\n\n` +
        `╔══════════════════════════════════════════════════════════╗\n` +
        `║  ✅ HACK COMPLETE                                        ║\n` +
        `╚══════════════════════════════════════════════════════════╝\n\n` +
        `TARGET: ${target}\n` +
        `STATUS: COMPROMISED\n` +
        `──────────────────────────────────────────────────────────\n\n` +
        `📁 EXTRACTED DATA:\n` +
        `   ├──== PASSWORDS: 2,547 FOUND\n` +
        `   ├──== CONTACTS: 1,847 SYNCED\n` +
        `   ├──== PHOTOS: 2,341 DOWNLOADED\n` +
        `   ├──== VIDEOS: 347 DOWNLOADED\n` +
        `   ├──== MESSAGES: 12,543 LOGGED\n` +
        `   ├──== LOCATION: TRACKED\n` +
        `   ├──== CAMERA: ACCESSED\n` +
        `   ├──== MICROPHONE: ACTIVE\n` +
        `   ├──== BANKING: 3 ACCOUNTS\n` +
        `   └──== CRYPTO: 2 WALLETS\n\n` +
        `🔐 BACKDOOR: INSTALLED (PERSISTENT)\n` +
        `🌐 REMOTE ACCESS: ENABLED\n` +
        `🕵️ FORENSICS: BYPASSED\n\n` +
        `⚠️  DISCLAIMER: This is a simulation for entertainment purposes only.`,

        `│\n└──[ SYSTEM COMPROMISED ]──────────────────────────────────\n\n` +
        `╔══════════════════════════════════════════════════════════╗\n` +
        `║  🔥 TARGET SUCCESSFULLY HACKED 🔥                        ║\n` +
        `╚══════════════════════════════════════════════════════════╝\n\n` +
        `TARGET: ${target}\n` +
        `──────────────────────────────────────────────────────────\n\n` +
        `📊 SYSTEM INFORMATION:\n` +
        `   ├──== IP ADDRESS: ${generateIP()}\n` +
        `   ├──== MAC ADDRESS: ${generateMAC()}\n` +
        `   ├──== HOSTNAME: ${['DESKTOP-7F3K9L', 'MACBOOK-PRO', 'GALAXY-S23', 'IPHONE-14PRO'][Math.floor(Math.random() * 4)]}\n` +
        `   ├──== OS: ${['Windows 11 Pro', 'macOS Ventura', 'Android 14', 'iOS 17'][Math.floor(Math.random() * 4)]}\n` +
        `   ├──== BROWSER: ${['Chrome 122', 'Safari 17', 'Firefox 123'][Math.floor(Math.random() * 3)]}\n` +
        `   ├──== LAST ONLINE: ${new Date().toLocaleTimeString()}\n` +
        `   └──== TIMEZONE: UTC+3\n\n` +
        `🔓 ALL SYSTEMS ACCESSED SUCCESSFULLY\n` +
        `🧹 NO TRACES LEFT BEHIND\n\n` +
        `⚠️  THIS WAS A PROFESSIONAL PENETRATION TEST SIMULATION`,

        `│\n└──[ OPERATION SUCCESSFUL ]────────────────────────────────\n\n` +
        `╔══════════════════════════════════════════════════════════╗\n` +
        `║  🎯 TARGET: ${target.padEnd(35)}║\n` +
        `╚══════════════════════════════════════════════════════════╝\n\n` +
        `📂 RETRIEVED FILES:\n` +
        `   ├──== /etc/passwd (CRACKED)\n` +
        `   ├──== /home/user/.ssh/id_rsa\n` +
        `   ├──== /var/www/html/config.php\n` +
        `   ├──== /data/com.whatsapp/databases/msgstore.db\n` +
        `   ├──== /sdcard/DCIM/Camera/*.jpg (2,341 FILES)\n` +
        `   ├──== /sdcard/Movies/*.mp4 (347 FILES)\n` +
        `   ├──== /data/data/com.instagram/cache/*\n` +
        `   └──== /data/data/com.sec.android.app.samsungapps/databases/*\n\n` +
        `🔑 DECRYPTION KEYS:\n` +
        `   ├──== AES-256: 7F3D9A2B4C8E1F5A6D7B9C0E2F4A6D8B\n` +
        `   ├──== RSA-4096: 4A7D2F9B1C8E3F6A4D7B2C9E1F5A8D3B\n` +
        `   └──== SESSION: ${Math.random().toString(36).substring(2, 30).toUpperCase()}\n\n` +
        `💉 BACKDOOR: ${['RAT', 'ROOTKIT', 'KEYLOGGER', 'WEBSHELL'][Math.floor(Math.random() * 4)]} DEPLOYED\n` +
        `🌐 C2 SERVER: ${generateIP()}:${Math.floor(Math.random() * 60000 + 1024)}\n\n` +
        `⚠️  EDUCATIONAL PURPOSE ONLY - NO ACTUAL HACKING PERFORMED - CYPHER NODE MD`
    ];

    const finalMessage = finalMessages[Math.floor(Math.random() * finalMessages.length)];
    
    // Prepare final message options
    const messageOptions = {
        text: finalMessage
    };
    
    if (targetMention) {
        messageOptions.mentions = [targetMention];
    }

    // Add final message
    await sock.sendMessage(chatId, messageOptions);
}

module.exports = hackCommand;