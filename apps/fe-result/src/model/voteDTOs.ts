export type vote = {
  type: string;
  options: {
    id?: string | undefined;
    name: string;
    vote: number | undefined;
  }[];
};

export type votetypes = string[];
