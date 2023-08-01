import { RedisClientType, createClient } from "redis";
import { serverInfo } from "../Model/Types/serverInfo";
import { voteOption } from "../Model/Types/voteOption";
import { createVote } from "../Model/Types/createVote";

export class RedisInitilization {
  public redisClient: RedisClientType;
  private connectionString;
  private db: string;

  constructor(connectionString: serverInfo) {
    this.connectionString = {
      url: connectionString.host + ":" + connectionString.port,
    };
    this.db = connectionString.database.name;
  }

  connectRedisDB = async () => {
    this.redisClient = createClient(this.connectionString);

    this.redisClient.on("error", function err() {
      throw new Error("An error occured while connecting redis server!");
    });

    this.redisClient.on("connect", () => console.log("RedisDB Initated"));
    await this.redisClient.connect();
  };

  async createSet() {
    if (!Boolean(await !this.checkKeyExist(this.db))) {
      return Boolean(await this.redisClient.sAdd(this.db, ""));
    }
    return false;
  }

  checkKeyExist = async (key: string): Promise<boolean> =>
    !!(await this.redisClient.exists(key));

  getHashKey = async <T>(
    uniqueIdentifier: string,
    requestedField: string
  ): Promise<T> =>
    (await this.redisClient.hGet(uniqueIdentifier, requestedField)) as T;

  removeVote = async (type): Promise<boolean> => {
    if (await this.checkKeyExist(type)) {
      var listOfSameVoteType = (await this.redisClient.keys(
        type + "*"
      )) as string[];
      return await this.deleteKeys(listOfSameVoteType);
    }
    return Promise.resolve(false);
  };

  async deleteKeys(keys: string[]): Promise<boolean> {
    return await this.redisClient.del(keys).then(async (res) => {
      if (res > 0) {
        return Promise.resolve(
          await Boolean(this.redisClient.sRem(this.db, keys[0].split(":")[0]))
        );
      } else return Promise.resolve(false);
    });
  }

  getAllHashData = async (uniqueIdentifier: string): Promise<voteOption> =>
    JSON.parse(
      JSON.stringify(await this.redisClient.hGetAll(uniqueIdentifier))
    );

  getMembersofKey = async <T>(type: string): Promise<T> =>
    (await this.redisClient.sMembers(type)) as T;

  retrieveRequestedVoteData = async (type: string) => {
    let voteOpt: voteOption[] = [];
    if (await this.checkKeyExist(type)) {
      for (const element of await this.getMembersofKey<string[]>(type)) {
        voteOpt.push(await this.getAllHashData(element));
      }
      return {
        type: type,
        options: voteOpt,
      } as createVote;
    }
    return;
  };

  async insertVote(
    element: voteOption,
    type: string,
    index: number,
    uniqueIdentifier: string
  ) {
    var result: boolean = true;
    try {
      element.id = index + 1;
      //insert once vote type
      if (index == 0) {
        if (!Boolean(await this.redisClient.sAdd(this.db, type)))
          result = false;
      }
      if (result) {
        var addVoteType = await this.redisClient.sAdd(type, uniqueIdentifier);
        var addVoteTypeOptions = await this.redisClient.hSet(
          uniqueIdentifier,
          element
        );

        return addVoteType && addVoteTypeOptions;
      }
    } catch (error) {
      return result;
    }
  }

  voteForOption = async (uniqueIdentifier: string): Promise<boolean> => {
    let valueOfKey = await this.getHashKey(uniqueIdentifier, this.db);
    if (valueOfKey) {
      await this.redisClient.hSet(uniqueIdentifier, {
        vote: Number(valueOfKey) + 1,
      });
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  };

  async getListofVotes(): Promise<string[]> {
    return (await this.getMembersofKey<string[]>(this.db)).filter(
      (el) => el !== ""
    );
  }
}
