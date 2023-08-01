import { envVariables } from "../../Model/Types/envVariables";

const envVariables = () => {
  if (process.env["NODE_ENV"]?.trim() == "docker") return require("./docker");
  else if (process.env["NODE_ENV"]?.trim() == "kube") return require("./kube");
  else return require("./dev");
};

export const envVariablesConfig = envVariables().config as envVariables;
