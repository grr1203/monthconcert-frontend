import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

function LoginScreen(): React.JSX.Element {
  return (
    <View
      style={{
        backgroundColor: false ? Colors.black : Colors.white,
      }}>
      {SoicalLoginButton({
        platform: 'naver',
        onPress: handleNaverLogin,
      })}
      {SoicalLoginButton({
        platform: 'kakao',
        onPress: handleNaverLogin,
      })}
      {SoicalLoginButton({
        platform: 'google',
        onPress: handleNaverLogin,
      })}
      {SoicalLoginButton({
        platform: 'apple',
        onPress: handleNaverLogin,
      })}
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
        ...styles.buttonContainer,
        backgroundColor: type[platform].color,
        paddingVertical: 15 + (25 - type[platform].iconSize) / 2,
      }}>
      <Image
        source={type[platform].logo}
        style={{
          width: type[platform].iconSize,
          height: type[platform].iconSize,
        }}
      />
      <Text style={{...styles.buttonText, color: type[platform].textColor}}>
        {type[platform].title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
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
  buttonText: {
    width: '92%',
    textAlign: 'center',
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

const handleNaverLogin = () => {};

export default LoginScreen;
