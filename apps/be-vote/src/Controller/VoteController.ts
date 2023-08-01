import { OperationCanceledException } from "typescript";
import { VoteWorker } from "../UOW/VoteWorker";
import { createVote } from "../Model/Types/createVote";
import { Router } from "express";
import { customError } from "../Model/Interface/customError";

export class VoteController {
  static listenRequests = (router: Router, voteWorker: VoteWorker) => {
    if (!router || !voteWorker) throw new OperationCanceledException();

    //create new vote with options
    router.post("/createVote", async function (req, res, next) {
      if (req.body) {
        let createVoteReqDTO: createVote = req.body as createVote;
        if (createVoteReqDTO.options != null && createVoteReqDTO.type != null) {
          let result = await voteWorker.insertVote(createVoteReqDTO);
          if (result) {
            return res
              .status(201)
              .end(JSON.stringify({ data: createVoteReqDTO }));
          }
        }
      }
      next(new customError(404, "Not found"));
    });

    //list of votes
    router.get("/getListofVotes", async function (req, res, next) {
      let result = await voteWorker.getListofVotes();
      if (result.length) {
        return res.status(200).end(
          JSON.stringify({
            data: { votes: result },
          })
        );
      }
      next(new customError(404, "Not found"));
    });

    //get vote options by  vote as query param
    router.get("/getVoteOptions", async function (req, res, next) {
      if (req.query) {
        let result = await voteWorker.retrieveRequestedVoteData(
          req.query["type"].toString()
        );
        if (result) {
          return res.status(200).end(JSON.stringify({ data: result }));
        }
      }
      next(new customError(404, "Not found"));
    });

    //vote for opt
    router.post("/voteForOption", async function (req, res, next) {
      if (req.body) {
        let voteOptionDetail = req.body;
        if (voteOptionDetail?.type && voteOptionDetail?.id) {
          await voteWorker.voteForOption(
            voteOptionDetail?.type,
            voteOptionDetail?.id
          );
          return res.status(201).end();
        }
      }
      next(new customError(404, "Not found"));
    });

    // get vote result
    router.get("/getVoteResult", async function (req, res, next) {
      if (req.query && req.query["type"]) {
        let result = await voteWorker.getVoteResult(req.query["type"]);
        if (result.length > 0 && result != null) {
          return res.status(200).end(
            JSON.stringify({
              data: { options: result },
            })
          );
        }
      }
      next(new customError(404, "Not found"));
    });

    //remove votes
    router.delete("/removeVote", async function (req, res, next) {
      if (req.body && req.body?.type) {
        let voteType = req.body?.type;
        if (voteType) {
          let result = await voteWorker.removeVote(voteType);
          if (result) {
            return res.status(201).end();
          }
        }
      }
      next(new customError(404, "Not found"));
    });
  };
}
