import { Request } from 'express'

export interface UserTokenInfo {
  id: string;
  emailAddress: string;
  fullName: string;
  role: string;
}
export interface CrospinRequest extends Request {
  user: UserTokenInfo;
}
