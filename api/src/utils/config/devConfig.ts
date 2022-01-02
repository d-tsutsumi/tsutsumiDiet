import { logConfigDev } from './logConfig';
require("dotenv").config();

const conf = () => {
  return {
    awsRegion: process.env.AWS_REGION_DEV || "",
    dynamoDBTable: {
      userTable: process.env.DYNAMODB_USER_TABLE || "",
      runReocdeTable: process.env.DYNAMODB_RUNRECODE_TABLE || "",
    },
    awsDynamoEndpoint: process.env.DYNAMODB_ENDPOINT_DEV || "",
    awsCredenshial: process.env.AWS_PROFILE_DEV || "",
    cognit_client_id: process.env.COGNITO_CLIENT_ID_DEV_CLIENT_ID || "",
    userPoolId: process.env.COGNITO_CLIENT_ID_DEV_USER_POOL_ID || "",
    gql_cors: {
      origin: process.env.GQL_ORIGIN_DEV || "",
      credentials: true,
    },
    logConfig: logConfigDev,
  };
};

export const devConf = conf();
