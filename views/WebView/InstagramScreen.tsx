import React, {useEffect} from 'react';
import WebView from 'react-native-webview';
import {RouteProp} from '@react-navigation/native';
import {interstitialAD} from '../../lib/ad/ad.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

function InstagramScreen({
  route,
}: {
  route?: RouteProp<{InstagramWebView: {postingUrl: string}}>;
}): React.JSX.Element {
  const {postingUrl} = route!.params;

  useEffect(() => {
    interstitialAD.load();
    (async () => {
      // 2024-01-01 5 형식
      const adCountString = await AsyncStorage.getItem(
        'todayAdCount_InstagramWebview',
      );
      console.log('[adCountString]', adCountString);

      const now = new Date();
      now.setUTCHours(0, 0, 0, 0);
      const adDate = adCountString ? new Date(adCountString.split(' ')[0]) : '';
      const adCount = adCountString ? parseInt(adCountString.split(' ')[1]) : 0;
      if (adDate < now || adCount <= 3) {
        await AsyncStorage.setItem(
          'todayAdCount_InstagramWebview',
          `${now.toISOString().split('T')[0]} ${adCount + 1}`,
        );
        return;
      } else {
        await interstitialAD.show();
      }
    })();
  }, []);

  return (
    <WebView
      source={{uri: postingUrl!}}
      userAgent="Mozilla/5.0 (Linux; Android 10; SM-G975N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Mobile Safari/537.36"
    />
  );
}

export default InstagramScreen;
