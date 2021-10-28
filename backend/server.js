import express from "express"
import cors from "cors"
import properties from "./api/properties.route.js"

const app = express()

app.use(cors())
app.use(express.json()) //our server can accept JSON in body of request (allows it to read JSON)

app.use("/api/v1/properties", properties)
app.use("*", (req, res) => res.status(404).json({error: "not found"}))

export default app