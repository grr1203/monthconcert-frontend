import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import LoginScreen from './views/LoginScreen';
import SplashScreen from 'react-native-splash-screen';
import OAuthScreen from './views/WebView/OAuthScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MypageScreen from './views/MyPageScreen';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddArtistScreen from './views/AddArtistScreen';
import InstagramScreen from './views/WebView/InstagramScreen';
import CalendarScreen from './views/CalendarScreen';
import HomeScreen from './views/HomeScreen';
import {Platform} from 'react-native';

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
          options={{headerTitle: '', headerBackTitleVisible: false}}
        />
        <Stack.Screen
          name="InstagramWebView"
          component={InstagramScreen}
          options={{headerTitle: '', headerBackTitleVisible: false}}
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
          height: Platform.OS === 'ios' ? 80 : 65,
          shadowColor: '#000',
          shadowOffset: {width: 2, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 2,
          paddingVertical: Platform.OS === 'ios' ? 10 : 0,
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{tabBarIcon: ({color}) => HomeIcon(color)}}
      />
      <Tab.Screen
        name="MyCalendar"
        component={CalendarScreen}
        options={{tabBarIcon: ({color}) => MyCalendarIcon(color)}}
      />
      <Tab.Screen
        name="AddArtist"
        component={AddArtistScreen}
        options={{tabBarIcon: ({color}) => AddArtistIcon(color)}}
      />
      <Tab.Screen
        name="MyPage"
        component={MypageScreen}
        options={{tabBarIcon: ({color}) => MyPageIcon(color)}}
      />
    </Tab.Navigator>
  );
}
const HomeIcon = (color: string) => (
  <OcticonsIcon name="home" size={30} color={color} />
);
const MyCalendarIcon = (color: string) => (
  <OcticonsIcon name="calendar" size={30} color={color} />
);
const AddArtistIcon = (color: string) => (
  <MaterialCommunityIcon name="account-music-outline" size={38} color={color} />
);
const MyPageIcon = (color: string) => (
  <OcticonsIcon name="person" size={30} color={color} />
);

export default App;
