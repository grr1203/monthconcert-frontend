import React from 'react';
import WebView from 'react-native-webview';
import {RouteProp} from '@react-navigation/native';

function InstagramScreen({
  route,
}: {
  route?: RouteProp<{InstagramWebView: {postingUrl: string}}>;
}): React.JSX.Element {
  const {postingUrl} = route!.params;

  return (
    <WebView
      source={{uri: postingUrl!}}
      userAgent="Mozilla/5.0 (Linux; Android 10; SM-G975N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Mobile Safari/537.36"
    />
  );
}

export default InstagramScreen;
