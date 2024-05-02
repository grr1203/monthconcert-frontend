import React, {useCallback, useState} from 'react';
import {
  ScrollView,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import {
  baseUrl,
  getJWTHeaderFromLocalStorage,
  privateAxiosInstance,
} from '../services/axios.service';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {checkLogin} from '../services/login.service';
import {followArtist, followConcert} from '../services/follow.service';
import {useFocusEffect} from '@react-navigation/native';

function HomeScreen({
  navigation,
}: NativeStackScreenProps<any>): React.JSX.Element {
  const [concertArray, setConcertArray] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 콘서트 목록 조회
  const getCalendar = async (
    year: number,
    month: number,
    first: boolean,
    userIdx?: number,
  ) => {
    console.log('[getCalendar]', year, month, userIdx);
    if (loading) {
      return;
    }
    setLoading(true);

    const res = await axios.get(`${baseUrl}/calendar`, {
      params: {year, month, userIdx},
    });
    console.log('[res data]', res.data);

    const concertDayArray = Object.keys(res.data.monthConcert);
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
          if (
            first === false &&
            concertArray.some(oldConcert => oldConcert.idx === concert.idx)
          ) {
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
      if (first) {
        console.log('concertArrayToBeAdd', concertArrayToBeAdd);
        setConcertArray([]);
        setConcertArray([...concertArrayToBeAdd]);
      } else {
        setConcertArray([...concertArray, ...concertArrayToBeAdd]);
      }
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      // calendar api 호출 (check login token)
      const date = new Date();
      (async () => {
        try {
          const res = await privateAxiosInstance.get('/user', {
            headers: await getJWTHeaderFromLocalStorage(),
          });
          await getCalendar(
            date.getFullYear(),
            date.getMonth() + 1,
            true,
            res.data.user.idx,
          );
        } catch (err) {
          await getCalendar(date.getFullYear(), date.getMonth() + 1, true);
        }
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

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
      (async () =>
        await getCalendar(
          nextDate.getFullYear(),
          nextDate.getMonth() + 1,
          false,
        ))();
    }
  };

  return (
    <SafeAreaView className="bg-[#FFF]">
      <ScrollView onScroll={handleScroll} scrollEventThrottle={0}>
        <View className="w-screen px-8 pb-4 pt-4">
          <Text className="text-xl font-[Pretendard-Regular] font-semibold text-[#333]">
            Now
          </Text>
        </View>
        <View className="border-b border-gray-100 w-screen" />
        <View className="flex flex-col items-center justify-center">
          {concertArray.map(concert => (
            <ConcertCard
              {...concert}
              navigation={navigation}
              key={concert.idx}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ConcertCard({
  idx,
  artistName,
  artistAccount,
  artistIdx,
  date,
  postingImageUrl,
  postingUrl,
  artistFollow,
  concertFollow,
  navigation,
}: {
  idx: number;
  artistName: string;
  artistAccount: string;
  artistIdx: number;
  date: string;
  postingImageUrl: string;
  postingUrl: string;
  artistFollow: boolean;
  concertFollow: boolean;
  navigation: any;
}) {
  const [star, setStar] = useState(artistFollow);
  const [heart, setHeart] = useState(concertFollow);
  const dateArray = date.split(' ')[0].split('-');

  const handleStar = async () => {
    await checkLogin(navigation);
    setStar(!star);
    await followArtist(artistIdx, !artistFollow);
  };
  const handleHeart = async () => {
    await checkLogin(navigation);
    setHeart(!heart);
    await followConcert(idx, !concertFollow);
  };

  return (
    <View
      key={idx}
      className="flex flex-col items-center gap-2 mt-8 border-x-2">
      <TouchableOpacity
        onPress={() => navigation.navigate('InstagramWebView', {postingUrl})}>
        <Image
          source={{uri: postingImageUrl}}
          className="w-80 h-80 rounded-md"
        />
      </TouchableOpacity>
      <View className="w-80 flex-row">
        <View className="flex-1">
          <View className="flex flex-row pt-4 pb-1">
            <Text className="font-bold text-xl text-[#333]">{artistName}</Text>
            <TouchableOpacity className="pt-1 pl-1" onPress={handleStar}>
              <AntDesignIcon
                name={star ? 'star' : 'staro'}
                color={star ? '#FFC94A' : '#555'}
                size={20}
              />
            </TouchableOpacity>
          </View>
          <Text className="text-[#777] mb-8">@{artistAccount}</Text>
        </View>
        <View className="flex-1 flex-row justify-end items-center mb-3">
          <Text className="font-bold text-2xl text-[#555]">
            {`${dateArray[1]}/${dateArray[2]}`}
          </Text>
          <TouchableOpacity className="pl-3" onPress={handleHeart}>
            <AntDesignIcon
              name={heart ? 'heart' : 'hearto'}
              color={heart ? '#FF2F40' : '#E99'}
              size={25}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="border-8 border-gray-100 w-screen" />
    </View>
  );
}

export default HomeScreen;
