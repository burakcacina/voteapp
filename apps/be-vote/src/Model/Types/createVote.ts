import { voteOption } from "./voteOption";

export type createVote = {
  type: string;
  options: voteOption[];
};