import React, {useEffect, useState} from 'react';
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
import {baseUrl} from '../services/axios.service';

function HomeScreen({
  navigation,
}: NativeStackScreenProps<any>): React.JSX.Element {
  const [concertArray, setConcertArray] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 콘서트 목록 조회
  const getCalendar = async (year: number, month: number, first: boolean) => {
    console.log('[getCalendar]', year, month);
    if (loading) {
      return;
    }
    setLoading(true);

    const res = await axios.get(`${baseUrl}/calendar`, {params: {year, month}});
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
            date: concert.date,
          });
        });
      });
      setConcertArray([...concertArray, ...concertArrayToBeAdd]);
    }
    setLoading(false);
  };

  useEffect(() => {
    // calendar api 호출 (check login token)
    const date = new Date();
    (async () =>
      await getCalendar(date.getFullYear(), date.getMonth() + 1, true))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const handleScroll = (event: any) => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;

    // 마지막 스크롤 감지
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
      const currentDate = new Date(concertArray[concertArray.length - 1].date);
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
          {concertArray.map(concert => ConcertCard({...concert, navigation}))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ConcertCard({
  idx,
  artistName,
  artistAccount,
  postingImageUrl,
  postingUrl,
  navigation,
}: {
  idx: number;
  artistName: string;
  artistAccount: string;
  postingImageUrl: string;
  postingUrl: string;
  navigation: any;
}) {
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
      <Text className="font-bold text-xl text-[#333] pt-4">{artistName}</Text>
      <Text className="text-[#777] mb-8">@{artistAccount}</Text>
      <View className="border-8 border-gray-100 w-screen" />
    </View>
  );
}

export default HomeScreen;
