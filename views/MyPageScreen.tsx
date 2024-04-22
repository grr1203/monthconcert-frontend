import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {
  getJWTHeaderFromLocalStorage,
  privateAxiosInstance,
} from '../services/axios.service';
import {BannerAD} from '../lib/ad/BannerAd';

function MyPageScreen({
  navigation,
}: NativeStackScreenProps<any>): React.JSX.Element {
  const [user, setUser] = useState<any>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const TermsOfUseUrl =
    'https://www.ftc.go.kr/solution/skin/doc.html?fn=b5bbcffdef4f9e856121b2ba1c0089df8c1dac13565ee8e66ba6d0ab318c011f&rs=/fileupload/data/result/BBSMSTR_000000002320/';

  useEffect(() => {
    (async () => {
      try {
        // 유저 정보 조회
        const res = await privateAxiosInstance.get('/user', {
          headers: await getJWTHeaderFromLocalStorage(),
        });
        console.log('[res data]', res.data);
        setUser(res.data.user);
      } catch (error) {
        // api 호출 실패 -> access token 갱신 실패 -> 로그인 화면으로 이동
        console.log('[error]', error);
        navigation.navigate('Login');
        return;
      }
    })();
  }, [navigation]);

  const deleteUser = async () => {
    const res = await privateAxiosInstance.delete('/user', {
      headers: await getJWTHeaderFromLocalStorage(),
    });
    console.log('[res data]', res.data);
    if (res.status === 200) {
      setDeleteModalVisible(false);
      navigation.navigate('Login');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.profileContainer}>
          <View style={styles.profile}>
            <Image
              source={require('../assets/user/UserProfileDefault.png')}
              style={styles.profileImage}
            />
            <Text style={styles.profileInfo}>
              {user?.user_name ?? '이름을 입력하세요'}
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.logoutButton}>로그아웃{'  >'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {[
          Menu('이용약관', () =>
            navigation.navigate('InstagramWebView', {
              postingUrl: TermsOfUseUrl,
            }),
          ),
          // Menu('고객센터', () => {}),
          Menu('회원탈퇴', () => setDeleteModalVisible(true), {
            color: '#FF2222',
          }),
        ]}
        <View className="mt-5">
          <BannerAD />
        </View>
      </View>
      <Modal
        animationType="none"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(!deleteModalVisible)}>
        <TouchableWithoutFeedback // 모달 바깥 부분 클릭 시 모달 닫기
          onPress={() => setDeleteModalVisible(!deleteModalVisible)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text className="text-base">정말 탈퇴하시겠습니까? </Text>
              <Pressable
                style={[styles.deleteRequestButton]}
                onPress={deleteUser}>
                <Text style={styles.textStyle}>탈퇴하기</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
}

function Menu(
  text: string,
  onPress: () => void,
  menuStyle?: {[key: string]: string},
) {
  return (
    <TouchableOpacity key={text} style={styles.menuContainer} onPress={onPress}>
      <Text style={{...styles.menuText, ...menuStyle}}>{text}</Text>
      <AntDesignIcon name="right" size={20} style={{...menuStyle}} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 90,
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    marginRight: 20,
  },
  profileInfo: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 20,
  },
  logoutButton: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    color: 'grey',
    paddingHorizontal: 10,
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  menuText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  deleteRequestButton: {
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 2,
    backgroundColor: '#EE5555',
    fontFamily: 'NanumBarunGothic',
    fontSize: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MyPageScreen;
