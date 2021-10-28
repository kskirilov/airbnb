let properties //we use this var to store a ref to our DB

export default class PropertiesDAO{

    //First method (both methods will be async)
    //1. INJECTDB METHOD - how we initially connect to our DB. We will call this method as soon as our server starts.
    static async injectDB(conn){
        //if reference to properties is already filled, we will just return
        if(properties){
            return
        }
        //but if it is not filled, we will fill it with a reference to that specific DB
        try {
            properties = await conn.db(process.env.PROPREVIEWS_NS).collection("properties")
          } catch (e) {
            console.error(
              `Unable to establish a collection handle in propertiesDAO: ${e}`,
            )
          }
    }

    //Second method
    //Get a list of all the properties in the DB
    static async getProperties({
        //options that we just made up for that method
        filters = null,
        page = 0,
        propertiesPerPage = 20,
    } = {}){
        let query
        if (filters){ //we've set up 3 different filters
            if("name" in filters){
                query = {$text: { $search: filters["name"]}} //$text = "search for a name" (we set up WHERE to search in mongoDB atlas)
            } else if ("cuisine" in filters){
                query = {"cuisine": { $eq: flters["cuisine"]}} //$eq = "search for something equal in CUISINE field"
            } else if ("zipcode" in filters){
                query = {"address.zipcode": {$eq: filters["zipcode"]}} //$eq = "search for something equal in ZIPCODE field"
            }
        }

        let cursor

        try{
            cursor = await properties
                .find(query)
        } catch(e){
            console.error(`Unable to issue find command, ${e}`)
            return { propertiesList: [], totalNumProperties: 0}
        }

        //limits to properties per page, and to get results page number we do "skip"
        const displayCursor = cursor.limit(propertiesPerPage).skip(propertiesPerPage * page)

        try {
            //then, we set the properties list to an array and return the array
            const propertiesList = await displayCursor.toArray()
            const totalNumProperties = await properties.countDocumuments(query) //count documents to get total num of properties in query
            return {propertiesList, totalNumProperties}
        } catch (e){
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            ) 
            return {propertiesList: [], totalNumProperties: 0}
        }
    }
}