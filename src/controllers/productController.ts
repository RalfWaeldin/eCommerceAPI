import type { RequestHandler, Response } from "express";
import { writeLogFileEntry, hashPassword } from "#utils";
import { Product, Category } from "#models";

export const allProducts: RequestHandler = async (req, res, next) => {
  writeLogFileEntry(
    `Enter allProducts`,
    res,
    3,
    "productController: allProducts",
  );

  const products = await Product.find();
  if (products.length > 0) {
    writeLogFileEntry(
      `${products.length} Products found`,
      res,
      2,
      "productController: allProducts",
    );
    res.json(products);
  } else {
    writeLogFileEntry(
      `No allProducts found`,
      res,
      2,
      "productController: allProducts",
    );
    res.json({ message: `No products found` });
  }
  next();
};

export const productById: RequestHandler = async (req, res, next) => {
  writeLogFileEntry(
    `Enter productById`,
    res,
    3,
    "productController: productById",
  );

  const {
    params: { id },
  } = req;

  const product = await Product.findOne({ _id: id });
  if (!product) throw new Error(`No product with id '${id}' found`);

  writeLogFileEntry(
    `Product '${id}' found`,
    res,
    2,
    "productController: productById",
  );
  res.json(product);
  next();
};

export const productsByCategoryName: RequestHandler = async (
  req,
  res,
  next,
) => {
  writeLogFileEntry(
    `Enter productsByCategory`,
    res,
    3,
    "productController: productsByCategoryName",
  );

  const { body } = req;
  const { categoryname } = body;

  const category = await Category.findOne({ categoryname: categoryname });
  if (!category) throw new Error(`Unknown category '${categoryname}'`);

  const categoryId = category._id;

  const products = await Product.find({ category_id: categoryId });
  if (products.length > 0) {
    writeLogFileEntry(
      `${products.length} Products found for category '${categoryname}'`,
      res,
      2,
      "productController: productsByCategoryName",
    );
    res.json(products);
  } else {
    writeLogFileEntry(
      `No products found for category '${categoryname}'`,
      res,
      2,
      "productController: productsByCategoryName",
    );
    res.json({ message: `No products found for category '${categoryname}'` });
  }
  next();
};

export const addProduct: RequestHandler = async (req, res, next) => {
  writeLogFileEntry(
    `Enter addProducts`,
    res,
    3,
    "productController: addProducts",
  );

  const { body } = req;

  const newProduct = await Product.create(body);

  if (!newProduct)
    throw new Error(`Adding new Product failed`, {
      cause: { status: 400 },
    });

  writeLogFileEntry(
    `Product "${newProduct.materialname}" inserted`,
    res,
    3,
    "productController: addProducts",
  );
  res.json(newProduct);
  next();
};
