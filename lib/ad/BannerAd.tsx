import {Platform} from 'react-native';
import {BannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';

const adUnitId = __DEV__
  ? TestIds.BANNER
  : Platform.OS === 'ios'
  ? 'ca-app-pub-7350981373953499/7045253400'
  : 'ca-app-pub-7350981373953499/5581692567';

// 배너 광고
export const BannerAD = (): React.JSX.Element => {
  return (
    <BannerAd unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
  );
};
