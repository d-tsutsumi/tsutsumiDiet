import * as Log4js from "log4js";


export const logConfigDev: Log4js.Configuration = {
  appenders: {
    access: {
      type: "file",
      filename: "./src/utils/logs/access.log",
    },
    error: {
      type: "file",
      filename: "./src/utils/logs/error.log",
    },
    system: {
      type: "file",
      filename: "./src/utils/logs/system.log",
    },
    console: {
      type: "console",
    },
    stdout: {
      type: "stdout",
    },
  },
  categories: {
    default: {
      appenders: ["access", "console", "stdout"],
      level: "INFO",
    },
    access: {
      appenders: ["access", "console", "stdout"],
      level: "INFO",
    },
    system: {
      appenders: ["system", "console", "stdout"],
      level: "ALL",
    },
    error: {
      appenders: ["error", "console", "stdout"],
      level: "WARN",
    },
  },
}