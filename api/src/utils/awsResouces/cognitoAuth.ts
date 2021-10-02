import uuid from "node-uuid"
import { createUserInputType } from '../../types';
import { cognitoClient } from './index';
import {
  AdminCreateUserCommand,
  AdminCreateUserCommandInput, AdminInitiateAuthCommand, AttributeType, MessageActionType, AuthFlowType
} from "@aws-sdk/client-cognito-identity-provider";
import { envConf } from '../config/config';
import { Logger } from "../logger";

export const createUser = async (userInput: createUserInputType) => {
  const { userName, password } = userInput;

  const userAttributes: AttributeType = {
    Name: "custom:diet-id",
    Value: uuid.v1()
  }

  const params: AdminCreateUserCommandInput = {
    UserPoolId: envConf.userPoolId,
    Username: userName,
    TemporaryPassword: password,
    UserAttributes: [userAttributes],
    MessageAction: MessageActionType.SUPPRESS
  }

  try {
    const data = await cognitoClient.send(new AdminCreateUserCommand(params))
    Logger.LogAccessInfo(data)
    const res = await cognitoClient.send(new AdminInitiateAuthCommand({
      UserPoolId: envConf.userPoolId,
      ClientId: envConf.cognit_client_id,
      AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
      AuthParameters: {
        "USERNAME": userName,
        "PASSWORD": password
      }
    }))
    Logger.LogAccessInfo(res);
    return true;
  }
  catch (e) {
    Logger.LogAccessError(e);
    return false
  }
}