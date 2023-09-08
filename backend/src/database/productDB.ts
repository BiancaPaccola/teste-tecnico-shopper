import { connection } from "../database/connection";
import { Product, ProductDB } from "../model/Product"

export async function getProduct(code: number): Promise<any> {
    try {
        const result: ProductDB[] = await connection.raw(`
            SELECT code, name, cost_price AS 'costPrice', sales_price AS 'salesPrice', 
            id, pack_id AS packID, product_id AS 'productID', qty 
            FROM products
            LEFT JOIN packs ON products.code = packs.product_id
            where code = ${code};
        `)

        return result[0];

    } catch (error: any) {
        throw new error(error.message || error.sqlMessage);
    }
}

export async function updateProducts(products: Product): Promise<any> {
    try {
        await connection.raw(`
            UPDATE products
            SET sales_price = ${products.newPrice}
            WHERE code = ${products.code}
        `)
    } catch (error:any) {
        throw new error(error.message || error.sqlMessage);
    }
}