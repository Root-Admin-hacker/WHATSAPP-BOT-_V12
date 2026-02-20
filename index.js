/**
 * 🅡🅞🅞🅣_🅐🅓🅜🅘🅝 🅘 ✅ - A WhatsApp Bot
 * Copyright (c) 2026 ROOT_ADMIN I
 * * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 * * Credits:
 * - Baileys Library by @adiwajshing
 * - Pair Code implementation inspired by TechGod143 & DGXEON
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
    <title>ROOT_ADMIN I ✅ Pairing</title>
    <style>
        body { font-family: Arial, sans-serif; background: #000; color: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .container { background: #111; padding: 30px; border-radius: 12px; border: 1px solid #333; width: 90%; max-width: 400px; text-align: center; }
        h2 { color: #25D366; margin-bottom: 20px; }
        input { width: 100%; padding: 12px; border: 2px solid #333; background: #000; color: #fff; border-radius: 8px; font-size: 16px; box-sizing: border-box; }
        button { background: #25D366; color: #000; border: none; padding: 14px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; width: 100%; margin-top: 20px; }
        .code-box { background: #222; border: 2px dashed #25D366; border-radius: 8px; padding: 20px; margin: 20px 0; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #25D366; }
    </style>
</head>
<body>
    <div class="container">
        <h2>🅡🅞🅞🅣_🅐🅓🅜🅘🅝 🅘 ✅</h2>
        <div id="form-view">
            <input type="tel" id="phone" placeholder="e.g. 254731285839">
            <button onclick="submitNumber()">GET PAIRING CODE</button>
        </div>
        <div id="code-view" style="display:none;">
            <div class="code-box" id="pairCode"></div>
            <p>Enter this code in WhatsApp Linked Devices</p>
        </div>
    </div>
    <script>
        async function submitNumber() {
            const phone = document.getElementById('phone').value.trim();
            const response = await fetch('/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: phone })
            });
            const data = await response.json();
            if (data.success) {
                document.getElementById('form-view').style.display = 'none';
                document.getElementById('pairCode').innerText = data.code;
                document.getElementById('code-view').style.display = 'block';
            }
        }
    </script>
</body>
</html>
        `);
    });

    app.post('/generate', async (req, res) => {
        let phoneNumber = req.body.phoneNumber || req.body.phone;
        phoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        pendingPhoneNumber = phoneNumber;
        
        pairingCodePromise = new Promise((resolve) => {
            global.resolvePairing = (code) => resolve(code);
        });

        const code = await pairingCodePromise;
        res.json({ success: true, code: code });
        pendingPhoneNumber = null;
    });

    webServer = app.listen(PORT, () => {
        console.log(chalk.green(`🌐 Web pairing interface running at http://localhost:${PORT}`));
    });
}

function stopWebServer() {
    if (webServer) { webServer.close(); webServer = null; }
}

const store = require('./lib/lightweight_store')
store.readFromFile()
const settings = require('./settings')

let owner = ["254731285839"]
global.botname = "🅡🅞🅞🅣_🅐🅓🅜🅘🅝 🅘 ✅"; 
global.themeemoji = "•"

async function startXeonBotInc() {
    try {
        let { version } = await fetchLatestBaileysVersion()
        const { state, saveCreds } = await useMultiFileAuthState(`./session`)

        const XeonBotInc = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
            },
        })

        XeonBotInc.ev.on('creds.update', saveCreds)

        // Handle pairing code logic
        if (!XeonBotInc.authState.creds.registered) {
            startWebServer()
            while (!pendingPhoneNumber) await delay(1000)
            let code = await XeonBotInc.requestPairingCode(pendingPhoneNumber)
            if (global.resolvePairing) global.resolvePairing(code)
        }

        XeonBotInc.ev.on('connection.update', async (s) => {
            const { connection } = s
            if (connection == "open") {
                stopWebServer();
                const botNumber = XeonBotInc.user.id.split(':')[0] + '@s.whatsapp.net';
                await XeonBotInc.sendMessage(botNumber, {
                    text: `🤖 🅑🅞🅣 🅒🅞🅝🅝🅔🅒🅣🅔🅓 🅢🅤🅒🅒🅔🅢🅕🅤🅛🅛🅨!\n\n✅ Owner: ROOT_ADMIN I\n✅ Channel: Join via Link`,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363321528766105@newsletter',
                            newsletterName: '🅡🅞🅞🅣_🅐🅓🅜🅘🅝 🅘 ✅',
                            serverMessageId: -1
                        }
                    }
                });
                console.log(chalk.bold.blue(`\n[ 🅡🅞🅞🅣_🅐🅓🅜🅘🅝 🅘 ✅ ]\n`))
                console.log(chalk.magenta(`• YT: 🅡🅞🅞🅣_🅐🅓🅜🅘🅝 🅘 ✅`))
                console.log(chalk.magenta(`• GITHUB: Root-Admin-hacker`))
                console.log(chalk.magenta(`• WA: 254731285839`))
            }
        })

        XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            await handleMessages(XeonBotInc, chatUpdate, true).catch(async (err) => {
                await XeonBotInc.sendMessage(mek.key.remoteJid, {
                    text: '❌ Error processing message.',
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363321528766105@newsletter',
                            newsletterName: '🅡🅞🅞🅣_🅐🅓🅜🅘🅝 🅘 ✅'
                        }
                    }
                });
            });
        })

    } catch (error) {
        console.error(error)
        startXeonBotInc()
    }
}

startXeonBotInc()