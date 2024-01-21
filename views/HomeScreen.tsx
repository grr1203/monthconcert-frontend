import React, {useEffect} from 'react';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  getJWTHeaderFromLocalStorage,
  privateAxiosInstance,
} from '../services/axios.service';

function HomeScreen({
  navigation,
}: NativeStackScreenProps<any>): React.JSX.Element {
  useEffect(() => {
    (async function checkLogin() {
      // calendar api 호출 (check login token)
      // todo: api 변경
      try {
        const res = await privateAxiosInstance.get('/user', {
          params: {},
          headers: await getJWTHeaderFromLocalStorage(),
        });
        console.log('[res data]', res.data);
      } catch (error) {
        // api 호출 실패 -> access token 갱신 실패 -> 로그인 화면으로 이동
        console.log('[error]', error);
        navigation.navigate('Login');
      }
    })();
  }, [navigation]);

  return (
    <SafeAreaView style={{backgroundColor: Colors.lighter}}>
      <StatusBar
        barStyle={false ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.lighter}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{backgroundColor: Colors.lighter}}
      />
    </SafeAreaView>
  );
}
export default HomeScreen;
