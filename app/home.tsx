import Papa from 'papaparse';
import React, { useEffect, useRef, useState } from 'react';
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
  address: string;
  emoji: string;
  latitude: number;
  longitude: number;
}

export default function Home() {
  const mapRef = useRef<MapView | null>(null);

  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [userCafes, setUserCafes] = useState<Cafe[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const [newCafeName, setNewCafeName] = useState('');
  const [newCafeReview, setNewCafeReview] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🍩');

  const emojiOptions = ['🍩', '🍔', '🍕', '🍣', '🍜', '🍺', '🍷', '🧁', '🧋'];

  // Load cafés from CSV on mount
  useEffect(() => {
    const csvUrl =
      'https://raw.githubusercontent.com/GreenPillow-1/CafePOI/refs/heads/main/assets/cafes.csv?token=GHSAT0AAAAAADCOHXOQ2YF45CMY3P7Z7N5S2BFJAPA';

    fetch(csvUrl)
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsed: Cafe[] = results.data.map((row: any) => {
              if (
                row.name &&
                row.address &&
                row.latitude &&
                row.longitude
              ) {
                return {
                  name: row.name,
                  address: row.address,
                  emoji: row.emoji || '☕️',
                  latitude: parseFloat(row.latitude),
                  longitude: parseFloat(row.longitude),
                };
              }
              return null;
            }).filter(Boolean) as Cafe[];
            setCafes(parsed);
          },
          error: (error: any) => console.error('CSV parsing error', error),
        });
      })
      .catch((err) => console.error('Failed to load CSV:', err));
  }, []);

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
      address: newCafeReview.trim(),
      emoji: selectedEmoji,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    };

    setUserCafes((prev) => [...prev, newCafe]);

    // Reset form
    setNewCafeName('');
    setNewCafeReview('');
    setSelectedEmoji('🍩');
    setSelectedLocation(null);

    Alert.alert('New café added!');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Café & Restaurant Finder</Text>

        {/* Search */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search cafés..."
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
              <Marker key={index} coordinate={{ latitude: cafe.latitude, longitude: cafe.longitude }}>
                <Text style={{ fontSize: 28 }}>{cafe.emoji || '☕️'}</Text>
                <Callout>
                  <View style={{ width: 200 }}>
                    <Text style={{ fontWeight: 'bold' }}>{cafe.name}</Text>
                    <Text>{cafe.address}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}

            {selectedLocation && (
              <Marker coordinate={selectedLocation} pinColor="green" />
            )}
          </MapView>
        </View>

        {/* Add Café Form */}
        <View style={styles.formWrapper}>
          <Text style={styles.formTitle}>Add a New Place</Text>

          <TextInput
            style={styles.formInput}
            placeholder="Name"
            value={newCafeName}
            onChangeText={setNewCafeName}
            placeholderTextColor="black"
          />
          <TextInput
            style={styles.formInput}
            placeholder="Review"
            value={newCafeReview}
            onChangeText={setNewCafeReview}
            placeholderTextColor="black"
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
            <Text style={styles.addButtonText}>Add Café</Text>
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
    transform: [{ scale: 1.2 }],
  },
  addButton: {
    marginTop: 15,
    backgroundColor: '#7F6A5E',
    paddingVertical: 12,
    borderRadius: 10,
  },
  addButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
