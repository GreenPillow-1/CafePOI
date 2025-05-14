import React, { useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';

interface Cafe {
  name: string;
  address: string;
  seating: number;
  latitude: number;
  longitude: number;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const mapRef = useRef<MapView | null>(null);

  const cafes: Cafe[] = [
  { name: "Mack Daddy Soprano", address: "Unit 1, Basement, 313-315 Flinders Lane MELBOURNE 3000", seating: 60, latitude: -37.81764132, longitude: 144.96386031352995 },
{ name: "Grand Mercure Hotel", address: "321 Flinders Lane MELBOURNE 3000", seating: 20, latitude: -37.81773299, longitude: 144.9637651207598 },
{ name: "Glick's Cakes & Bagels", address: "Part Ground, 325 Flinders Lane MELBOURNE 3000", seating: 30, latitude: -37.81775969, longitude: 144.9635004630143 },
{ name: "Pronto On Flinders", address: "Part Ground, 335 Flinders Lane MELBOURNE 3000", seating: 53, latitude: -37.81784851, longitude: 144.96323530453128 },
{ name: "Two Fingers", address: "Lot, Ground, 27-37 Russell Street MELBOURNE 3000", seating: 40, latitude: -37.81598872, longitude: 144.96925702324145 },
{ name: "Peter Rowland at the Chapter House", address: "205 Flinders Lane MELBOURNE 3000", seating: 140, latitude: -37.81678985, longitude: 144.9676888755057 },
{ name: "The Firery Stone", address: "Part Gnd & Bmt, 87 Flinders Lane MELBOURNE 3000", seating: 80, latitude: -37.81543172, longitude: 144.97140205113766 },
{ name: "Rosati Restaurant", address: "95-101 Flinders Lane MELBOURNE 3000", seating: 300, latitude: -37.81552852, longitude: 144.97110806680425 },
{ name: "Mini Restaurant", address: "Basement, 141-143 Flinders Lane MELBOURNE 3000", seating: 80, latitude: -37.81579907, longitude: 144.9698892810444 },
{ name: "1 O 1 Deli", address: "Shop 5, Ground, 113 Flinders Street MELBOURNE 3000", seating: 10, latitude: -37.81594272, longitude: 144.97076462799464 },
{ name: "Crema Espresso Bar", address: "Shop 2, Ground 0, 75-77 Flinders Lane MELBOURNE 3000", seating: 10, latitude: -37.815942719003395, longitude: 144.97076462799464 },
{ name: "Lune Croissanterie", address: "3/119 Rose Street FITZROY 3065", seating: 20, latitude: -37.79930591, longitude: 144.97746588839447 },
{ name: "Tivoli Road Bakery", address: "3 Tivoli Road SOUTH YARRA 3141", seating: 35, latitude: -37.84021304, longitude: 144.99317198764888 },
{ name: "Bourke Street Bakery", address: "2/61 Bourke Street MELBOURNE 3000", seating: 50, latitude: -37.81314961, longitude: 144.96678381304903 },
{ name: "Denis the French Baker", address: "1/315 Queen Street MELBOURNE 3000", seating: 15, latitude: -37.81666113, longitude: 144.95721300921463 },
{ name: "Sugo Mi", address: "Shop 3, 11-13 Doonside Crescent DOONSIDE 2767", seating: 40, latitude: -33.77475956, longitude: 151.00420235787267 },
{ name: "Pellegrini's Espresso Bar", address: "66 Bourke Street MELBOURNE 3000", seating: 60, latitude: -37.81573288, longitude: 144.9631278874766 },
{ name: "The Hardware Société", address: "120 Hardware Street MELBOURNE 3000", seating: 50, latitude: -37.81474607, longitude: 144.96390586386277 },
{ name: "Eau De Vie", address: "1 Malthouse Lane MELBOURNE 3000", seating: 40, latitude: -37.81585391, longitude: 144.96820770928716 },
{ name: "Easey’s", address: "48 Easey Street COLLINGSWOOD 5063", seating: 100, latitude: -37.81247123, longitude: 144.95151440773268 },
{ name: "Harveys Brasserie", address: "Basement, 412 Collins Street MELBOURNE 3000", seating: 60, latitude: -37.81699225, longitude: 144.96049753718842 },
{ name: "The Irish Times", address: "Ground, 427 Little Collins Street MELBOURNE 3000", seating: 100, latitude: -37.81625572, longitude: 144.9605449167531 },
{ name: "Lucias Restorante", address: "433 Little Collins Street MELBOURNE 3000", seating: 20, latitude: -37.81631523, longitude: 144.9603512675448 },
{ name: "Cafe Intimo", address: "Shop 3, Ground, 439 Little Collins Street MELBOURNE 3000", seating: 28, latitude: -37.81639707, longitude: 144.96010676156988 },
{ name: "Chaise Lounge", address: "Basement, 105 Queen Street MELBOURNE 3000", seating: 88, latitude: -37.81615625, longitude: 144.96082132225848 },
{ name: "The Fresh Food Fix", address: "Right Ground, 84 William Street MELBOURNE 3000", seating: 21, latitude: -37.81714237, longitude: 144.9592899112667 },
{ name: "Louis Gourmet Lunch", address: "Rear Ground, 84 William Street MELBOURNE 3000", seating: 90, latitude: -37.81714237, longitude: 144.9592899112667 },
{ name: "Louis Gourmet Lunch", address: "Rear Ground, 84 William Street MELBOURNE 3000", seating: 6, latitude: -37.81714237, longitude: 144.9592899112667 },
{ name: "Treasury", address: "Ground, 394 Collins Street MELBOURNE 3000", seating: 140, latitude: -37.81661444, longitude: 144.96108884447324 },
{ name: "Bellini", address: "Ground, 376 Collins Street MELBOURNE 3000", seating: 200, latitude: -37.81629426, longitude: 144.96172890674856 },
{ name: "Kenny's Bakery Cafe", address: "18 Elizabeth Street MELBOURNE 3000", seating: 6, latitude: -37.81582348, longitude: 144.96346027157176 },
{ name: "Bambola Cafe", address: "349 Little Collins Street MELBOURNE 3000", seating: 15, latitude: -37.81557886, longitude: 144.9633099785653 },
{ name: "Bambola Cafe", address: "349 Little Collins Street MELBOURNE 3000", seating: 6, latitude: -37.81557886, longitude: 144.9633099785653 },
{ name: "La Baguette", address: "34 Little Collins Street MELBOURNE 3000", seating: 10, latitude: -37.81557886, longitude: 144.9633099785653 },
{ name: "Rich Maha", address: "30 Little Collins Street MELBOURNE 3000", seating: 40, latitude: -37.81557886, longitude: 144.9633099785653 },
{ name: "Nori Nori Sushi & Noodle Bar", address: "10 Little Collins Street MELBOURNE 3000", seating: 6, latitude: -37.81583644, longitude: 144.96243955664215 },
{ name: "Sage Cafe Melbourne", address: "Shop 6, 353 Little Collins Street MELBOURNE 3000", seating: 6, latitude: -37.81569963, longitude: 144.96300475180894 },
{ name: "Cafe Segovia", address: "36 Block Place MELBOURNE 3000", seating: 8, latitude: -37.81526969, longitude: 144.96439959370667 },
{ name: "Novotel Melbourne On Collins", address: "270 Collins Street MELBOURNE 3000", seating: 204, latitude: -37.81541504, longitude: 144.96491857864146 },
{ name: "Cafe Duomo", address: "Shop 9, Elizabeth Street MELBOURNE 3000", seating: 25, latitude: -37.81557751, longitude: 144.96420283001515 },
{ name: "Hudsons Coffee", address: "84-86 Elizabeth Street MELBOURNE 3000", seating: 27, latitude: -37.81591429, longitude: 144.96419158047297 },
{ name: "Hudsons Coffee", address: "84-86 Elizabeth Street MELBOURNE 3000", seating: 4, latitude: -37.81591429, longitude: 144.96419158047297 },
{ name: "C & B", address: "41-43 Little Collins Street MELBOURNE 3000", seating: 60, latitude: -37.81529087, longitude: 144.96423478944925 }


  

  ];

  const filteredCafes = cafes.filter((cafe: Cafe) =>
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

  const offsetLatLng = (lat: number, lng: number, index: number) => ({
    latitude: lat + (index * 0.00001),
    longitude: lng + (index * 0.00001),
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Café & Restaurant Finder</Text>

      {/* Search + Dropdown */}
      <View style={{ width: '100%' }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Café or Restaurant..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Dropdown Suggestions */}
        {searchQuery.length > 0 && (
          <ScrollView style={styles.dropdown}>
            {filteredCafes.slice(0, 5).map((item: Cafe, index: number) => (
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

      {/* Map */}
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
        >
          {filteredCafes.map((cafe: Cafe, index: number) => (
            <Marker
              key={index}
              coordinate={offsetLatLng(cafe.latitude, cafe.longitude, index)}
              title={cafe.name}
            >
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 30 }}>☕️</Text>
              </View>

              <Callout>
                <View style={{ width: 200 }}>
                  <Text style={{ fontWeight: 'bold' }}>{cafe.name}</Text>
                  <Text>{cafe.address}</Text>
                  <Text>Seats: {cafe.seating}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 100,
    paddingHorizontal: 20,
    backgroundColor: '#D6CABA',
    alignItems: 'center',
    flex: 1,
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
    height: Dimensions.get('window').height * 0.6,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 2,
    marginTop: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
