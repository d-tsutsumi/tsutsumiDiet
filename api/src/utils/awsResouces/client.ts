import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { envConf } from "../config/config";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

const createClient = (region: string, credential: string) => {
  const credentials = fromIni({ profile: credential });

  const dbClient = new DynamoDBClient({
    region,
    credentials,
  });
  const cognitoClient = new CognitoIdentityProviderClient({
    region,
    credentials,
  });
  return {
    dbClient,
    cognitoClient,
  };
};

export const { dbClient, cognitoClient } = createClient(
  envConf.awsRegion,
  envConf.awsCredenshial
);
