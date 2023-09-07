export type Product = {
    code: number;
    newPrice: number;
    name: string;
    price: number;
    status: string
}

export type ProductDB = {
    code: number;
    name: string;
    costPrice:  number;
    salesPrice: number;
    id: number;
    packID: number;
    productID: number;
    qty: number;
}