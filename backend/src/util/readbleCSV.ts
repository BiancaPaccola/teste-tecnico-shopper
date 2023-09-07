import { Readable } from "stream"
import readline from "readline"
import { Product } from "../model/Product"

async function readableCSV(file: any): Promise<Product[]> {
    try {
        const readableFile = new Readable()
        readableFile.push(file)
        readableFile.push(null)
        const products = readline.createInterface({
            input: readableFile
        })

        let productsList: Product[] = []
    
        for await (let line of products) {
            const productLineSplit = line.split(",")
            productsList.push({
                code: Number(productLineSplit[0]),
                newPrice: parseFloat(Number(productLineSplit[1]).toFixed(2)),
                name: "",
                price: 0,
                status: ""
            })
        }
    
        return productsList.splice(1,1)
        
    } catch (error:any) {
        throw new error(error.message)
    }
}

export default readableCSV