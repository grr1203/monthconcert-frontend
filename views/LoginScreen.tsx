import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {handleAppleLogin} from '../services/login.service';

function LoginScreen({
  navigation,
}: NativeStackScreenProps<any>): React.JSX.Element {
  return (
    <View style={styles.screen}>
      <Image
        source={require('../assets/login/MainLogo.png')}
        style={styles.loginLogo}
      />
      <View style={styles.buttonContainer}>
        {SoicalLoginButton({
          platform: 'apple',
          onPress: () => handleAppleLogin(navigation),
        })}
        {SoicalLoginButton({
          platform: 'google',
          onPress: () =>
            navigation.navigate('OAuthWebView', {platform: 'google'}),
        })}
        {SoicalLoginButton({
          platform: 'kakao',
          onPress: () =>
            navigation.navigate('OAuthWebView', {platform: 'kakao'}),
        })}
        {SoicalLoginButton({
          platform: 'naver',
          onPress: () =>
            navigation.navigate('OAuthWebView', {platform: 'naver'}),
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
    marginTop: '45%',
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
