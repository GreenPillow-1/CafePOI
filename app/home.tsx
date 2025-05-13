import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import MapView from 'react-native-maps';

export default function Home() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to CaféFinder :)</Text>

      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map} 
          initialRegion={{ // melbourne cbd
            latitude: -37.8136,
            longitude: 144.9631,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 100, 
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  mapWrapper: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.6,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 40,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
