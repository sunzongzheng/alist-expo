import {StyleSheet, Image, Platform, View, Text, Switch} from 'react-native';

export default function Setting() {
  return (
    <View style={styles.container}>
      <Text style={styles.cardTitle}>版本信息</Text>
      <View style={styles.card}>
        <View style={[styles.cardItem, styles.cardItemBorderBottom]}>
          <Text>App版本</Text>
          <Text>1.0</Text>
        </View>
        <View style={[styles.cardItem]}>
          <Text>Alist版本</Text>
          <Text>3.34.0</Text>
        </View>
      </View>
      <Text style={[styles.cardTitle, styles.cardMarginTop]}>关于</Text>
      <View style={[styles.card]}>
        <View style={styles.cardItem}>
          <Text>关于</Text>
        </View>
      </View>
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
});
