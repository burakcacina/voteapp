import { envVariables } from "../../Model/Types/envVariables";
import { serverInfo } from "../../Model/Types/serverInfo";

export const config: envVariables = {
  serverUrl: {
    port: 80,
    host: "0.0.0.0",
  } as serverInfo,
  redisUrl: {
    port: 6379,
    host: "redis://host.docker.internal",
    database: {
      name: "vote",
      table: "vote",
    },
  } as serverInfo,
  mongodbUrl: {
    port: 27018,
    host: "mongodb://mongoadmin:secret@host.docker.internal",
    database: {
      name: "votedb",
      table: "vote",
    },
  } as serverInfo,
};
