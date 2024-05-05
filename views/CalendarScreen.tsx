import React, {useCallback, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios from 'axios';
import {checkLogin} from '../services/login.service';
import {baseUrl} from '../services/axios.service';
import {BannerAD} from '../lib/ad/BannerAd';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import DropDownPicker from 'react-native-dropdown-picker';
import {useFocusEffect} from '@react-navigation/native';

function CalendarScreen({
  navigation,
}: NativeStackScreenProps<any>): React.JSX.Element {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [concertObject, setConcertObject] = useState<any>({});
  const [concertAllObject, setConcertAllObject] = useState<any>({});
  const [concertMyObject, setConcertMyObject] = useState<any>({});
  const [popupObject, setPopupObject] = useState<any>({});
  const [popupAllObject, setPopupAllObject] = useState<any>({});
  const [popupMyObject, setPopupMyObject] = useState<any>({});
  const [favorite, setFavorite] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('concert');

  const getCalendar = async (year: number, month: number) => {
    const data = await checkLogin(navigation);
    const userIdx = data.user.idx;
    const res = await axios.get(`${baseUrl}/calendar`, {
      params: {year, month, userIdx},
    });
    console.log('[res data concert]', res.data);
    if (Object.keys(res.data.monthConcert).length > 0) {
      setConcertObject(res.data.monthConcert);
      setConcertAllObject(res.data.monthConcert);
      setConcertMyObject(res.data.followedArtistsConcert);
    } else if (Object.keys(res.data.monthConcert).length === 0) {
      setConcertObject({});
    }
  };

  const getPopup = async (year: number, month: number) => {
    const data = await checkLogin(navigation);
    const userIdx = data.user.idx;
    const res = await axios.get(`${baseUrl}/popup/calendar`, {
      params: {year, month, userIdx},
    });
    console.log('[res data popup]', res.data.popupStore.byDay);
    if (Object.keys(res.data.popupStore.byDay).length > 0) {
      setPopupObject(res.data.popupStore.byDay);
      setPopupAllObject(res.data.popupStore.byDay);
      setPopupMyObject(res.data.likesPopupStore.byDay);
    } else if (Object.keys(res.data.monthPopup).length === 0) {
      setPopupObject({});
    }
  };

  useFocusEffect(
    useCallback(() => {
      const date = new Date();
      getCalendar(date.getFullYear(), date.getMonth() + 1);
      getPopup(date.getFullYear(), date.getMonth() + 1);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const goToPrevMonth = () => {
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    getCalendar(prevYear, prevMonth + 1);
    setCurrentMonth(prevMonth);
    setCurrentYear(prevYear);
  };
  const goToNextMonth = () => {
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    getCalendar(nextYear, nextMonth + 1);
    setCurrentMonth(nextMonth);
    setCurrentYear(nextYear);
  };

  const calendar = generateCalendar(currentYear, currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const getDayColor = (dayIndex: number) => {
    switch (dayIndex) {
      case 0: // 일
        return '#ff6666';
      case 6: // 토
        return '#6666ff';
      default:
        return '#444444';
    }
  };
  const generateRandomColor = () => {
    const hue = Math.random(); // 0부터 1까지의 랜덤한 색상 결정
    const saturation = 0.45; // 채도
    const brightness = 0.65; // 명도

    const newColor = `hsl(${Math.floor(hue * 360)}, ${Math.floor(
      saturation * 125,
    )}%, ${Math.floor(brightness * 100)}%)`;

    return newColor;
  };

  const handleFavorite = () => {
    if (value === 'concert') {
      setConcertObject(!favorite ? concertMyObject : concertAllObject);
      setFavorite(!favorite);
    } else if (value === 'popupStore') {
      setPopupObject(!favorite ? popupMyObject : popupAllObject);
      setFavorite(!favorite);
    }
  };

  return (
    <SafeAreaView style={styles.screen} className="bg-[#FFF]">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goToPrevMonth}>
            <Text style={styles.headerIcon}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerMonth}>{`${currentMonth + 1}`}</Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Text style={styles.headerIcon}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row w-full items-stretch z-10">
          <View className="flex-1 flex ml-4">
            <DropDownPicker
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdown}
              open={open}
              value={value}
              items={[
                {label: 'Concert', value: 'concert'},
                {label: 'Popup Store', value: 'popupStore'},
              ]}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setConcertObject}
              placeholder="Concert"
            />
          </View>
          <TouchableOpacity
            className="flex-1 flex-row justify-end items-end pl-4 pb-4 mr-4"
            onPress={handleFavorite}>
            <EntypoIcon name="check" size={16} color="#666" />
            <Text className="ml-1 text-[#666] font-bold">
              관심있는 공연만 보기
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.weekHeader}>
          {weekDays.map((day, index) => (
            <TouchableOpacity key={index} style={styles.dayHeader}>
              <Text style={[styles.headerDay, {color: getDayColor(index)}]}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.calendar}>
          {calendar.map((week, index) => (
            <View key={index} style={styles.week}>
              {week.map((day, dayIndex) => {
                // 날짜 없는 날
                if (day === null) {
                  return (
                    <ScrollView
                      key={dayIndex}
                      style={[styles.day, styles.nullDay]}
                    />
                  );
                }

                // 요일 색 변경
                const dayColor = getDayColor(
                  new Date(currentYear, currentMonth, day).getDay(),
                );

                return (
                  <ScrollView key={dayIndex} style={styles.day}>
                    <Text style={[styles.dayText, {color: dayColor}]}>
                      {day}
                    </Text>
                    {value === 'concert'
                      ? concertObject[day] &&
                        concertObject[day].map(
                          (concert: any, concertIndex: number) => {
                            return (
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('InstagramWebView', {
                                    postingUrl: concert.posting_url,
                                  })
                                }
                                key={concertIndex}
                                style={[styles.artistContainer]}>
                                <Image
                                  source={require('../assets/image/artistNameBackground.png')}
                                  style={[
                                    styles.artistBackground,
                                    {tintColor: generateRandomColor()},
                                  ]}
                                />
                                <View style={styles.artistOverlay}>
                                  <Text style={styles.artistText}>
                                    {concert.artistName}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            );
                          },
                        )
                      : popupObject[day] &&
                        popupObject[day].map(
                          (popup: any, popupIndex: number) => {
                            return (
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('InstagramWebView', {
                                    postingUrl: popup.posting_url,
                                  })
                                }
                                key={popupIndex}
                                style={[styles.artistContainer]}>
                                <Image
                                  source={require('../assets/image/artistNameBackground.png')}
                                  style={[
                                    styles.artistBackground,
                                    {tintColor: generateRandomColor()},
                                  ]}
                                />
                                <View style={styles.artistOverlay}>
                                  <Text style={styles.artistText}>
                                    {popup.name}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            );
                          },
                        )}
                  </ScrollView>
                );
              })}
            </View>
          ))}
        </View>
      </View>
      <BannerAD />
    </SafeAreaView>
  );
}
export default CalendarScreen;

