import "#db";
import express, { type Request } from "express";
import { authRoutes } from "#routes";
import { errorHandler } from "#middleware";
import cookieParser from "cookie-parser";

/////////////////////////////////////////////////////////////////////////////////////
// Express configuration and start
/////////////////////////////////////////////////////////////////////////////////////
const app = express();
const port = process.env.PORT || 8080;
app.use(express.json(), cookieParser());

/////////////////////////////////////////////////////////////////////////////////////
// Routes
/////////////////////////////////////////////////////////////////////////////////////
app.use("/auth", authRoutes);
//app.use("/users", userRoutes);

//-----------------------------------------------------------------------------------
// Default Route
//-----------------------------------------------------------------------------------
app.get("/", (req: Request, res) =>
  res.send(`Server is running on http://localhost:${port}`),
);

//-----------------------------------------------------------------------------------
// unknown route
//-----------------------------------------------------------------------------------
app.use("/*splat", (req: Request, res) => {
  throw new Error(`Route ${req.baseUrl} not defined`, { cause: 404 });
});

/////////////////////////////////////////////////////////////////////////////////////////////
// error handle middleware
/////////////////////////////////////////////////////////////////////////////////////////////
app.use(errorHandler);

/////////////////////////////////////////////////////////////////////////////////////////////
// listener
/////////////////////////////////////////////////////////////////////////////////////////////
app.listen(port, () =>
  console.log(`\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`),
);
