import { envVariables } from "../../Model/Types/envVariables";
import { serverInfo } from "../../Model/Types/serverInfo";

export const config: envVariables = {
  serverUrl: {
    port: 80,
    host: "0.0.0.0",
  } as serverInfo,
  redisUrl: {
    port: 6379,
    host: "redis://10.105.0.1",
    database: {
      name: "vote",
      table: "vote",
    },
  } as serverInfo,
  mongodbUrl: {
    port: 27018,
    host: "mongodb://mongoadmin:secret@10.105.0.3",
    database: {
      name: "votedb",
      table: "vote",
    },
  } as serverInfo,
};
