import {appleAuth} from '@invertase/react-native-apple-authentication';
import axios from 'axios';
import {
  baseUrl,
  getJWTHeaderFromLocalStorage,
  privateAxiosInstance,
} from './axios.service';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NaverLogin from '@react-native-seoul/naver-login';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

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
      await AsyncStorage.setItem('accessToken', res.data.accessToken);
      await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
      navigation!.navigate('Home');
    } catch (error) {
      console.log('[error]', error);
    }
  }
}

export async function handleNaverLogin(
  navigation: NativeStackNavigationProp<any>,
) {
  const {failureResponse, successResponse} = await NaverLogin.login();
  console.log('successResponse', successResponse);
  console.log('failureResponse', failureResponse);

  // 로그인 성공시 발급되는 naver access token으로 서버 토큰 발급
  if (successResponse) {
    const res = await axios.post(`${baseUrl}/signin/naver`, {
      naverAccessToken: successResponse.accessToken,
    });
    console.log('[res data]', res.data);
    await AsyncStorage.setItem('accessToken', res.data.accessToken);
    await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
    navigation!.navigate('Home');
  }
}

export async function handleGoogleLogin(
  navigation: NativeStackNavigationProp<any>,
) {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  console.log('userInfo', userInfo);

  // 로그인 성공시 발급되는 naver access token으로 서버 토큰 발급
  if (userInfo) {
    const res = await axios.post(`${baseUrl}/signin/google`, {
      idToken: userInfo.idToken,
    });
    console.log('[res data]', res.data);
    await AsyncStorage.setItem('accessToken', res.data.accessToken);
    await AsyncStorage.setItem('refreshToken', res.data.refreshToken);
    navigation!.navigate('Home');
  }
}

export async function checkLogin(navigation: any) {
  console.log('[checkLogin]');
  try {
    const res = await privateAxiosInstance.get('/user', {
      headers: await getJWTHeaderFromLocalStorage(),
    });
    console.log('[res data]', res.data);
    return res.data;
  } catch (error) {
    // api 호출 실패 -> access token 갱신 실패 -> 로그인 화면으로 이동
    console.log('[error]', error);
    navigation.navigate('Login');
    return;
  }
}
