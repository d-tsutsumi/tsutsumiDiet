import { cognitoCreateUserType } from "../../types";
import { cognitoClient } from "./index";
import {
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  AdminInitiateAuthCommand,
  AdminDeleteUserCommand,
  AdminDeleteUserCommandInput,
  AttributeType,
  MessageActionType,
  AuthFlowType,
  AdminRespondToAuthChallengeCommand,
  ChallengeNameType,
} from "@aws-sdk/client-cognito-identity-provider";
import { envConf } from "../config/config";
import { cognitoDeleteUserType } from "../../types/cognitoType";

const createCognitoUser = async (userInput: cognitoCreateUserType) => {
  const { userName, password, email, userId } = userInput;

  const userAttributes: AttributeType[] = [
    {
      Name: "custom:diet-id",
      Value: userId,
    },
    {
      Name: "email",
      Value: email,
    },
  ];

  const params: AdminCreateUserCommandInput = {
    UserPoolId: envConf.userPoolId,
    Username: userName,
    TemporaryPassword: password,
    UserAttributes: userAttributes,
    MessageAction: MessageActionType.SUPPRESS,
  };

  try {
    await cognitoClient.send(new AdminCreateUserCommand(params));
    const res = await cognitoClient.send(
      new AdminInitiateAuthCommand({
        UserPoolId: envConf.userPoolId,
        ClientId: envConf.cognit_client_id,
        AuthFlow: AuthFlowType.ADMIN_NO_SRP_AUTH,
        AuthParameters: {
          USERNAME: userName,
          PASSWORD: password,
        },
      })
    );
    await cognitoClient.send(
      new AdminRespondToAuthChallengeCommand({
        UserPoolId: envConf.userPoolId,
        ClientId: envConf.cognit_client_id,
        ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
        ChallengeResponses: {
          USERNAME: userName,
          NEW_PASSWORD: password,
          "userAttributes.email": email,
          "userAttributes.name": userName,
        },
        Session: res.Session,
      })
    );
    return {
      result: true,
      error: null,
    };
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      let error = {
        errName: e.name,
        errMessage: e.message,
      };
      return {
        result: false,
        error,
      };
    }
    return {
      result: false,
      error: null,
    };
  }
};

const changeUserAttributes = async (userInput: cognitoCreateUserType) => {};

const deleteUser = async (userInput: cognitoDeleteUserType) => {
  const params: AdminDeleteUserCommandInput = {
    UserPoolId: envConf.userPoolId,
    Username: userInput.userName,
  };
  try {
    await cognitoClient.send(new AdminDeleteUserCommand(params));
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const cognitoAuth = {
  createUser: createCognitoUser,
  deleteUser: deleteUser,
  changeUserAttributes: changeUserAttributes,
};
