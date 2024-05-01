import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {checkLogin} from '../services/login.service';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import {baseUrl} from '../services/axios.service';
import {BannerAD} from '../lib/ad/BannerAd';

const Tab = createMaterialTopTabNavigator();

function FavoriteScreen({
  navigation,
}: NativeStackScreenProps<any>): React.JSX.Element {
  console.log('navigation f ', navigation.navigate);
  return (
    <SafeAreaView className="flex-1">
      <BannerAD />
      <Tab.Navigator
        className="mt-2"
        screenOptions={{
          tabBarLabel: () => null,
          tabBarStyle: {
            shadowColor: '#000',
            shadowOffset: {width: 2, height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 2,
            paddingBottom: Platform.OS === 'ios' ? 5 : 0,
          },
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#999',
        }}>
        <Tab.Screen
          name="ConcertTab"
          options={{
            tabBarIcon: ({color}) => ConcertIcon(color),
            tabBarIndicatorStyle: {backgroundColor: '#777'},
          }}>
          {props => <ConcertTab {...props} navigation={navigation} />}
        </Tab.Screen>
        <Tab.Screen
          name="ArtistTab"
          component={ArtistTab}
          options={{
            tabBarIcon: ({color}) => ArtistIcon(color),
            tabBarIndicatorStyle: {backgroundColor: '#777'},
          }}
        />
      </Tab.Navigator>
      <TouchableOpacity
        className="absolute bottom-4 right-0 w-44 bg-[#000] opacity-70 rounded-xl py-3 px-6 mx-5 mt-2 shadow-lg"
        onPress={() => navigation.navigate('AddArtist')}>
        <Text className="text-white font-bold">+ 아티스트 추가 요청</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const ConcertIcon = (color: string) => (
  <MaterialIcon name="bookmark-music" size={28} color={color} />
);
const ArtistIcon = (color: string) => (
  <MaterialIcon name="account-music" size={28} color={color} />
);

// Tab Part
//
// Tab 1
//
const ConcertTab = ({navigation}: {navigation: any}) => {
  const [concertArray, setConcertArray] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 콘서트 목록 조회
  const getCalendar = async (
    year: number,
    month: number,
    first: boolean,
    userIdx: number,
  ) => {
    console.log('[getCalendar at FavoriteScreen]', year, month, userIdx);
    if (loading) {
      return;
    }
    setLoading(true);

    const res = await axios.get(`${baseUrl}/calendar`, {
      params: {year, month, userIdx},
    });
    console.log('[res data]', res.data);

    const concertDayArray = Object.keys(res.data.followedArtistsConcert);
    const concertArrayToBeAdd: object[] = [];
    if (concertDayArray.length > 0) {
      concertDayArray.forEach(day => {
        // 최초 조회시 이번달의 오늘 이후 날짜만 필터링
        if (first) {
          const now = new Date();
          if (parseInt(day) < now.getDate()) {
            return;
          }
        }

        // 각 날짜의 콘서트 목록에서 하나씩 추출
        res.data.monthConcert[day].forEach((concert: any) => {
          // console.log('[concert]', concert);
          // 재랜더링시 중복 제거
          if (concertArray.some(oldConcert => oldConcert.idx === concert.idx)) {
            return;
          }

          concertArrayToBeAdd.push({
            idx: concert.idx,
            artistName: concert.artistName,
            artistAccount: concert.artistAccount,
            postingImageUrl: concert.posting_img,
            postingUrl: concert.posting_url,
            artistIdx: concert.artist_idx,
            artistFollow: concert.artistFollow,
            concertFollow: concert.concertFollow,
            date: concert.date,
          });
        });
      });
      setConcertArray([...concertArray, ...concertArrayToBeAdd]);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const data = await checkLogin(navigation);
      const date = new Date();
      await getCalendar(
        date.getFullYear(),
        date.getMonth() + 1,
        true,
        data.user.idx,
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const handleScroll = (event: any) => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;

    // 마지막 스크롤 감지
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      const currentDate = new Date(concertArray[concertArray.length - 1]?.date);
      const nextDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        currentDate.getDate(),
      );
      // 다음 달 콘서트 목록 조회
      (async () => {
        const data = await checkLogin(navigation);
        await getCalendar(
          nextDate.getFullYear(),
          nextDate.getMonth() + 1,
          false,
          data.user.idx,
        );
      })();
    }
  };

  return (
    <ScrollView onScroll={handleScroll}>
      <View className="flex flex-row flex-wrap justify-center">
        {concertArray.map(concert => (
          <ConcertCard key={concert.idx} {...concert} navigation={navigation} />
        ))}
      </View>
    </ScrollView>
  );
};
const ConcertCard = ({
  idx,
  artistName,
  date,
  postingImageUrl,
  postingUrl,
  navigation,
}: {
  idx: number;
  artistName: string;
  date: string;
  postingImageUrl: string;
  postingUrl: string;
  navigation: any;
}) => {
  const dateArray = date.split(' ')[0].split('-');

  return (
    <View
      key={idx}
      className="w-[45%] items-center py-3 mx-2 mt-4 bg-[#FFF] rounded-md">
      <TouchableOpacity
        onPress={() => navigation.navigate('InstagramWebView', {postingUrl})}>
        <Image
          source={{uri: postingImageUrl}}
          className="w-44 h-44 rounded-md mb-2"
        />
      </TouchableOpacity>
      <View className="w-44 flex-row justify-between">
        <Text className="font-bold text-lg text-[#333]">
          {`${dateArray[1]}/${dateArray[2]}`}
        </Text>
        <Text className="font-bold text-lg text-[#555]">{artistName}</Text>
      </View>
    </View>
  );
};

// Tab 2
//
const ArtistTab = () => {
  return (
    <View>
      <Text>ArtistTab</Text>
    </View>
  );
};

export default FavoriteScreen;
