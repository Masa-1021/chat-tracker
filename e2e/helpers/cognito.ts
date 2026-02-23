import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminDeleteUserCommand,
  MessageActionType,
} from '@aws-sdk/client-cognito-identity-provider'

const USER_POOL_ID = process.env.TEST_USER_POOL_ID ?? 'ap-northeast-1_2iVTrqABE'
const REGION = 'ap-northeast-1'

const client = new CognitoIdentityProviderClient({ region: REGION })

export const TEST_USER = {
  email: `e2e-test-${Date.now()}@example.com`,
  password: 'TestPass123!',
  displayName: 'E2Eテストユーザー',
}

export async function createTestUser() {
  await client.send(
    new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: TEST_USER.email,
      UserAttributes: [
        { Name: 'email', Value: TEST_USER.email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'name', Value: TEST_USER.displayName },
      ],
      MessageAction: MessageActionType.SUPPRESS,
      TemporaryPassword: 'TempPass123!',
    }),
  )

  await client.send(
    new AdminSetUserPasswordCommand({
      UserPoolId: USER_POOL_ID,
      Username: TEST_USER.email,
      Password: TEST_USER.password,
      Permanent: true,
    }),
  )
}

export async function deleteTestUser() {
  try {
    await client.send(
      new AdminDeleteUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: TEST_USER.email,
      }),
    )
  } catch {
    // ignore if user doesn't exist
  }
}
