require("dotenv/config")
const cors = require("cors")
const express = require("express")
const axios = require("axios")

const HOST = "https://www.wolframcloud.com/obj/douglas.blumeyer"

const app = express()

app.use(cors())

app.get("/", (req, res) => res.send("Hello world!"))

app.get("*", (req, res) => {
    console.log("you hit me")
    axios.post(
        HOST + req.url,
        {},
    ).then(data => {
        console.log("you tried to send", data.data)
        res.send(data.data)
    }).catch(e => {}) // Wolfram works, but throws a 401 error every time. If uncaught, Render dies and doesn't respond.
})

app.listen(process.env.PORT)

// "/optimizeGeneratorTuningMap?unparsedT=%5B%3C1%201%200%5D%20%3C0%201%204%5D%7D&tuningSchemeSpec=TILT%20minimax-U"
