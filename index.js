/**
 * 🅡🅞🅞🅣_🅐🅓🅜🅘🅝 🅘 ✅ - A WhatsApp Bot
 * Copyright (c) 2026 ROOT_ADMIN I
 */
require('./settings')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const { PHONENUMBER_MCC } = require('@whiskeysockets/baileys/lib/Utils/generics')
const { rmSync, existsSync } = require('fs')
const { join } = require('path')

// ---------- Web Server for Pairing ----------
const express = require('express');
const bodyParser = require('body-parser');

let webServer = null;
let pairingCodePromise = null;
let pendingPhoneNumber = null;

function startWebServer() {
    if (webServer) return;

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
        res.send(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🅡🅞🅞🅣_🅐🅓🅜🅘🅝 🅘 ✅ Pairing</title>
    <style>
        body { font-family: Arial, sans-serif; background: #0a0a0a; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; color: white; }
        .container { background: #1a1a1a; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3); width: 90%; max-width: 400px; text-align: center; border: 1px solid #25D366; }
        h2 { color: #25D366; margin-bottom: 20px; }
        .input-group { margin-bottom: 20px; text-align: left; }
        label { display: block; margin-bottom: 6px; font-weight: 600; color: #ccc; }
        input { width: 100%; padding: 12px; border: 2px solid #333; background: #000; border-radius: 8px; font-size: 16px; box-sizing: border-box; color: white; transition: border 0.3s; }
        input:focus { border-color: #25D366; outline: none; }
        button { background: #25D366; color: black; border: none; padding: 14px 20px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%; transition: background 0.3s; }
        button:hover { background: #1da851; }
        .loading { display: none; margin-top: 20px; }
        .code-box { background: #000; border: 2px dashed #25D366; border-radius: 8px; padding: 20px; margin: 20px 0; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #25D366; }
        .footer { margin-top: 20px; font-size: 12px; color: #888; }
    </style>
</head>
<body>
    <div class="container" id="app">
        <h2>🅡🅞🅞🅣_🅐🅓🅜🅘🅝 🅘 ✅</h2>
        <p>Enter your number with country code.</p>
        <div id="form-view">
            <div class="input-group">
                <label for="phone">Phone Number (e.g. 254731...)</label>
                <input type="tel" id="phone" placeholder="254731285839">
            </div>
            <button onclick="submitNumber()">GET PAIRING CODE</button>
        </div>
        <div id="loading-view" class="loading">
            <p>Stabilizing Connection... Please wait 10s</p>
        </div>
        <div id="code-view" style="display:none;">
            <div class="code-box" id="pairCode"></div>
            <p style="margin-top:15px; font-size:14px;">Open WhatsApp → Settings → Linked Devices → Link a Device</p>
        </div>
        <div id="error-view" class="error" style="display:none; color: red;"></div>
        <div class="footer">Powered By ROOT_ADMIN I</div>
    </div>
    <script>
        async function submitNumber() {
            const phone = document.getElementById('phone').value.trim().replace(/[^0-9]/g, '');
            if (!phone) return alert('Enter phone number');
            document.getElementById('form-view').style.display = 'none';
            document.getElementById('loading-view').style.display = 'block';
            try {
                const response = await fetch('/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phoneNumber: phone })
                });
                const data = await response.json();
                document.getElementById('loading-view').style.display = 'none';
                if (data.success) {
                    document.getElementById('pairCode').innerText = data.code;
                    document.getElementById('code-view').style.display = 'block';
                } else {
                    alert('Error: ' + data.error);
                    location.reload();
                }
            } catch (err) { alert('Network error'); location.reload(); }
        }
    </script>
</body>
</html>`);
    });

    app.post('/generate', async (req, res) => {
        let phoneNumber = req.body.phoneNumber?.replace(/[^0-9]/g, '');
        if (!phoneNumber) return res.json({ success: false, error: 'Phone number required' });
        
        pendingPhoneNumber = phoneNumber;
        pairingCodePromise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Timeout')), 60000);
            global.resolvePairing = (code) => { clearTimeout(timeout); resolve(code); };
            global.rejectPairing = (err) => { clearTimeout(timeout); reject(err); };
        });

        try {
            const code = await pairingCodePromise;
            res.json({ success: true, code });
        } catch (err) {
            res.json({ success: false, error: err.message });
        } finally {
            pendingPhoneNumber = null;
        }
    });

    webServer = app.listen(PORT, () => console.log(chalk.green(`🌐 Server running at http://localhost:${PORT}`)));
}

function stopWebServer() {
    if (webServer) { webServer.close(); webServer = null; }
}

// ---------- Store & Memory ----------
const store = require('./lib/lightweight_store')
store.readFromFile()
const settings = require('./settings')
setInterval(() => store.writeToFile(), 10000)

// RAM Management
setInterval(() => { if (global.gc) global.gc() }, 60000)
setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 450) { console.log('⚠️ High RAM, Restarting...'); process.exit(1) }
}, 30000)

let phoneNumber = "254731285839"
global.botname = "🅡🅞🅞🅣_🅐🅓🅜🅘🅝 🅘 ✅"
const pairingCode = true

async function startXeonBotInc() {
    try {
        let { version } = await fetchLatestBaileysVersion()
        const { state, saveCreds } = await useMultiFileAuthState(`./session`)
        const msgRetryCounterCache = new NodeCache()

        const XeonBotInc = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
            },
            msgRetryCounterCache,
            connectTimeoutMs: 60000,
            defaultQueryTimeoutMs: 0,
            keepAliveIntervalMs: 10000,
            generateHighQualityLinkPreview: true,
        })

        XeonBotInc.ev.on('creds.update', saveCreds)
        store.bind(XeonBotInc.ev)

        // Pairing Logic with Fix
        if (pairingCode && !XeonBotInc.authState.creds.registered) {
            startWebServer()
            while (!pendingPhoneNumber) await delay(1000)
            
            console.log(chalk.yellow("⏳ Stabilizing connection for 10s..."))
            await delay(10000) // This prevents the 'Connection Closed' error

            try {
                let code = await XeonBotInc.requestPairingCode(pendingPhoneNumber)
                code = code?.match(/.{1,4}/g)?.join("-") || code
                if (global.resolvePairing) global.resolvePairing(code)
                console.log(chalk.black.bgGreen(` CODE: ${code} `))
            } catch (e) {
                if (global.rejectPairing) global.rejectPairing(e)
            }
        }

        XeonBotInc.ev.on('connection.update', async (s) => {
            const { connection, lastDisconnect } = s
            if (connection === 'open') {
                stopWebServer()
                console.log(chalk.green(`\n✅ 🅡🅞🅞🅣_🅐🅓🅜🅘🅝 🅘 ✅ CONNECTED`))
                console.log(chalk.cyan(`OWNER: 254731285839`))
            }
            if (connection === 'close') {
                let reason = new Boom(lastDisconnect?.error)?.output.statusCode
                if (reason !== DisconnectReason.loggedOut) startXeonBotInc()
                else { rmSync('./session', { recursive: true, force: true }); startXeonBotInc(); }
            }
        })

        XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
            try {
                const mek = chatUpdate.messages[0]
                if (!mek.message) return
                await handleMessages(XeonBotInc, chatUpdate, true)
            } catch (err) { console.error(err) }
        })

        // Anti-Call Logic
        XeonBotInc.ev.on('call', async (calls) => {
            for (const call of calls) {
                if (call.status === 'offer') {
                    await XeonBotInc.rejectCall(call.id, call.from)
                    await XeonBotInc.sendMessage(call.from, { text: '📵 *🅡🅞🅞🅣_🅐🅓🅜🅘🅝 🅘:* Calls are blocked.' })
                    await XeonBotInc.updateBlockStatus(call.from, 'block')
                }
            }
        })

        XeonBotInc.decodeJid = (jid) => {
            if (!jid) return jid
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {}
                return decode.user && decode.server && decode.user + '@' + decode.server || jid
            } else return jid
        }

        return XeonBotInc
    } catch (error) {
        console.error(error)
        await delay(5000); startXeonBotInc()
    }
}

startXeonBotInc()

// Hot Reload
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})