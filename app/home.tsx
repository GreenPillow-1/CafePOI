import React, { useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Callout, MapPressEvent, Marker } from 'react-native-maps';

interface Cafe {
  name: string;
  review: string;
  latitude: number;
  longitude: number;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [userCafes, setUserCafes] = useState<Cafe[]>([]);
  const [newCafeName, setNewCafeName] = useState('');
  const [newCafeReview, setNewCafeReview] = useState('');
  const [newCafeCoords, setNewCafeCoords] = useState<{ lat: number; lng: number } | null>(null);

  const mapRef = useRef<MapView | null>(null);

  const cafes: Cafe[] = [
    { name: "Mack Daddy Soprano", review: "Great bagels!", latitude: -37.81764132, longitude: 144.96386031352995 },
    { name: "Grand Mercure Hotel", review: "Good breakfast spot", latitude: -37.81773299, longitude: 144.9637651207598 },
    { name: "C & B", review: "Amazing coffee!", latitude: -37.81529087, longitude: 144.96423478944925 }
  ];

  const allCafes = [...cafes, ...userCafes];

  const filteredCafes = allCafes.filter((cafe) =>
    cafe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCafe = (cafe: Cafe) => {
    setSearchQuery(cafe.name);
    setSelectedCafe(cafe);
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: cafe.latitude,
        longitude: cafe.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  };

  const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setNewCafeCoords({ lat: latitude, lng: longitude });
  };

  const handleAddCafe = () => {
    if (!newCafeName.trim() || !newCafeReview.trim() || !newCafeCoords) {
      Alert.alert('Please tap on the map and fill in all fields');
      return;
    }

    const newCafe: Cafe = {
      name: newCafeName.trim(),
      review: newCafeReview.trim(),
      latitude: newCafeCoords.lat,
      longitude: newCafeCoords.lng,
    };

    setUserCafes(prev => [...prev, newCafe]);
    setNewCafeName('');
    setNewCafeReview('');
    setNewCafeCoords(null);
    Alert.alert('New location added!');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Café & Restaurant Finder</Text>

        <View style={{ width: '100%' }}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#000"
          />

          {searchQuery.length > 0 && (
            <ScrollView style={styles.dropdown}>
              {filteredCafes.slice(0, 5).map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => handleSelectCafe(item)}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.mapWrapper}>
          <MapView
            ref={mapRef}
            style={styles.map}
            mapType="standard"
            initialRegion={{
              latitude: -37.8176,
              longitude: 144.9638,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={handleMapPress}
          >
            {filteredCafes.map((cafe, index) => (
              <Marker
                key={index}
                coordinate={{ latitude: cafe.latitude, longitude: cafe.longitude }}
                title={cafe.name}
              >
                <Callout>
                  <View style={{ width: 200 }}>
                    <Text style={{ fontWeight: 'bold' }}>{cafe.name}</Text>
                    <Text>{cafe.review}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}

            {newCafeCoords && (
              <Marker
                coordinate={{ latitude: newCafeCoords.lat, longitude: newCafeCoords.lng }}
                pinColor="green"
              />
            )}
          </MapView>
        </View>

        <View style={styles.formWrapper}>
          <Text style={styles.formTitle}>Add New Place</Text>
          <Text style={{ marginBottom: 5 }}>Tap the map to choose location</Text>

          <TextInput
            style={styles.formInput}
            placeholder="Name"
            value={newCafeName}
            onChangeText={setNewCafeName}
          />
          <TextInput
            style={[styles.formInput, { height: 60 }]}
            placeholder="Your review or comment"
            value={newCafeReview}
            onChangeText={setNewCafeReview}
            multiline
          />

          <TouchableOpacity style={styles.addButton} onPress={handleAddCafe}>
            <Text style={styles.addButtonText}>Add to Map</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 60,
    paddingBottom: 120,
    paddingHorizontal: 20,
    backgroundColor: '#D6CABA',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  searchInput: {
    height: 40,
    width: '100%',
    borderColor: '#E0D3C0',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  dropdown: {
    backgroundColor: '#fff',
    maxHeight: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  mapWrapper: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.55,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginTop: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  formWrapper: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  formTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  formInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#7F6A5E',
    paddingVertical: 12,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
