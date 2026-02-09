import { referenceAuth } from '@aws-amplify/backend'

export const auth = referenceAuth({
  userPoolId: 'us-west-2_eaUOifAaZ',
  identityPoolId: 'us-west-2:6666cfd8-8da3-4c24-95de-4c7065fa5ba9',
  userPoolClientId: '2s6v921b0pupo64nn1l69nrsi',
  authRoleArn:
    'arn:aws:iam::338658063532:role/ChatTracker-AuthRole',
  unauthRoleArn:
    'arn:aws:iam::338658063532:role/ChatTracker-UnauthRole',
})
