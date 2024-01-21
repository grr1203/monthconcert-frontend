import {appleAuth} from '@invertase/react-native-apple-authentication';
import axios from 'axios';
import {baseUrl} from './axios.service';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export async function handleAppleLogin(
  navigation: NativeStackNavigationProp<any>,
) {
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
  });
  console.log('appleAuthRequestResponse', appleAuthRequestResponse);

  // /!\ This method must be tested on a real device.
  const credentialState = await appleAuth.getCredentialStateForUser(
    appleAuthRequestResponse.user,
  );
  console.log('credentialState', credentialState);

  if (credentialState === appleAuth.State.AUTHORIZED) {
    try {
      const res = await axios.post(`${baseUrl}/signin/apple`, {
        identityToken: appleAuthRequestResponse.identityToken,
        fullName: `${appleAuthRequestResponse.fullName?.givenName ?? ''}${
          appleAuthRequestResponse.fullName?.familyName ?? ''
        }`,
      });
      console.log('[res data]', res.data);
      // todo: accessToken, refreshToken 저장
      const accessToken = res.data.accessToken;
      const refreshToken = res.data.refreshToken;
      console.log('[accessToken]', accessToken);
      console.log('[refreshToken]', refreshToken);
      navigation!.navigate('Home');
    } catch (error) {
      console.log('[error]', error);
    }
  }
}
