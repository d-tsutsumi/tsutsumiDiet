import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { envConf } from "../config/config"
import { fromIni } from "@aws-sdk/credential-provider-ini";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";


export const cognitoClient = new CognitoIdentityProviderClient({
  region: envConf.awsDynamoRegion,
  credentials: fromIni({profile: envConf.awsCredenshial})
})

export const dbclient = new DynamoDBClient({
  region: envConf.awsDynamoRegion,
  credentials: fromIni({profile: envConf.awsCredenshial})
});

export const dynamoClient = DynamoDBDocumentClient.from(dbclient)