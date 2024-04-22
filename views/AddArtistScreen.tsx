import React, {useEffect, useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import {
  getJWTHeaderFromLocalStorage,
  privateAxiosInstance,
} from '../services/axios.service';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {checkLogin} from '../services/login.service';
import {BannerAD} from '../lib/ad/BannerAd';

type Artist = {artist_name: string; instagram_account: string};

function AddArtistScreen({navigation}: NativeStackScreenProps<any>) {
  const [SearchedCount, setIsSearchedCount] = useState(-1);
  const [searchText, setSearchText] = useState('');
  const [searchedArtistArray, setSearchedArtistArray] = useState<Artist[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [artistName, setArtistName] = useState('');
  const [artistAccount, setArtistAccount] = useState('');

  useEffect(() => {
    (async () => await checkLogin(navigation))();
  }, [navigation]);

  const handleSearch = async () => {
    try {
      const res = await privateAxiosInstance.get('/artist', {
        params: {name: searchText},
        headers: await getJWTHeaderFromLocalStorage(),
      });
      console.log('[res data]', res.data);
      res.status === 200 && setIsSearchedCount(res.data.artistArray.length);

      if (Object.keys(res.data.artistArray).length > 0) {
        setSearchedArtistArray(res.data.artistArray);
      }
    } catch (error) {
      console.log('[error]', error);
    }
  };

  const handleAddRequest = async () => {
    try {
      const res = await privateAxiosInstance.post(
        '/artist',
        {artistName: artistName, instagramAccount: artistAccount},
        {headers: await getJWTHeaderFromLocalStorage()},
      );
      console.log('[res data]', res.data);

      setAddModalVisible(!addModalVisible);
    } catch (error) {
      console.log('[error]', error);
    }
  };

  return (
    <View
      style={
        SearchedCount === -1
          ? styles.containerBeforeSearch
          : styles.containerAfterSearch
      }>
      <View style={styles.searchContainer}>
        <OcticonsIcon name="search" size={20} style={styles.searchIcon} />
        <TextInput
          placeholder="검색"
          style={styles.searchInput}
          onChangeText={inputText => setSearchText(inputText)}
          onSubmitEditing={handleSearch}
        />
      </View>
      {SearchedCount === -1 ? (
        <Text style={styles.description}>
          좋아하는 아티스트가 등록되어 있는지 찾아보고 추가해보세요!
        </Text>
      ) : (
        <View style={styles.searchResultContainer}>
          <View style={styles.separator} />
          {SearchedCount === 0 && (
            <Text style={styles.noSearchResult}>검색 결과가 없습니다.</Text>
          )}
          {SearchedCount > 0 &&
            searchedArtistArray.map(artist => SearchedArtist(artist))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setAddModalVisible(true)}>
            <OcticonsIcon style={styles.addButtonText} name="plus" size={20} />
            <Text style={styles.addButtonText}>추가 요청</Text>
          </TouchableOpacity>
        </View>
      )}
      <BannerAD />

      <Modal
        animationType="none"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(!addModalVisible)}>
        <TouchableWithoutFeedback // 모달 바깥 부분 클릭 시 모달 닫기
          onPress={() => setAddModalVisible(!addModalVisible)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <View style={styles.textContainer}>
                  <Text style={styles.textLabel}>아티스트 이름</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={inputText => setArtistName(inputText)}
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.textLabel}>Instagram 계정</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={inputText => setArtistAccount(inputText)}
                  />
                </View>
                <Pressable
                  style={[styles.addRequestButton]}
                  onPress={handleAddRequest}>
                  <Text style={styles.textStyle}>추가 요청</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const SearchedArtist = (artist: Artist) => {
  return (
    <View key={artist.artist_name} style={styles.artistConatiner}>
      <View style={styles.artist}>
        <Text style={styles.artistName}>{artist.artist_name}</Text>
        <Text style={styles.artistAccount}>#{artist.instagram_account}</Text>
      </View>
      <View style={styles.separator} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerBeforeSearch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  containerAfterSearch: {
    flex: 1,
    paddingTop: '20%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    color: '#999',
    marginRight: 10,
  },
  searchInput: {
    height: 40,
    width: '85%',
    borderColor: '#CCC',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
  },
  description: {
    fontFamily: 'NanumBarunGothic',
    paddingBottom: 50,
    color: '#AAA',
  },
  searchResultContainer: {
    width: '100%',
    flex: 19,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  separator: {
    width: '100%',
    height: 2,
    marginTop: 20,
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
  },
  noSearchResult: {
    fontFamily: 'NanumBarunGothic',
    marginTop: 45,
    marginBottom: 30,
    color: '#AAA',
  },
  artistConatiner: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    width: '100%',
    padding: 20,
  },
  artist: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  artistName: {
    fontFamily: 'NanumBarunGothic',
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
    color: '#222',
  },
  artistAccount: {
    fontFamily: 'NanumBarunGothic',
    fontSize: 14,
    color: '#AAA',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 10,
  },
  addButtonText: {
    fontFamily: 'NanumBarunGothic',
    fontSize: 15,
    color: '#888',
    marginHorizontal: 4,
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
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  textLabel: {
    marginRight: 20,
    fontFamily: 'NanumBarunGothic',
    fontSize: 15,
  },
  textInput: {
    height: 40,
    width: '60%',
    borderColor: '#CCC',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
  },

  addRequestButton: {
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 2,
    backgroundColor: '#222',
    fontFamily: 'NanumBarunGothic',
    fontSize: 15,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default AddArtistScreen;
