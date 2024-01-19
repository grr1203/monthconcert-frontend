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
  }

  return (
    <WebView
      source={{uri: initUrl!}}
      onMessage={handleMessage!}
      injectedJavaScript="window.ReactNativeWebView.postMessage('message')"
    />
  );
}

export default OAuthScreen;
