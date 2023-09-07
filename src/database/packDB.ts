import { connection } from "../database/connection";
import { PackDB } from "../model/Pack";

export async function getPack(code: number): Promise<any> {
    try {
        const result: PackDB[] = await connection.raw(`
            SELECT id, pack_id AS 'packID', product_id AS 'productID', qty, code, name, 
            cost_price AS 'costPrice', sales_price AS 'salesPrice' 
            FROM packs
            left JOIN products ON packs.product_id = products.code
            where pack_id = ${code};
        `)

        return result[0];
        
    } catch (error:any) {
        throw new error(error.message || error.sqlMessage);
    }
}