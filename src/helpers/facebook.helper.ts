import * as getEnv from 'getenv'

const FACEBOOK_APP_ID = getEnv('FACEBOOK_APP_ID')
const FACEBOOK_APP_SECRET = getEnv('FACEBOOK_APP_SECRET')

export const facebookParams = () => {
  return {
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    scope: 'public_profile,email',
    profileFields: ['id', 'email', 'first_name', 'last_name'],
  }
}
