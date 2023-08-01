import { createVote } from "../Model/Types/createVote";
import { voteOption } from "../Model/Types/voteOption";
import { RedisInitilization } from "../Infrastucture/redisInitilization";
import { MongodbInitilization } from "../Infrastucture/mongodbIitilization";

export class VoteWorker {
  public redisInit: RedisInitilization;
  public mongodbInit: MongodbInitilization;

  constructor(
    redisInit: RedisInitilization,
    mongodbInit: MongodbInitilization
  ) {
    if (!redisInit || !mongodbInit) throw new Error();

    this.redisInit = redisInit;
    this.mongodbInit = mongodbInit;
  }

  async createTables() {
    (await this.redisInit.createSet()) &&
      (await this.mongodbInit.createCollection());
  }

  async insertVote(vote: createVote) {
    var result: boolean[] = [];

    if (!(await this.redisInit.checkKeyExist(vote.type))) {
      for (const [index, opt] of vote.options.entries()) {
        opt.vote = 0;
        var uniqueIdentifier = `${vote.type}:${index + 1}`;
        result.push(
          await this.redisInit
            .insertVote(opt, vote.type, index, uniqueIdentifier)
            .then(async (res) => {
              if (res) {
                return await this.mongodbInit.insertVote(
                  vote.type,
                  uniqueIdentifier
                );
              }
            })
        );
      }
    }
    return result.some((res) => res != false);
  }

  async removeVote(type: string): Promise<boolean> {
    if (await this.redisInit.checkKeyExist(type)) {
      var resultOfDeletionOnRedis = await this.redisInit.removeVote(type);
      if (resultOfDeletionOnRedis) {
        return await this.mongodbInit.removeVote(type);
      }
    }
    return Promise.resolve(false);
  }

  async voteForOption(type: string, id): Promise<void> {
    let uniqueIdentifier = `${type}:${id}`;
    return await this.redisInit
      .voteForOption(uniqueIdentifier)
      .then(() => this.calculateResultOfOption(type));
  }

  async calculateResultOfOption(type: string) {
    var totalVoteCount = 0;
    var getVoteOptionResultsFromRedis: voteOption[] = [];
    for (const voteTypeOption of await this.redisInit.getMembersofKey<string[]>(
      type
    )) {
      getVoteOptionResultsFromRedis.push(
        await this.redisInit.getAllHashData(voteTypeOption)
      );
    }

    getVoteOptionResultsFromRedis.forEach(
      (opt) => (totalVoteCount += Number(opt.vote))
    );

    for (const opt of getVoteOptionResultsFromRedis) {
      var uniqueIdentifier = type + ":" + opt.id;
      await this.mongodbInit.calculateVoteResult(
        uniqueIdentifier,
        opt.vote,
        totalVoteCount
      );
    }
  }

  async getListofVotes(): Promise<string[]> {
    return this.redisInit.getListofVotes();
  }

  async getVoteResult(type): Promise<any[]> {
    var voteResult: any[] = [];
    var getVoteOptionResultsFromRedis: voteOption[] = [];
    for (const voteTypeOption of await this.redisInit.getMembersofKey<string[]>(
      type
    )) {
      getVoteOptionResultsFromRedis.push(
        await this.redisInit.getAllHashData(voteTypeOption)
      );
    }

    for (const opt of getVoteOptionResultsFromRedis) {
      var uniqueIdentifier = type + ":" + opt.id;

      var optVoteResult = Object.assign({}, opt) as any;

      Object.assign(
        optVoteResult,
        await this.mongodbInit.getVoteResultByUniqueIdentifier(uniqueIdentifier)
      );

      delete optVoteResult._id;
      optVoteResult.votedFor = String(optVoteResult.votedFor).trim();
      optVoteResult.type = String(optVoteResult.type).trim();
      voteResult.push(optVoteResult);
    }

    return voteResult as unknown as Promise<any[]>;
  }

  async retrieveRequestedVoteData(type: string): Promise<createVote> {
    return await this.redisInit.retrieveRequestedVoteData(type);
  }
}
