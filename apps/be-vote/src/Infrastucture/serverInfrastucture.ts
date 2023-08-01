import { urls as listofUrls } from "../Const/urls";
import { serverInfo } from "../Model/Types/serverInfo";
import express, { Express, Request, Response, Router } from "express";
import bodyParser from "body-parser";
import { customError } from "../Model/Interface/customError";

export class ServerInfrastucture {
  private connectionString: serverInfo | undefined;
  private app: Express;
  public router: Router;

  constructor(connectionString: serverInfo) {
    this.connectionString = connectionString;
    this.createServerByExpress();
    this.listenServerByExpress();
  }

  createServerByExpress = (): void => {
    this.app = express();
  };

  listenServerByExpress = (): void => {
    this.app.listen(this.connectionString.port, () => {
      console.log(`Server listening on port ${this.connectionString.port}`);
    });

    this.createMiddleware();
  };

  createMiddleware = (): void => {
    this.router = express.Router({ caseSensitive: true });

    this.router.use(function (req, res, next) {
      if (req.url == "/favicon.ico") {
        return res.status(204).end();
      } else if (!listofUrls.includes(req.url!.split("?")[0])) {
        next(new customError(500, "Server Error!"));
      }
      next();
    });

    // logger
    this.app.use(this.myLogger);

    //apply header and set cors
    this.setResponseHeader();

    //parse request as json
    this.app.use(bodyParser.json());

    // //use middleware handle requests
    this.app.use(this.router);

    //use error
    this.app.use(this.error);
  };

  setResponseHeader = (): void => {
    this.app.use((req, res, next) => {
      res.setHeader("Access-Control-Request-Method", "*");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PATCH, DELETE"
      );
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Content-Type", "application/json");
      next();
    });
  };

  myLogger = function (req, res, next) {
    console.log("%s %s %s %s", req.method, req.url, req.path, req.query);
    next();
  };

  error = (err: customError, req, res, next) => {
    console.error(err);
    // respond with 400 "Bad Request".
    res
      .status(err.statusCode)
      .send({ status: err.statusCode, message: err.message });
  };
}
