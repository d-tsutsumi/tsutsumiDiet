import * as Log4js from "log4js";
import { envConf } from "./config";

class Logger {
  public static initialize() {
    Log4js.configure(envConf.logConfig);
  }

  public static LogAccessInfo(message: any): void {
    let logger = Log4js.getLogger("access");
    logger.info(message);
  }

  public static LogAccessWarning(message: any): void {
    let logger = Log4js.getLogger("access");
    logger.warn(message);
  }

  public static LogAccessError(message: any): void {
    let logger = Log4js.getLogger("access");
    logger.error(message);
  }

  public static LogSystemInfo(message: any): void {
    let logger = Log4js.getLogger("system");
    logger.info(message);
  }

  public static LogSystemWarning(message: any): void {
    let logger = Log4js.getLogger("system");
    logger.warn(message);
  }

  public static LogSystemError(message: any): void {
    let logger = Log4js.getLogger("system");
    logger.error(message);
  }

  public static LogError(message: any): void {
    let logger = Log4js.getLogger("error");
    logger.error(message);
  }
}

export const logger = (function () {
  Logger.initialize();
  return Logger;
})();
