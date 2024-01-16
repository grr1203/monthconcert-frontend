import React, {useEffect} from 'react';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

function HomeScreen({
  navigation,
}: NativeStackScreenProps<any>): React.JSX.Element {
  useEffect(() => {
    navigation.navigate('Login');
  });
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
