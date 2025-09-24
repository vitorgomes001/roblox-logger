const express = require('express')
const fetch = require('node-fetch')
const app = express()
app.use(express.json())

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK
const API_TOKEN = process.env.API_TOKEN

app.post('/log', async (req, res) => {
  const { token, playerName, userId, placeId, jobId, timestamp } = req.body

  if (token !== API_TOKEN) {
    return res.status(403).json({ ok: false, error: "Token inválido" })
  }

  const embed = {
    username: "Game-Logger",
    embeds: [{
      title: "Script usado no jogo",
      color: 0x00ff99,
      fields: [
        { name: "Player", value: playerName || "?", inline: true },
        { name: "UserId", value: String(userId || "?"), inline: true },
        { name: "PlaceId", value: String(placeId || "?"), inline: true },
        { name: "JobId", value: String(jobId || "?"), inline: false },
        { name: "Hora (UTC)", value: new Date((timestamp||Date.now()/1000)*1000).toISOString(), inline: false }
      ]
    }]
  }

  await fetch(DISCORD_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(embed)
  })

  res.json({ ok: true })
})

const PORT = process.env.PORT || 10000
app.listen(PORT, () => console.log("Rodando na porta " + PORT))
