export type serverInfo = {
  port: number;
  host: string;
  database: {
    name: string | never;
    table: string | never;
  };
};
