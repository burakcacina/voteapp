import { serverInfo } from "./serverInfo";

export type envVariables = {
  serverUrl: serverInfo;
  redisUrl: serverInfo;
  mongodbUrl: serverInfo;
};
