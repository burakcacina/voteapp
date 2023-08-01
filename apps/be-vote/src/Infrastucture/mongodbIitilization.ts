import { Collection, Db, MongoClient } from "mongodb";
import { serverInfo } from "../Model/Types/serverInfo";
import { type } from "os";

export class MongodbInitilization {
  public mongo: MongoClient;
  private connectionString: serverInfo;
  database: Db;
  voteCollection: Collection;

  constructor(connectionString: serverInfo) {
    this.connectionString = connectionString;
  }

  initMongoDB = async () => {
    this.connectMongoDB();
    await this.initDbAndCollection();
  };

  connectMongoDB = () => {
    this.mongo = new MongoClient(
      this.connectionString.host +
        ":" +
        this.connectionString.port +
        "/?authMechanism=default&directConnection=true&serverSelectionTimeoutMS=2000"
    );

    this.database = this.mongo.db(this.connectionString.database.name);

    // Establish and verify connection
    this.mongo.db("admin").command({ ping: 1 });

    this.mongo.on("open", () => {
      console.log("MongoDB Initated");
    });

    this.mongo.on("error", () => {
      throw new Error("An error occured while connecting mongodb!");
    });
  };

  initDbAndCollection = async () => {
    await this.setCollection();
  };

  createCollection = async (): Promise<boolean> => {
    if (
      !(await this.database
        .listCollections({ name: this.connectionString.database.table })
        .next())
    ) {
      let collection = await this.database.createCollection(
        this.connectionString.database.table
      );
      collection.createIndex({ votedFor: 1 }, { unique: true });

      return true;
    }
    return false;
  };

  setCollection = async (): Promise<boolean> => {
    this.voteCollection = await this.database.collection("vote");

    if (this.voteCollection.collectionName != null) {
      return true;
    }
  };

  insertVote = async (
    type: string,
    uniqueIdentifier: string
  ): Promise<boolean> => {
    console.log("girdi");
    return await this.voteCollection
      .insertOne({
        type: type,
        result: 0,
        votedFor: uniqueIdentifier,
      })
      .then((res) => Boolean(res.insertedId))
      .catch(() => Boolean(false));
  };

  removeVote = async (type): Promise<boolean> =>
    await this.voteCollection
      .deleteMany({ type: type })
      .then((res) => Boolean(res.deletedCount));

  calculateVoteResult = async (
    uniqueIdentifier: string,
    optVoteNumber: number,
    totalVoteCount: number
  ): Promise<boolean> => {
    return await this.voteCollection
      .updateOne(
        {
          type: uniqueIdentifier.split(":")[0],
          votedFor: uniqueIdentifier,
        },
        {
          $set: {
            result: (
              (optVoteNumber / (totalVoteCount == 0 ? 1 : totalVoteCount)) *
              100
            ).toFixed(2),
          },
        }
      )
      .then((res) => Boolean(res.upsertedCount));
  };

  getVoteResultByUniqueIdentifier = async (
    uniqueIdentifier: string
  ): Promise<any> => {
    return await this.voteCollection.findOne({
      type: uniqueIdentifier.split(":")[0],
      votedFor: uniqueIdentifier,
    });
  };
}
