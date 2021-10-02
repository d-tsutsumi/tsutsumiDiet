import { devConf } from "./devConfig";

const conf = () => {
  if (process.env.NODE_ENV === "development") {
    return devConf;
  }
  return devConf
};

export const envConf = conf();
