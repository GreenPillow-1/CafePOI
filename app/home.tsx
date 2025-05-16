import React, { useEffect, useRef, useState } from 'react';
import {
  Alert, Dimensions, KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import MapView, { MapPressEvent, Marker } from 'react-native-maps';
// db imports
import { onValue, push, ref } from 'firebase/database';
import { database } from '../firebase';

interface Cafe {
  name: string;
  address?: string;
  review?: string;
  emoji: string;
  latitude: number;
  longitude: number;
  id?: string;
}

export default function Home() {
  const mapRef = useRef<MapView | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [userCafes, setUserCafes] = useState<Cafe[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // User form
  const [newCafeName, setNewCafeName] = useState('');
  const [newCafeReview, setNewCafeReview] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🍩'); // default emoji
  const emojiOptions = ['☕️', '🍵', '🧋', '🥤', '🍔', '🍕', '🍣', '🍚', '🍜', '🍦', '🍩', '🥐']; // emoji options

  const cafes: Cafe[] = [
    { name: "Mack Daddy Soprano", address: "Unit 1, Basement, 313-315 Flinders Lane MELBOURNE 3000", latitude: -37.81764132, longitude: 144.96386031352995, emoji: "☕️" },
    { name: "Grand Mercure Hotel", address: "321 Flinders Lane MELBOURNE 3000", latitude: -37.81773299, longitude: 144.9637651207598, emoji: "☕️" },
    { name: "Glick's Cakes & Bagels", address: "Part Ground, 325 Flinders Lane MELBOURNE 3000", latitude: -37.81775969, longitude: 144.9635004630143, emoji: "☕️" },
  ];

  // Fetch cafes from Firebase
  useEffect(() => {
    const dbRef = ref(database, 'cafes');
    const unsubscribe = onValue(dbRef, snapshot => {
      const data = snapshot.val();
      const loadedCafes = data
        ? Object.keys(data).map(key => ({ ...data[key], id: key }))
        : [];
      setUserCafes(loadedCafes);
    });

    return () => unsubscribe();
  }, []);

  const allCafes = [...cafes, ...userCafes];
  const filteredCafes = allCafes.filter((cafe: Cafe) =>
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
    setSelectedLocation({ latitude, longitude });
  };

  const handleAddCafe = () => {
    if (!selectedLocation) {
      Alert.alert('Tap on the map to choose a location first.');
      return;
    }

    if (!newCafeName.trim() || !newCafeReview.trim()) {
      Alert.alert('Please fill in both the name and review');
      return;
    }

    const newCafe: Cafe = {
      name: newCafeName.trim(),
      review: newCafeReview.trim(),
      emoji: selectedEmoji,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    };

    push(ref(database, 'cafes'), newCafe); // add to firebase

    setUserCafes(prev => [...prev, newCafe]);
    setNewCafeName('');
    setNewCafeReview('');
    setSelectedEmoji('🍩');
    setSelectedLocation(null);
    Alert.alert('New location added!');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Café & Restaurant Finder</Text>

        {/* Search */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search cafés or restaurant..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />

        {/* Dropdown */}
        {searchQuery.length > 0 && (
          <ScrollView style={styles.dropdown}>
            {filteredCafes.slice(0, 5).map((item, index) => (
              <TouchableOpacity key={index} style={styles.dropdownItem} onPress={() => handleSelectCafe(item)}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Map */}
        <View style={styles.mapWrapper}>
          <MapView
            ref={mapRef}
            style={styles.map}
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
                onPress={() => handleSelectCafe(cafe)} // <- This handles tap on Android & iOS
              >
                <Text style={{ fontSize: 28 }}>{cafe.emoji}</Text>
              </Marker>
            ))}

            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                pinColor="green"
              />
            )}
          </MapView>
        </View>

        {/* Modal for selected Cafe */}
        <Modal
          visible={selectedCafe !== null}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSelectedCafe(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedCafe?.name}</Text>
              {selectedCafe?.address && <Text style={styles.modalText}>Address: {selectedCafe.address}</Text>}
              {selectedCafe?.review && <Text style={styles.modalText}>Review: {selectedCafe.review}</Text>}

              <Pressable style={styles.closeButton} onPress={() => setSelectedCafe(null)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Add Café Form */}
        <View style={styles.formWrapper}>
          <Text style={styles.formTitle}>Add a New Place</Text>

          <TextInput
            style={styles.formInput}
            placeholder="Name"
            value={newCafeName}
            onChangeText={setNewCafeName}
            placeholderTextColor={'black'}
          />
          <TextInput
            style={styles.formInput}
            placeholder="Review"
            value={newCafeReview}
            onChangeText={setNewCafeReview}
            placeholderTextColor={'black'}
          />

          <Text style={{ marginVertical: 8 }}>Pick an icon:</Text>
          <View style={styles.emojiRow}>
            {emojiOptions.map((emoji, index) => (
              <TouchableOpacity key={index} onPress={() => setSelectedEmoji(emoji)}>
                <Text style={[styles.emojiOption, selectedEmoji === emoji && styles.selectedEmoji]}>
                  {emoji}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.addButton} onPress={handleAddCafe}>
            <Text style={styles.addButtonText}>Add new location</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 120,
    paddingHorizontal: 20,
    backgroundColor: '#F0ECE3',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchInput: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  dropdown: {
    width: '100%',
    maxHeight: 150,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  dropdownItem: {
    padding: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  mapWrapper: {
    width: Dimensions.get('window').width * 0.9,
    height: 350,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  formWrapper: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  formInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  emojiOption: {
    fontSize: 28,
    margin: 5,
opacity: 0.5,
},
selectedEmoji: {
opacity: 1,
},
addButton: {
backgroundColor: '#6B4226',
borderRadius: 8,
paddingVertical: 10,
marginTop: 15,
},
addButtonText: {
color: '#fff',
textAlign: 'center',
fontWeight: 'bold',
},
modalOverlay: {
flex: 1,
backgroundColor: 'rgba(0,0,0,0.4)',
justifyContent: 'center',
alignItems: 'center',
paddingHorizontal: 30,
},
modalContent: {
backgroundColor: 'white',
borderRadius: 10,
padding: 25,
width: '100%',
maxWidth: 350,
alignItems: 'center',
},
modalTitle: {
fontSize: 22,
fontWeight: 'bold',
marginBottom: 10,
},
modalText: {
fontSize: 16,
marginBottom: 8,
textAlign: 'center',
},
closeButton: {
marginTop: 15,
backgroundColor: '#6B4226',
borderRadius: 6,
paddingVertical: 8,
paddingHorizontal: 25,
},
closeButtonText: {
color: 'white',
fontWeight: 'bold',
},
});