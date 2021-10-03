import { createUserInputType } from '../../types';
import { cognitoClient } from './index';
import {
  AdminCreateUserCommand, AdminCreateUserCommandInput, AdminInitiateAuthCommand, 
  AttributeType, MessageActionType, AuthFlowType, AdminRespondToAuthChallengeCommand, ChallengeNameType
} from "@aws-sdk/client-cognito-identity-provider";
import { envConf } from '../config/config';
import { Logger } from "../logger";

export const createUser = async (userInput: createUserInputType) => {
  const { userName, password, email, userId } = userInput;

  const userAttributes: AttributeType[] = [
    {
      Name: "custom:diet-id",
      Value: userId,
    },
    {
      Name: "email",
      Value: email
    }
  ]

  const params: AdminCreateUserCommandInput = {
    UserPoolId: envConf.userPoolId,
    Username: userName,
    TemporaryPassword: password,
    UserAttributes: userAttributes,
    MessageAction: MessageActionType.SUPPRESS,

  }

  try {
    await cognitoClient.send(new AdminCreateUserCommand(params))
    const res = await cognitoClient.send(new AdminInitiateAuthCommand({
      UserPoolId: envConf.userPoolId,
      ClientId: envConf.cognit_client_id,
      AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
      AuthParameters: {
        "USERNAME": userName,
        "PASSWORD": password
      },
    }))

    await cognitoClient.send(new AdminRespondToAuthChallengeCommand({
      UserPoolId: envConf.userPoolId,
      ClientId: envConf.cognit_client_id,
      ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
      ChallengeResponses: {
        'USERNAME': userName, 
        'NEW_PASSWORD': password,
        'userAttributes.email': email,
        'userAttributes.name': userName
      },
      Session: res.Session
    }))
    Logger.LogAccessInfo(res);
    console.log(res)
    return true;
  }
  catch (e) {
    Logger.LogAccessError(e);
    console.log(e)
    return false
  }
}