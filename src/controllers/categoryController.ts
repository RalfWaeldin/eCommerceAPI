import type { RequestHandler, Response } from "express";
import { writeLogFileEntry, hashPassword } from "#utils";
import { Category } from "#models";

export const allCategories: RequestHandler = async (req, res, next) => {
  writeLogFileEntry(
    `Enter allCategories`,
    res,
    3,
    "productController: allCategories",
  );

  const categories = await Category.find();
  if (categories.length > 0) {
    writeLogFileEntry(
      `${categories.length} Categories found`,
      res,
      2,
      "productController: allCategories",
    );
    res.json(categories);
  } else {
    writeLogFileEntry(
      `No Categories found`,
      res,
      2,
      "productController: allCategories",
    );
    res.json({ message: `No categories found` });
  }
};

export const addCategory: RequestHandler = async (req, res, next) => {
  writeLogFileEntry(
    `Enter addCategory`,
    res,
    3,
    "productController: addCategory",
  );

  const { body } = req;

  const newCategory = await Category.create(body);

  if (!newCategory)
    throw new Error(`New category could not be created`, {
      cause: { status: 400 },
    });

  writeLogFileEntry(
    `Category "${newCategory.categoryname}" inserted`,
    res,
    2,
    "productController: allCategories",
  );
  res.json(newCategory);
};
