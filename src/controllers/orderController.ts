import type { RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_JWT_SECRET } from "#config";
import { writeLogFileEntry } from "#utils";
import { Order } from "#models";
import { type orderCreateSchema } from "#schemas";

export const allOrders: RequestHandler = async (req, res, next) => {
  writeLogFileEntry(`Enter allOrders`, res, 3, "productController: allOrders");

  const orders = await Order.find();
  if (orders.length > 0) {
    writeLogFileEntry(
      `${orders.length} Orders found`,
      res,
      2,
      "productController: allOrders",
    );
    res.json(orders);
  } else {
    writeLogFileEntry(
      `No Orders found`,
      res,
      2,
      "productController: allOrders",
    );
    res.json({ message: `No orders found` });
  }
};

export const addOrder: RequestHandler = async (req, res, next) => {
  writeLogFileEntry(`Enter addOrder`, res, 3, "productController: addOrder");

  const { accessToken } = req.cookies;
  if (!accessToken)
    throw new Error("Not authenticated", { cause: { status: 401 } });

  writeLogFileEntry(
    `Access Token found`,
    res,
    3,
    "productController: addOrder",
  );
  const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET) as jwt.JwtPayload;
  if (!decoded.sub) throw new Error();

  writeLogFileEntry(
    `decode Access Token`,
    res,
    3,
    "productController: addOrder",
  );
  const user = {
    id: decoded.sub,
    roles: decoded.roles,
    active: decoded.active,
  } as { id: string; roles: string[]; active: boolean };

  writeLogFileEntry(
    `User taken from Token`,
    res,
    3,
    "productController: addOrder",
  );
  const userid = user.id;
  const { body } = req;
  /*
  const orderrequest = {
    user_id: userid,
    orders: body.orders,
  };
*/

  const orderrequest: OrderRequestBody = {
    user_id: userid,
    orders: body.orders,
  };

  const newOrder = await Order.create(orderrequest);

  if (!newOrder)
    throw new Error(`Insert Order failed`, { cause: { status: 400 } });

  writeLogFileEntry(
    `Order '${newOrder._id}' inserted.`,
    res,
    2,
    "productController: addOrder",
  );

  res.json(newOrder);
  next();
};
