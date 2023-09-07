import { connection } from "./connection";

const createTables = async() => {
    await connection.raw(`
        CREATE TABLE IF NOT EXISTS products( 
            code bigint PRIMARY KEY,
            name varchar(100) NOT NULL,
            cost_price decimal(9,2) NOT NULL,
            sales_price decimal(9,2) NOT NULL
        );
    
        CREATE TABLE IF NOT EXISTS packs(
            id bigint AUTO_INCREMENT PRIMARY KEY, # id primario da tabela
            pack_id bigint NOT NULL,
            product_id bigint NOT NULL,
            qty bigint NOT NULL,
            CONSTRAINT FOREIGN KEY (pack_id) REFERENCES products(code),
            CONSTRAINT FOREIGN KEY (product_id) REFERENCES products(code)
        );
    `)
    .then(() => {
        console.log("Tables packs and products created successfully!")
        insertData();
    })
    .catch((error: any) => console.log(error.sqlMessage || error.message))

}

const insertData = async() => {
    await connection.raw(`
        INSERT INTO products VALUES (16,'AZEITE  PORTUGUÊS  EXTRA VIRGEM GALLO 500ML',18.44,20.49);
        INSERT INTO products VALUES (18,'BEBIDA ENERGÉTICA VIBE 2L',8.09,8.99);
        INSERT INTO products VALUES (19,'ENERGÉTICO  RED BULL ENERGY DRINK 250ML',6.56,7.29);
        INSERT INTO products VALUES (20,'ENERGÉTICO RED BULL ENERGY DRINK 355ML',9.71,10.79);
        INSERT INTO products VALUES (21,'BEBIDA ENERGÉTICA RED BULL RED EDITION 250ML',10.71,11.71);
        INSERT INTO products VALUES (22,'ENERGÉTICO  RED BULL ENERGY DRINK SEM AÇÚCAR 250ML',6.74,7.49);
        INSERT INTO products VALUES (23,'ÁGUA MINERAL BONAFONT SEM GÁS 1,5L',2.15,2.39);
        INSERT INTO products VALUES (24,'FILME DE PVC WYDA 28CMX15M',3.59,3.99);
        INSERT INTO products VALUES (26,'ROLO DE PAPEL ALUMÍNIO WYDA 30CMX7,5M',5.21,5.79);
        INSERT INTO products VALUES (1000,'BEBIDA ENERGÉTICA VIBE 2L - 6 UNIDADES',48.54,53.94);
        INSERT INTO products VALUES (1010,'KIT ROLO DE ALUMINIO + FILME PVC WYDA',8.80,9.78);
        INSERT INTO products VALUES (1020,'SUPER PACK RED BULL VARIADOS - 6 UNIDADES',51.81,57.00);
        
        INSERT INTO packs (pack_id,product_id, qty) VALUES (1000,18,6);
        INSERT INTO packs (pack_id,product_id, qty) VALUES (1010,24,1);
        INSERT INTO packs (pack_id,product_id, qty) VALUES (1010,26,1);
        INSERT INTO packs (pack_id,product_id, qty) VALUES (1020,19,3);
        INSERT INTO packs (pack_id,product_id, qty) VALUES (1020,21,3);
    `)
    .then(() => {
        console.log("Products inserted in the packs and products tables...")
        return connection.destroy()
    })
    .catch((error: any) => console.log(error.sqlMessage || error.message))

}

createTables();

