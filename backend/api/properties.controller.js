import PropertiesDAO from "../dao/propertiesDAO.js"

export default class PropertiesController{
    static async apiGetProperties(req, res, next){
        //equals whatever value is passed through the URL (check if it exists, if it does, convert to int), else default 20
        const propertiesPerPage = req.query.propertiesPerPage ? parseInt(req.query.propertiesPerPage, 10) : 20
        //if we passed a page number with URL then convert it to int, else page is just gonna be 0
        const page = req.query.page ? parseInt(req.query.page, 10) : 0

        //filters start off as an empty object
        let filters = {}
            //but if we the cuisine QUERY STRING, then filter.cuisine is gonna get set to the query string
            if (req.query.cuisine){
                filters.cuisine = req.query.cuisine
            //same
            } else if (req.query.zipcode){
                filters.zipcode = req.query.zipcode
            //same
            } else if (req.query.name){
                filters.name = req.query.name
            }

                                                //calling get restaurants, passing the filters, page, restaurants per page        
    const { propertiesList, totalNumProperties} = await PropertiesDAO.getProperties({
        //going to return propertiesList and the total Num of Restaurants
        filters,
        page,
        propertiesPerPage,
    })

    let response = {
        properties: propertiesList,
        page: page,
        filters: filters,
        entries_per_page: propertiesPerPage,
        total_results: totalNumProperties,
    }
    res.json(response)
    }

    static async apiGetPropertiesById(req, res, next){
        try{
            let id = req.params.id || {}
            let property = await PropertiesDAO.getPropertyById(id)
            if(!restaurant){
                res.status(404).json({error:"Not found"})
                return
            }
            res.json(property)
        } catch (e){
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }

    static async apiGetPropertyTypes(req, res, next){
        try{
            let propertyTypes = await PropertiesDAO.getPropertyTypes()
            res.json(property_types)
        } catch(e){
            console.log(`api, ${e}`)
            res.status(500).json({error: e})
        }
    }
}

