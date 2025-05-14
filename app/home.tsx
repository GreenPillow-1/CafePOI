import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const cafes = [
    { name: "Mack Daddy Soprano", address: "Unit 1, Basement, 313-315 Flinders Lane MELBOURNE 3000", seating: 60, latitude: -37.81764132, longitude: 144.96386031352995 },
    { name: "Grand Mercure Hotel", address: "321 Flinders Lane MELBOURNE 3000", seating: 20, latitude: -37.81773299, longitude: 144.9637651207598 },
    { name: "Glick's Cakes & Bagels", address: "Part Ground, 325 Flinders Lane MELBOURNE 3000", seating: 30, latitude: -37.81775969, longitude: 144.9635004630143 },
    { name: "Pronto On Flinders", address: "Part Ground, 335 Flinders Lane MELBOURNE 3000", seating: 53, latitude: -37.81784851, longitude: 144.96323530453128 },
    { name: "Bluestone", address: "349 Flinders Lane MELBOURNE 3000", seating: 140, latitude: -37.81787421, longitude: 144.9628671327705 },
    { name: "Degani Bakery Cafe", address: "Ground, 353 Flinders Lane MELBOURNE 3000", seating: 60, latitude: -37.81786117, longitude: 144.9627541135865 },
    { name: "Rendezvous Hotels", address: "328 Flinders Street MELBOURNE 3000", seating: 100, latitude: -37.81819655, longitude: 144.96357963298587 },
    { name: "Buffet Brasserie", address: "Shop 1, Ground, 300 Flinders Street MELBOURNE 3000", seating: 20, latitude: -37.81805897, longitude: 144.96400528370816 },
    { name: "Vita Juice Energy For Life", address: "298 Flinders Street MELBOURNE 3000", seating: 11, latitude: -37.81807376, longitude: 144.9643643 },
    { name: "Kimchi Tray", address: "294 Flinders Street MELBOURNE 3000", seating: 40, latitude: -37.81807376, longitude: 144.9643643 },
    { name: "Cafe 34", address: "Shop 2, 34 Queen Street MELBOURNE 3000", seating: 16, latitude: -37.81799107, longitude: 144.96244692064585 },
    { name: "Hudsons Coffee", address: "Ground, 359-365 Queen Street MELBOURNE 3000", seating: 12, latitude: -37.81799107, longitude: 144.96244692064585 },
    { name: "Maha Bar & Grill", address: "Basement, 21-27 Queen Street MELBOURNE 3000", seating: 20, latitude: -37.81819441, longitude: 144.96253974509804 },
    { name: "Migo's", address: "Shop 2, 289 Flinders Lane MELBOURNE 3000", seating: 16, latitude: -37.81718804, longitude: 144.96494250965242 },
    { name: "Box Coffee", address: "10-282 Flinders Street MELBOURNE 3000", seating: 12, latitude: -37.81766129, longitude: 144.9650952 },
    { name: "Roule Galette", address: "5 Flinders Lane MELBOURNE 3000", seating: 10, latitude: -37.81686107, longitude: 144.96631217224734 },
    { name: "The Journal Cafe", address: "Part Ground, 253-265 Flinders Lane MELBOURNE 3000", seating: 60, latitude: -37.81706442, longitude: 144.9659121030714 },
    { name: "Rice n' Rolls", address: "33 Flinders Lane MELBOURNE 3000", seating: 8, latitude: -37.81710426, longitude: 144.9654855543039 },
    { name: "Superfino Delicatessen", address: "275-275 Flinders Lane MELBOURNE 3000", seating: 6, latitude: -37.81710426, longitude: 144.9654855543039 },
    { name: "Indulgence Corner Bakery - Cafe", address: "37 Flinders Lane MELBOURNE 3000", seating: 2, latitude: -37.81710426, longitude: 144.9654855543039 },
    { name: "La Citta", address: "11 Flinders Street MELBOURNE 3000", seating: 20, latitude: -37.81760872, longitude: 144.96563502357697 },
    { name: "Red Nine", address: "15 Flinders Street MELBOURNE 3000", seating: 25, latitude: -37.81760872, longitude: 144.96563502357697 },
    { name: "Waffle On", address: "20 Flinders Street MELBOURNE 3000", seating: 7, latitude: -37.81752071, longitude: 144.9660065689182 },
    { name: "Flora Indian Restaurant", address: "238A Flinders Street MELBOURNE 3000", seating: 75, latitude: -37.81736333, longitude: 144.96637202927735 },
    { name: "Ratee Thai", address: "Shop 3, Flinders Street MELBOURNE 3000", seating: 10, latitude: -37.81724956, longitude: 144.96656101271213 },
    { name: "Jolly J's", address: "Shop 8, Flinders Street MELBOURNE 3000", seating: 40, latitude: -37.81724956, longitude: 144.96656101271213 },
    { name: "Kim Sing Chinese Restaurant", address: "Shop 10, Flinders Street MELBOURNE 3000", seating: 40, latitude: -37.81724956, longitude: 144.96656101271213 }
  ];

  const filteredCafes = cafes.filter(cafe => cafe.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const offsetLatLng = (lat: number, lng: number, index: number) => ({
    latitude: lat + (index * 0.00001),
    longitude: lng + (index * 0.00001),
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome to CaféFinder</Text>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Café..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.mapWrapper}>
        <MapView
          style={styles.map}
          mapType="standard"
          initialRegion={{
            latitude: -37.8176,
            longitude: 144.9638,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {filteredCafes.map((cafe, index) => (
            <Marker
              key={index}
              coordinate={offsetLatLng(cafe.latitude, cafe.longitude, index)}
              title={cafe.name}
            >
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
  searchInput: {
    height: 40,
    width: '90%',
    borderColor: '#ddd',
    borderWidth: 1,
    paddingLeft: 10,
borderRadius: 10,
marginBottom: 20,
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
