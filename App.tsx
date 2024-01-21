import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import HomeScreen from './views/HomeScreen';
import LoginScreen from './views/LoginScreen';
import SplashScreen from 'react-native-splash-screen';
import OAuthScreen from './views/WebView/OAuthScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MypageScreen from './views/MyPageScreen';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="HomeTab"
          component={HomeTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OAuthWebView"
          component={OAuthScreen}
          options={{headerTitle: ''}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabel: () => null,
        tabBarStyle: {
          height: 80,
          shadowColor: '#000',
          shadowOffset: {width: 2, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 2,
          paddingVertical: 15,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{tabBarIcon: HomeIcon}}
      />
      <Tab.Screen
        name="MyCalendar"
        component={HomeScreen}
        options={{tabBarIcon: MyCalendarIcon}}
      />
      <Tab.Screen
        name="AddArtist"
        component={HomeScreen}
        options={{tabBarIcon: AddArtistIcon}}
      />
      <Tab.Screen
        name="MyPage"
        component={MypageScreen}
        options={{tabBarIcon: MyPageIcon}}
      />
    </Tab.Navigator>
  );
}
const HomeIcon = () => <OcticonsIcon name="home" size={30} color="#000" />;
const MyCalendarIcon = () => <OcticonsIcon name="calendar" size={30} />;
const AddArtistIcon = () => (
  <MaterialCommunityIcon name="account-music-outline" size={38} />
);
const MyPageIcon = () => <OcticonsIcon name="person" size={30} />;

export default App;
