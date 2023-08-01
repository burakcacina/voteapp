import { VoteController } from "./Controller/VoteController";
import { ServerInfrastucture } from "./Infrastucture/serverInfrastucture";
import { RedisInitilization } from "./Infrastucture/redisInitilization";
import { VoteWorker } from "./UOW/VoteWorker";
import { MongodbInitilization } from "./Infrastucture/mongodbIitilization";
import { envVariablesConfig } from "./Const/Config/env";

main();

async function main() {
  try {
    // init server
    var serverConnection = new ServerInfrastucture(
      envVariablesConfig.serverUrl
    );

    // init redis
    var redisInit = new RedisInitilization(envVariablesConfig.redisUrl);
    await redisInit.connectRedisDB();

    //init mongodb
    var mongodbInit = new MongodbInitilization(envVariablesConfig.mongodbUrl);
    await mongodbInit.initMongoDB();

    // vote controller listen request
    VoteController.listenRequests(
      serverConnection.router,
      new VoteWorker(redisInit, mongodbInit)
    );
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
}
