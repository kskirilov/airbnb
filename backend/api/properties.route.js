import express from "express"
import PropertiesCtrl from "./properties.controller.js"

const router = express.Router() 

router.route("/").get(PropertiesCtrl.apiGetProperties)

export default router