import {InterstitialAd, TestIds} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-7350981373953499/9578797848';

// 전면 광고
export const interstitialAD = InterstitialAd.createForAdRequest(adUnitId, {
  //   requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});
