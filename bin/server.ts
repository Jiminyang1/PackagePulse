const express = require("express")
const cors = require("cors")

const port = 3030

export function startServer(jsonData) {
    const app = express()
    app.use(
        cors({
            origin: "http://localhost:3000"
        })
    )

    app.get("/", (req, res) => {
        res.json(jsonData)
    })

    console.log('Server is listening on port ' + port)

    app.listen(port)
}
