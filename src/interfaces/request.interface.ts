import { Request } from 'express'

export interface UserTokenInfo {
  id: string;
  emailAddress: string;
  fullName: string;
  role: string;
}
export interface EthglobalRequest extends Request {
  user: UserTokenInfo;
}
