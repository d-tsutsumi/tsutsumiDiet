
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

export type  inputDeleteUserType = {
  userName: string;
  id: string
}