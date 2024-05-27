import React, {useEffect} from 'react';
import {
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  handleAppleLogin,
  handleGoogleLogin,
  handleKakaoLogin,
  handleNaverLogin,
} from '../services/login.service';
import NaverLogin from '@react-native-seoul/naver-login';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

function LoginScreen({
  navigation,
}: NativeStackScreenProps<any>): React.JSX.Element {
  useEffect(() => {
    NaverLogin.initialize({
      appName: 'monthconcert',
      consumerKey: 'tExjEltbseFHIPqyF_1A',
      consumerSecret: '2qQKkFur74',
      serviceUrlSchemeIOS: 'monthconcert',
      disableNaverAppAuthIOS: true,
    });
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      offlineAccess: false,
      forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      accountName: '', // [Android] specifies an account name on the device that should be used
      iosClientId:
        '1075559808467-6hmcv9csk9kd7rlq3ivqjrcbcerplkbq.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
  }, []);

  return (
    <View style={styles.screen}>
      <Image
        source={require('../assets/login/MainLogo.png')}
        style={styles.loginLogo}
      />
      <View style={styles.buttonContainer}>
        {Platform.OS === 'ios' &&
          SoicalLoginButton({
            platform: 'apple',
            onPress: () => handleAppleLogin(navigation),
          })}
        {SoicalLoginButton({
          platform: 'google',
          onPress: () => handleGoogleLogin(navigation),
        })}
        {SoicalLoginButton({
          platform: 'kakao',
          onPress: () => handleKakaoLogin(navigation),
        })}
        {SoicalLoginButton({
          platform: 'naver',
          onPress: () => handleNaverLogin(navigation),
        })}
      </View>
    </View>
  );
}

const SoicalLoginButton = ({
  platform,
  onPress,
}: {
  platform: string;
  onPress: () => void;
}) => {
  const type: {
    [key: string]: {
      logo: ImageSourcePropType;
      iconSize: number;
      title: string;
      color: string;
      textColor: string;
    };
  } = {
    naver: {
      logo: require('../assets/login/NaverLogo.png'),
      iconSize: 22,
      title: '네이버로 시작하기',
      color: '#07C35B',
      textColor: '#FFFFFF',
    },
    kakao: {
      logo: require('../assets/login/KakaoLogo.png'),
      iconSize: 30,
      title: '카카오로 시작하기',
      color: '#FEE500',
      textColor: '#381B1A',
    },
    google: {
      logo: require('../assets/login/GoogleLogo.png'),
      iconSize: 35,
      title: '구글로 시작하기',
      color: '#FFFFFF',
      textColor: '#505050',
    },
    apple: {
      logo: require('../assets/login/AppleLogo.png'),
      iconSize: 35,
      title: '애플로 시작하기',
      color: '#000000',
      textColor: '#DDDDDD',
    },
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.buttonBox,
        backgroundColor: type[platform].color,
        paddingVertical: 15 + (25 - type[platform].iconSize) / 2,
      }}>
      <View style={styles.iconBox}>
        <Image
          source={type[platform].logo}
          style={{
            width: type[platform].iconSize,
            height: type[platform].iconSize,
          }}
        />
      </View>
      <Text style={{...styles.buttonText, color: type[platform].textColor}}>
        {type[platform].title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  loginLogo: {
    width: '80%',
    height: undefined,
    aspectRatio: 2 / 1,
    marginTop: Platform.OS === 'ios' ? '45%' : '35%',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column-reverse',
    alignItems: 'center',
    marginBottom: 80,
  },
  buttonBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    paddingHorizontal: 20,
    marginHorizontal: 30,
    marginVertical: 5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
  },
  iconBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    width: '92%',
    textAlign: 'center',
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
