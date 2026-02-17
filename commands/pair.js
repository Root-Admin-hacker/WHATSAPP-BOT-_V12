const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");

async function pairCommand(sock, chatId, message, q) {
    try {

        if (!q) {
            return await sock.sendMessage(chatId, {
                text: "Usage:\n.pair 254712345678"
            });
        }

        // Clean number
        const number = q.replace(/[^0-9]/g, "");

        if (number.length < 9 || number.length > 15) {
            return await sock.sendMessage(chatId, {
                text: "Invalid phone number format ❌"
            });
        }

        await sock.sendMessage(chatId, {
            text: "⏳ Generating pairing code..."
        });

        // Session folder
        const sessionPath = path.join(__dirname, "../pair_sessions", number);

        if (!fs.existsSync(sessionPath)) {
            fs.mkdirSync(sessionPath, { recursive: true });
        }

        // Auth
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        // Create temp socket
        const tempSock = makeWASocket({
            auth: state,
            printQRInTerminal: false,
            browser: ["ZashBot", "Chrome", "1.0"]
        });

        tempSock.ev.on("creds.update", saveCreds);

        // Wait for connection
        tempSock.ev.on("connection.update", async (update) => {

            const { connection, pairingCode } = update;

            if (pairingCode) {

                await sock.sendMessage(chatId, {
                    text: `✅ Pairing Code:\n\n${pairingCode}\n\nOpen WhatsApp → Linked Devices → Link with phone number`
                });

            }

            if (connection === "close") {

                fs.rmSync(sessionPath, { recursive: true, force: true });

            }
        });

        // Request pairing
        await tempSock.requestPairingCode(number);

    } catch (err) {

        console.error(err);

        await sock.sendMessage(chatId, {
            text: "❌ Failed to generate pairing code"
        });

    }
}

module.exports = pairCommand;
