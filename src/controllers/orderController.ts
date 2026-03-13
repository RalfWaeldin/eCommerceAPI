import type { RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_JWT_SECRET } from "#config";
import { writeLogFileEntry } from "#utils";
import { Order } from "#models";
import { type orderCreateSchema } from "#schemas";

export const allOrders: RequestHandler = async (req, res, next) => {
  writeLogFileEntry(`Enter allOrders`, res, 3, "orderController: allOrders");

  const orders = await Order.find();
  if (orders.length > 0) {
    writeLogFileEntry(
      `${orders.length} Orders found`,
      res,
      2,
      "orderController: allOrders",
    );
    res.json(orders);
  } else {
    writeLogFileEntry(`No Orders found`, res, 2, "orderController: allOrders");
    res.json({ message: `No orders found` });
  }
};

export const myOrders: RequestHandler = async (req, res, next) => {
  writeLogFileEntry(`Enter myOrders`, res, 3, "orderController: myOrders");

  const { accessToken } = req.cookies;
  if (!accessToken)
    throw new Error("Access token is required", { cause: { status: 401 } });
  writeLogFileEntry(`Token found`, res, 3, "orderController: myOrders");

  try {
    const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET);

    if (!decoded.sub)
      throw new Error("Invalid or expired access token", {
        cause: { status: 403 },
      });
    writeLogFileEntry(`Decoded`, res, 3, "orderController: myOrders");

    console.log("DECODED SUB:", decoded.sub);

    const orders = await Order.find({ user_id: decoded.sub });
    if (orders.length > 0) {
      writeLogFileEntry(
        `${orders.length} Orders found`,
        res,
        2,
        "orderController: myOrders",
      );
      res.json(orders);
    } else {
      writeLogFileEntry(`No Orders found`, res, 2, "orderController: myOrders");
      res.json({ message: `No orders found` });
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new Error("Expired access token", {
          cause: { status: 401, code: "ACCESS_TOKEN_EXPIRED" },
        }),
      );
    }

    return next(new Error("Invalid access token", { cause: { status: 401 } }));
  }
};

export const addOrder: RequestHandler = async (req, res, next) => {
  writeLogFileEntry(`Enter addOrder`, res, 3, "orderController: addOrder");

  const { accessToken } = req.cookies;
  if (!accessToken)
    throw new Error("Not authenticated", { cause: { status: 401 } });

  writeLogFileEntry(`Access Token found`, res, 3, "orderController: addOrder");
  const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET) as jwt.JwtPayload;
  if (!decoded.sub) throw new Error();

  writeLogFileEntry(`decode Access Token`, res, 3, "orderController: addOrder");
  const user = {
    id: decoded.sub,
    roles: decoded.roles,
    active: decoded.active,
  } as { id: string; roles: string[]; active: boolean };

  writeLogFileEntry(
    `User taken from Token`,
    res,
    3,
    "orderController: addOrder",
  );
  const userid = user.id;
  const { body } = req;

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
    "orderController: addOrder",
  );

  res.json(newOrder);
  next();
};
