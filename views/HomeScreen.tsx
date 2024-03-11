import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
// import AntDesignIcon from 'react-native-vector-icons/AntDesign';

function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor="#0000ff" />
      <View>
        <Text style={styles.titleText}>인기있는 콘서트 목록</Text>
      </View>
    </ScrollView>
  );
}

// function Menu(
//   text: string,
//   onPress: () => void,
//   menuStyle?: {[key: string]: string},
// ) {
//   return (
//     <TouchableOpacity key={text} style={styles.menuContainer} onPress={onPress}>
//       <Text style={{...styles.menuText, ...menuStyle}}>{text}</Text>
//       <AntDesignIcon name="right" size={20} style={{...menuStyle}} />
//     </TouchableOpacity>
//   );
// }

const styles = StyleSheet.create({
  container: {},
  titleText: {
    fontFamily: 'Pretendard-Regular',
  },
});

export default HomeScreen;
