export type Pack = {
    code: number;
    newPrice: number;
}

export type PackDB = {
    id: number;
    packID: number;
    productID: number;
    qty: number;
    code: number;
    name: string;
    costPrice: number;
    salesPrice: number;
}