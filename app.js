require("dotenv/config")
const cors = require("cors")
const express = require("express")
const axios = require("axios")

const HOST = "https://www.wolframcloud.com/obj/douglas.blumeyer/"

const app = express()

app.use(cors())

app.get("*", async (req, res) => {
    const {data} = await axios.post(
        HOST + req.url,
        {},
    )
    res.send(data)
})

app.listen(process.env.PORT)

// "/optimizeGeneratorTuningMap&unparsedT=%5B%3C1%201%200%5D%20%3C0%201%204%5D%7D&tuningSchemeSpec=TILT%20minimax-U"
