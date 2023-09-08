import app from "./app";
import { Request, Response } from "express";
import multer from "multer";
import { Product, ProductDB } from "./model/Product";
import { getProduct, updateProducts } from "./database/productDB";
import { getPack } from "./database/packDB";
import { Pack, PackDB } from "./model/Pack";
import readableCSV from "./util/readbleCSV";

const multerConfig = multer();

app.post(
  "/",
  multerConfig.single("file"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file?.buffer;

      const msgValidate = "VALIDADO";

      const productsList: Product[] = await readableCSV(file);
      const product: Product = productsList[0];

      if (productsList.length > 1) {
        productsList[0].status = "Formato de arquivo inválido";
      } else if (typeof product.code !== "number") {
        productsList[0].status = "Código do produto inválido";
      } else {
        const searchProduct: ProductDB = (await getProduct(product.code))[0];
        const searchPack: PackDB[] = await getPack(product.code);

        if (!searchProduct) {
          productsList[0].status = "Produto não encontrado na base de dados.";
        } else {
          productsList[0].code = searchProduct.code;
          productsList[0].name = searchProduct.name;
          productsList[0].price = searchProduct.salesPrice;

          if (typeof product.newPrice !== "number") {
            productsList[0].status = "Valor inválido \n";
          } else if (product.newPrice < searchProduct.costPrice) {
            productsList[0].status = `O valor a ser atualizado está abaixo do custo do produto.\n Custo do produto = ${searchProduct.costPrice}`;
          } else if (
            product.newPrice >
            searchProduct.salesPrice + searchProduct.salesPrice * 0.1
          ) {
            productsList[0].status =
              "A alteração de valor não deve estar acima de 10%";
          } else {
            if (searchProduct.packID) {
              const pack: ProductDB = (
                await getProduct(searchProduct.packID)
              )[0];
              const packProducts: PackDB[] = await getPack(
                searchProduct.packID
              );

              let sum = 0;
              for (let p of packProducts) {
                if (p.productID == product.code) {
                  sum += p.qty * product.newPrice;
                } else {
                  sum += p.qty * p.salesPrice;
                }
              }

              productsList[0].status = msgValidate;

              productsList.push({
                code: pack.code,
                newPrice: Number(sum.toFixed(2)),
                name: pack.name,
                price: pack.salesPrice,
                status: msgValidate,
              });
            } else {
              if (searchPack.length == 0) {
                productsList[0].status = msgValidate;
              } else if (searchPack.length > 1) {
                productsList[0].status =
                  "Este pacote tem mais de um produto associado.";
              } else {
                productsList[0].status = msgValidate;

                const productPack: ProductDB[] = await getProduct(
                  searchPack[0].productID
                );

                productsList.push({
                  code: productPack[0].code,
                  newPrice: Number(
                    (product.newPrice / searchPack[0].qty).toFixed(2)
                  ),
                  name: productPack[0].name,
                  price: productPack[0].costPrice,
                  status: msgValidate,
                });
              }
            }
          }
        }
      }

      res.send(productsList);
    } catch (error: any) {
      res.send(error.messase);
    }
  }
);

app.put("/", async (req: Request, res: Response) => {
  try {
    const products = req.body;

    for (let p of products) {
      await updateProducts(p);
    }

    res.send({message: "Preço(s) atualizado(s) com sucesso!"});
    
  } catch (error: any) {
    res.send(error.messase);
  }
});
