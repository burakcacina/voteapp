import { envVariables } from "../../Model/Types/envVariables";
import { serverInfo } from "../../Model/Types/serverInfo";

export const config: envVariables = {
  serverUrl: {
    port: 8089,
    host: "localhost",
  } as serverInfo,
  redisUrl: {
    port: 6379,
    host: "redis://localhost",
    database: {
      name: "vote",
      table: "vote",
    },
  } as serverInfo,
  mongodbUrl: {
    port: 27018,
    host: "mongodb://mongoadmin:secret@localhost",
    database: {
      name: "votedb",
      table: "vote",
    },
  } as serverInfo,
};