const fontFamily = 'Pretendard-Regular'; // UhBeeZZIBA-Regular
const fontWeight = '600';
const styles = StyleSheet.create({
  screen: {flex: 1},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: '#FEFEFE',
  },
  header: {
    flexDirection: 'row',
    width: '95%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerMonth: {
    fontFamily: 'UhBeeZZIBA-Regular',
    fontSize: 60,
    fontWeight,
    color: '#222222',
  },
  headerIcon: {
    fontFamily,
    fontSize: 22,
    color: '#888888',
  },
  calendar: {
    flexDirection: 'column',
    width: '100%',
  },
  week: {
    flexDirection: 'row',
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '100%',
  },
  dayHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  headerDay: {
    fontFamily,
    fontSize: 15,
    fontWeight,
  },
  nullDay: {
    backgroundColor: '#F9F9F9',
  },
  day: {
    width: '14.2857%',
    padding: 5,
    borderWidth: 0.5,
    borderColor: '#eaeaea',
    height: 85,
  },
  dayText: {
    fontFamily,
    paddingBottom: 2,
    fontWeight,
  },
  artistContainer: {
    flex: 1,
    position: 'relative',
    height: 20,
    marginBottom: 4,
  },
  artistBackground: {
    width: '100%',
    height: '100%',
  },
  artistOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 9,
  },
  artistText: {
    fontFamily,
    fontWeight,
    fontSize: 13,
    color: '#FFFFFF',
  },
  dropdown: {borderWidth: 0},
});

const daysInMonth = (year: number, month: number) =>
  new Date(year, month + 1, 0).getDate();

const generateCalendar = (year: number, month: number) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDays = daysInMonth(year, month);
  const calendar = [];

  let dayCounter = 1;
  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      if ((i === 0 && j < firstDayOfMonth) || dayCounter > totalDays) {
        week.push(null);
      } else {
        week.push(dayCounter);
        dayCounter++;
      }
    }
    calendar.push(week);
  }

  return calendar;
};
