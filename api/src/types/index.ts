
export type inputPostUserType = {
  name: string,
  email :string,
  costomUserId: string
  startAt: string
};

export type inputPutUserType = {
  name? : string,
  email?: string,
  mailAdress?: string;
  weight?: number;
};

export type createUserInputType = {
  userName: string,
  password: string,
  email: string
  userId: string
};