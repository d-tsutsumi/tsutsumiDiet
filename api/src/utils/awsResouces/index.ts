import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { envConf } from "../config/config"
import { fromIni } from "@aws-sdk/credential-provider-ini";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";


export const cognitoClient = new CognitoIdentityProviderClient({
  region: envConf.awsDynamoRegion,
  credentials: fromIni({profile: envConf.awsCredenshial})
})

export const dynamodbClient = new DynamoDBClient({
  region: envConf.awsDynamoRegion,
  credentials: fromIni({profile: envConf.awsCredenshial})
});

