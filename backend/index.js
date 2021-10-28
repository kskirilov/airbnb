//connect to DB and start the server
import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import PropertiesDAO from "./dao/propertiesDAO.js"

dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000 //to access an env variable, we do process.env and whatever we specified int he .env file

MongoClient.connect(
    process.env.PROPREVIEWS_DB_URI,
    {
        maxPoolSize: 50, //people to connect at a time
        wtimeoutMS: 2500,
        useNewUrlParser: true
    }
)
.catch(err =>{
    console.error(err.stack)
    process.exit(1)
})
//after we have connected to the DB and checked for errors, we can do something
.then(async client => {
    await PropertiesDAO.injectDB(client)
    app.listen(port, () => {
        console.log(`listening on port ${port}`)
    })//this is how we start our webserver
})