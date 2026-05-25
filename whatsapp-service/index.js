require('dotenv').config()
const {
    makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys')
const express = require('express')
const pino = require('pino')
const fs = require('fs')
const { error } = require('console')



const app = express()
app.use(express.json())

const LARAVEL_URL = process.env.LARAVEL_URL || 'http://localhost:8000'
const apiWhass_URL = 'api/whatsapp/webhook'
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET
const PORT = process.env.PORT

const sessions = {}

async function notifyBack(event, data) {
    try {
        console.log("SENDING TO LARAVEL:", { event, data })  
        await fetch(`${LARAVEL_URL}/${apiWhass_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Webhook-Secret': WEBHOOK_SECRET
            },
            body: JSON.stringify({ event, data })
        })
    } catch (err) {
        console.error('field to notify Laravel', err.message)
    }
}

async function startSocket(userId) {
    const { state, saveCreds } = await useMultiFileAuthState(`./sessions/${userId}`)
    const {version} = await fetchLatestBaileysVersion()

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        browser: ['sawtia AI', 'Chrome', '1.0.0'],
    })
    sessions[userId] = {
        sock,
        currentQR: null,
        sessionState: 'connecting'
    }
    sock.ev.on('connection.update', async (update) => {
        const {qr,connection,lastDisconnect}=update
        const session = sessions[userId]
        if (!session) return;
         console.log('CONNECTION UPDATE:', update)
        if (qr) {
            session.currentQR = qr
            session.sessionState = 'qr_ready'
            console.log(`QR ready for user ${userId}`)
            await notifyBack('qr_ready', {
                user_id: userId,
                qr
            })
        }
        if (connection === 'open') {
            session.currentQR = null
            session.sessionState = 'connected'
            const phone = sock.user.id.replace(/:[0-9]+@/, '@')
            console.log(`User with id ${userId} is connected as ${phone}`)
            await notifyBack('connected', {
                user_id: userId,
                phone
            })
        }
        if (connection === 'close') {
            session.currentQR = null
            session.sessionState = 'disconnected'
            const code = lastDisconnect?.error?.output?.statusCode
            const shouldReconnect = code !== DisconnectReason.loggedOut
            console.log(`User ${userId} disconnected. Code:`, code)
            await notifyBack('disconnected', {
                user_id: userId,
                code
            })
            if (shouldReconnect) {
                delete sessions[userId]
                setTimeout(() => startSocket(userId), 3000)
            } else {
                fs.rmSync(`./sessions/${userId}`, { recursive: true, force: true })
                delete sessions[userId]
            }
        }

    })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('messages.upsert',async({messages,type})=>{
        if(type!=='notify') return
        for(const msg of messages){
            if(msg.key.fromMe) continue
            if(msg.key.remoteJid==='status@broadcast') continue
            const from =msg.key.remoteJid
            const senderPhone = from
                .replace('@s.whatsapp.net','')
                .replace('@g.us','')
            const text=
                msg.message?.conversation ||
                msg.message?.extendedTextMessage?.text ||
                ''
            if(!text.trim()) continue
            console.log(
                `[User ${userId}] Message from ${senderPhone}: ${text}`
            )
            await notifyBack('message_received',{
                user_id:userId,
                from,
                text,
                senderPhone,
                messageId:msg.key.id,
                timestamp: msg.messageTimestamp
            })
        }
    })
}
app.post('/connect',async(req, res)=>{
    const {userId}=req.body
    if(!userId){
        return res.status(400).json({
            error:'Missing userId'
        })
    }
    if(sessions[userId]){
        return res.json({
            success: true,
            message: 'Session already exists'
        })
    }
        await startSocket(userId)
    res.json({
        success: true
    })
})
app.get(`/status/:userId`,(req,res)=>{
    const {userId} =req.params
    const session=sessions[userId]
    if(!session){
        return res.status(404).json({
            error:'Session not found'
        })
    }
    res.json({
        state:session.sessionState,
        phone:session.sock?.user?.id || null,
        qr:session.currentQR
    })
})
app.get(`/qr/:userId`,(req,res)=>{
    const {userId}=req.params
    const session=sessions[userId]
    if(!session){
        return res.status(404).json({
            error:'Session not found'
        })
    }
    if(session.sessionState==='connected'){
        return res.json({
            connected:true
        })
    }
    if(!session.currentQR){
        return res.status(404).json({
            error: 'No QR available yet'
        })
    }
    res.json({
        qr:session.currentQR
    })
})
app.post('/send', async (req, res) => {

    const { userId, to, message } = req.body

    if (!userId || !to || !message) {
        return res.status(400).json({
            error: 'Missing fields'
        })
    }

    const session = sessions[userId]

    if (!session) {
        return res.status(404).json({
            error: 'Session not found'
        })
    }

    if (session.sessionState !== 'connected') {
        return res.status(503).json({
            error: 'WhatsApp not connected'
        })
    }

    try {

        const jid = to.includes('@')
            ? to
            : `${to}@s.whatsapp.net`

        await session.sock.sendMessage(jid, {
            text: message
        })

        res.json({
            success: true
        })

    } catch (err) {

        console.error('Send failed:', err.message)

        res.status(500).json({
            error: err.message
        })
    }
})
app.post('/disconnect', async (req, res) => {

    const { userId } = req.body

    const session = sessions[userId]

    if (!session) {
        return res.status(404).json({
            error: 'Session not found'
        })
    }

    try {

        await session.sock.logout()

        fs.rmSync(`./sessions/${userId}`, {
            recursive: true,
            force: true
        })

        delete sessions[userId]

        res.json({
            success: true
        })

    } catch (err) {

        res.status(500).json({
            error: err.message
        })
    }
})
app.listen(PORT, () => {
    console.log(`WhatsApp microservice running on port ${PORT}`)
})