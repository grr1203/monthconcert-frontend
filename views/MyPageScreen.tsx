import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

function MyPageScreen() {
  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.profileContainer}>
          <View style={styles.profile}>
            <Image
              source={require('../assets/user/UserProfileDefault.png')}
              style={styles.profileImage}
            />
            <Text style={styles.profileInfo}>홍길동</Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.logoutButton}>로그아웃{'  >'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {[
          Menu('이용약관', () => {}),
          Menu('고객센터', () => {}),
          Menu('회원탈퇴', () => {}, {color: '#FF2222'}),
        ]}
      </View>
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
    width: 75,
    height: 75,
    marginRight: 15,
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
});

export default MyPageScreen;
