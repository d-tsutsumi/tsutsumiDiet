require("dotenv").config();

const conf = () => {
  return {
    awsDynamoRegion: process.env.DYNAMODV_REGION_DEV || "",
    awsDynamoEndpoint: process.env.DYNAMODV_ENDPOINT_DEV || "",
    awsCredenshial: process.env.AWS_PROFILE_DEV || "",
    cognit_client_id: process.env.COGNITO_CLIENT_ID_DEV_CLIENT_ID || "",
    userPoolId: process.env.COGNITO_CLIENT_ID_DEV_USER_POOL_ID || "",
    gql_cors: {
      origin: process.env.GQL_ORIGIN_DEV || "",
      credentials: true,
    },
  };
};

export const devConf = conf();
