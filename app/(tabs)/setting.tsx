import {
  StyleSheet,
  Image,
  Platform,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Modal,
  Pressable,
  Linking, Touchable, TouchableWithoutFeedback
} from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {useCallback, useState} from "react";

export default function Setting() {
  const [modalVisible, setModalVisible] = useState(false);
  const showAbout = useCallback(() => {
    setModalVisible(true)
  }, [setModalVisible])

  return (
    <View style={styles.container}>
      <Text style={styles.cardTitle}>版本信息</Text>
      <View style={styles.card}>
        <View style={[styles.cardItem, styles.cardItemBorderBottom]}>
          <Text>App版本</Text>
          <Text>1.0</Text>
        </View>
        <View style={[styles.cardItem]}>
          <Text>AList版本</Text>
          <Text>3.35.0</Text>
        </View>
      </View>
      <Text style={[styles.cardTitle, styles.cardMarginTop]}>关于</Text>
      <View style={[styles.card]}>
        <TouchableOpacity onPress={showAbout}>
          <View style={styles.cardItem}>
              <Text>关于</Text>
              <Ionicons
                name={'chevron-forward-outline'}
                color={'#D1D1D6'}
                containerStyle={{ alignSelf: 'center' }}
                size={16}
              />
          </View>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(!modalVisible)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>本应用遵循AGPL3.0开源协议</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://github.com/sunzongzheng/alist-expo')}>
                <Text style={styles.modalText}>alist-expo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://github.com/sunzongzheng/alist-ios')}>
                <Text style={styles.modalText}>alist-ios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardTitle: {
    color: 'gray',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 12,
    paddingLeft: 14,
  },
  card: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderRadius: 10,
    position: 'relative',
  },
  cardItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  cardItemBorderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(228, 228, 228)',
  },
  cardMarginTop: {
    marginTop: 40,
  },
  bold: {
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
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
