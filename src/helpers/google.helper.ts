import * as getEnv from 'getenv'

const GOOGLE_CLIENT_ID = getEnv('GOOGLE_CLIENT_ID')
const GOOGLE_SECRET = getEnv('GOOGLE_SECRET')

export const googleParams = () => {
  return {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_SECRET,
    callbackURL: 'http://localhost:3000/google/redirect',
    scope: ['email', 'profile'],
  }
}
