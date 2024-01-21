import React from 'react';
import WebView, {WebViewMessageEvent} from 'react-native-webview';
import {RouteProp} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import {baseUrl} from '../../services/axios.service';

// Naver
const NAVER = {
  clientId: 'tExjEltbseFHIPqyF_1A',
  redirectUri: 'monthconcert://',
  state: 'RANDOM_STATE',
};
const NaverUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER.clientId}&redirect_uri=${NAVER.redirectUri}&state=${NAVER.state}`;

// Kakao
const KAKAO = {
  clientId: '8d5f9b68b32488e75e9be8f7a1af015e',
  redirectUri: 'http://localhost:8081', // dummy value
  responseType: 'code',
};
const KakaoUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO.clientId}&redirect_uri=${KAKAO.redirectUri}&response_type=${KAKAO.responseType}`;

// Google
const GOOGLE = {
  clientId:
    '1075559808467-m3csfhuqab93us90t07jb0l008rasfs3.apps.googleusercontent.com',
  redirectUri: 'http://localhost:8081', // dummy value
  responseType: 'code',
  scope: 'email profile',
};
const GoogleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE.clientId}&redirect_uri=${GOOGLE.redirectUri}&response_type=${GOOGLE.responseType}&scope=${GOOGLE.scope}`;

function OAuthScreen({
  route,
  navigation,
}: {
  route?: RouteProp<{OAuthWebView: {platform: string}}>;
  navigation?: NativeStackScreenProps<any>['navigation'];
}): React.JSX.Element {
  const {platform} = route!.params;
  let initUrl;
  let handleMessage: (event: WebViewMessageEvent) => Promise<void>;
  let accessToken: string;
  let refreshToken: string;

  switch (platform) {
    case 'naver':
      initUrl = NaverUrl;
      handleMessage = async event => {
        const url = event.nativeEvent.url;
        const code = url.split('oauth_token=')[1];
        console.log('url', url);

        try {
          // 로그인 성공시 발급되는 code로 서버 토큰 발급
          if (code) {
            const res = await axios.post(`${baseUrl}/signin/naver`, {code});
            console.log('[res data]', res.data);
            // todo: accessToken, refreshToken 저장
            accessToken = res.data.accessToken;
            refreshToken = res.data.refreshToken;
            console.log('[accessToken]', accessToken);
            console.log('[refreshToken]', refreshToken);
            navigation!.navigate('Home');
          }
        } catch (error) {
          console.log('[error]', error);
        }
      };
      break;

    case 'kakao':
      initUrl = KakaoUrl;
      handleMessage = async event => {
        const url = event.nativeEvent.url;
        const code = url.split('code=')[1];
        console.log('url', url);

        try {
          // 로그인 성공시 발급되는 code로 서버 토큰 발급
          if (code) {
            const res = await axios.post(`${baseUrl}/signin/kakao`, {code});
            console.log('[res data]', res.data);
            // todo: accessToken, refreshToken 저장
            accessToken = res.data.accessToken;
            refreshToken = res.data.refreshToken;
            console.log('[accessToken]', accessToken);
            console.log('[refreshToken]', refreshToken);
            navigation!.navigate('Home');
          }
        } catch (error) {
          console.log('[error]', error);
        }
      };
      break;

    case 'google':
      initUrl = GoogleUrl;
      handleMessage = async event => {
        const url = event.nativeEvent.url;
        const code = decodeURIComponent(url.split('code=')[1].split('&')[0]);
        console.log('url', url);
        console.log('code', code);

        try {
          // 로그인 성공시 발급되는 code로 서버 토큰 발급
          if (code) {
            const res = await axios.post(`${baseUrl}/signin/google`, {code});
            console.log('[res data]', res.data);
            // todo: accessToken, refreshToken 저장
            accessToken = res.data.accessToken;
            refreshToken = res.data.refreshToken;
            console.log('[accessToken]', accessToken);
            console.log('[refreshToken]', refreshToken);
            navigation!.navigate('Home');
          }
        } catch (error) {
          console.log('[error]', error);
        }
      };
      break;
  }

  return (
    <WebView
      source={{uri: initUrl!}}
      onMessage={handleMessage!}
      injectedJavaScript="window.ReactNativeWebView.postMessage('message')"
      userAgent="Mozilla/5.0 (Linux; Android 10; SM-G975N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Mobile Safari/537.36"
    />
  );
}

export default OAuthScreen;
