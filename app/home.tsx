
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
  address: string;
  emoji: string;
  latitude: number;
  longitude: number;
}

export default function Home() {
  const mapRef = useRef<MapView | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [userCafes, setUserCafes] = useState<Cafe[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // User form
  const [newCafeName, setNewCafeName] = useState('');
  const [newCafeAddress, setNewCafeAddress] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🍩'); // default emoji

  const emojiOptions = ['🍩', '🍔', '🍕', '🍣', '🍜', '🍺', '🍷', '🧁', '🧋'];

const cafes: Cafe[] = [
  { name: "Mack Daddy Soprano", address: "Unit 1, Basement, 313-315 Flinders Lane MELBOURNE 3000", latitude: -37.81764132, longitude: 144.96386031352995, emoji: "☕️" },
  { name: "Grand Mercure Hotel", address: "321 Flinders Lane MELBOURNE 3000", latitude: -37.81773299, longitude: 144.9637651207598, emoji: "☕️" },
  { name: "Glick's Cakes & Bagels", address: "Part Ground, 325 Flinders Lane MELBOURNE 3000", latitude: -37.81775969, longitude: 144.9635004630143, emoji: "☕️" },
  { name: "Pronto On Flinders", address: "Part Ground, 335 Flinders Lane MELBOURNE 3000", latitude: -37.81784851, longitude: 144.96323530453128, emoji: "☕️" },
  { name: "Bluestone", address: "349 Flinders Lane MELBOURNE 3000", latitude: -37.81787421, longitude: 144.9628671327705, emoji: "☕️" },
  { name: "Degani Bakery Cafe", address: "Ground, 353 Flinders Lane MELBOURNE 3000", latitude: -37.81786117, longitude: 144.9627541135865, emoji: "☕️" },
  { name: "Rendezvous Hotels", address: "328 Flinders Street MELBOURNE 3000",latitude: -37.81819655, longitude: 144.96357963298587, emoji: "☕️" },
  { name: "Buffet Brasserie", address: "Shop 1, Ground, 300 Flinders Street MELBOURNE 3000", latitude: -37.81805897, longitude: 144.96400528370816, emoji: "☕️" },
  { name: "Vita Juice Energy For Life", address: "298 Flinders Street MELBOURNE 3000", latitude: -37.81807376, longitude: 144.9643643, emoji: "☕️" },
  { name: "Kimchi Tray", address: "294 Flinders Street MELBOURNE 3000", latitude: -37.81807376, longitude: 144.9643643, emoji: "☕️" },
  { name: "Cafe 34", address: "Shop 2, 34 Queen Street MELBOURNE 3000", latitude: -37.81799107, longitude: 144.96244692064585, emoji: "☕️" },
  { name: "Hudsons Coffee", address: "Ground, 359-365 Queen Street MELBOURNE 3000", latitude: -37.81799107, longitude: 144.96244692064585, emoji: "☕️" },
  { name: "Maha Bar & Grill", address: "Basement, 21-27 Queen Street MELBOURNE 3000", latitude: -37.81819441, longitude: 144.96253974509804, emoji: "☕️" },
  { name: "Migo's", address: "Shop 2, 289 Flinders Lane MELBOURNE 3000", latitude: -37.81718804, longitude: 144.96494250965242, emoji: "☕️" },
  { name: "Box Coffee", address: "10-282 Flinders Street MELBOURNE 3000", latitude: -37.81766129, longitude: 144.9650952, emoji: "☕️" },
  { name: "Roule Galette", address: "5 Flinders Lane MELBOURNE 3000", latitude: -37.81686107, longitude: 144.96631217224734, emoji: "☕️" },
  { name: "The Journal Cafe", address: "Part Ground, 253-265 Flinders Lane MELBOURNE 3000", latitude: -37.81706442, longitude: 144.9659121030714, emoji: "☕️" },
  { name: "Rice n' Rolls", address: "33 Flinders Lane MELBOURNE 3000",latitude: -37.81710426, longitude: 144.9654855543039, emoji: "☕️" },
  { name: "Superfino Delicatessen", address: "275-275 Flinders Lane MELBOURNE 3000", latitude: -37.81710426, longitude: 144.9654855543039, emoji: "☕️" },
  { name: "Indulgence Corner Bakery - Cafe", address: "37 Flinders Lane MELBOURNE 3000", latitude: -37.81710426, longitude: 144.9654855543039, emoji: "☕️" },
  { name: "La Citta", address: "11 Flinders Street MELBOURNE 3000", latitude: -37.81760872, longitude: 144.96563502357697, emoji: "☕️" },
  { name: "Red Nine", address: "15 Flinders Street MELBOURNE 3000", latitude: -37.81760872, longitude: 144.96563502357697, emoji: "☕️" },
  { name: "Waffle On", address: "20 Flinders Street MELBOURNE 3000", latitude: -37.81752071, longitude: 144.9660065689182, emoji: "☕️" },
  { name: "Flora Indian Restaurant", address: "238A Flinders Street MELBOURNE 3000", latitude: -37.81736333, longitude: 144.96637202927735, emoji: "☕️" },
  { name: "Ratee Thai", address: "Shop 3, Flinders Street MELBOURNE 3000", latitude: -37.81724956, longitude: 144.96656101271213, emoji: "☕️" },
  { name: "Jolly J's", address: "Shop 8, Flinders Street MELBOURNE 3000", latitude: -37.81724956, longitude: 144.96656101271213, emoji: "☕️" },
  { name: "Kim Sing Chinese Restaurant", address: "Shop 10, Flinders Street MELBOURNE 3000", latitude: -37.81724956, longitude: 144.96656101271213, emoji: "☕️" },
  { name: "Koury's Coffee Lounge", address: "Part Ground, 389 Market Street MELBOURNE 3000", latitude: -37.81850986, longitude: 144.9611428362183, emoji: "☕️" },
  { name: "Subway", address: "Unit 3, Ground, 1-5 Elizabeth Street MELBOURNE 3000", latitude: -37.81805797, longitude: 144.96461741084877, emoji: "☕️" },
  { name: "Pepperoni's", address: "7A Elizabeth Street MELBOURNE 3000", latitude: -37.8179333, longitude: 144.9645599261084, emoji: "☕️" },
  { name: "McDonald's", address: "11-15 Elizabeth Street MELBOURNE 3000", latitude: -37.8178304, longitude: 144.9645087687041, emoji: "☕️" },
  { name: "Mack Daddy Soprano", address: "Unit 1, Basement, 313-315 Flinders Lane MELBOURNE 3000", latitude: -37.81764132, longitude: 144.96386031352995, emoji: "☕️" },
  { name: "Grand Mercure Hotel", address: "321 Flinders Lane MELBOURNE 3000", latitude: -37.81773299, longitude: 144.9637651207598, emoji: "☕️" },
  { name: "Glick's Cakes & Bagels", address: "Part Ground, 325 Flinders Lane MELBOURNE 3000", latitude: -37.81775969, longitude: 144.9635004630143, emoji: "☕️" },
  { name: "Pronto On Flinders", address: "Part Ground, 335 Flinders Lane MELBOURNE 3000", latitude: -37.81784851, longitude: 144.96323530453128, emoji: "☕️" },
  { name: "Bluestone", address: "349 Flinders Lane MELBOURNE 3000", latitude: -37.81787421, longitude: 144.9628671327705, emoji: "☕️" },
  { name: "Degani Bakery Cafe", address: "Ground, 353 Flinders Lane MELBOURNE 3000", latitude: -37.81786117, longitude: 144.9627541135865, emoji: "☕️" },
  { name: "Rendezvous Hotels", address: "328 Flinders Street MELBOURNE 3000", latitude: -37.81819655, longitude: 144.96357963298587, emoji: "☕️" },
    { name: "Hudsons Coffee", address: "84-86 Elizabeth Street MELBOURNE 3000", latitude: -37.81591429, longitude: 144.96419158047297, emoji: "☕️" },
  { name: "Hudsons Coffee", address: "84-86 Elizabeth Street MELBOURNE 3000", latitude: -37.81591429, longitude: 144.96419158047297, emoji: "☕️" },
  { name: "C & B", address: "41-43 Little Collins Street MELBOURNE 3000", latitude: -37.81529087, longitude: 144.96423478944925, emoji: "☕️" },
  { name: "Brown Sugar Cafe", address: "25 Little Collins Street MELBOURNE 3000", latitude: -37.81529087, longitude: 144.96423478944925, emoji: "☕️" },
  { name: "Brown Sugar Cafe", address: "25 Little Collins Street MELBOURNE 3000", latitude: -37.81529087, longitude: 144.96423478944925, emoji: "☕️" },
  { name: "Cafe Meditteranean", address: "Shop 10, Ground, 93-107 Collins Street MELBOURNE 3000", latitude: -37.81529824, longitude: 144.9661124397802, emoji: "☕️" },
  { name: "Cafe Meditteranean", address: "Shop 10, Ground, 93-107 Collins Street MELBOURNE 3000", latitude: -37.81529824, longitude: 144.9661124397802, emoji: "☕️" },
  { name: "Thai Viet (Kiosk)", address: "115 Swanston Street MELBOURNE 3000", latitude: -37.81507151, longitude: 144.96579002216492, emoji: "☕️" },
  { name: "Delicious Delights", address: "Shop 12, 115 Swanston Street MELBOURNE 3000", latitude: -37.81507151, longitude: 144.96579002216492, emoji: "☕️" },
  { name: "Bistrot D'Orsay", address: "184 Collins Street MELBOURNE 3000", latitude: -37.81485337, longitude: 144.967286, emoji: "☕️" },
  { name: "Bistrot D'Orsay", address: "184 Collins Street MELBOURNE 3000", latitude: -37.81485337, longitude: 144.967286, emoji: "☕️" },
  { name: "Basso", address: "Shop 11, Basement, 195 Collins Street MELBOURNE 3000", latitude: -37.81450425, longitude: 144.9678570562652, emoji: "☕️" },
  { name: "The Victoria Hotel", address: "215 Little Collins Street MELBOURNE 3000", latitude: -37.81446635, longitude: 144.9670901938735, emoji: "☕️" },
  { name: "Comme", address: "7-19 Alfred Place MELBOURNE 3000", latitude: -37.81401415, longitude: 144.96991981992733, emoji: "☕️" },
  { name: "Lotto off Collins", address: "Shop, 120 Collins Street MELBOURNE 3000", latitude: -37.81400168, longitude: 144.9693250884545, emoji: "☕️" },
  { name: "Janil's Cafe", address: "Shop 1, 100 Collins Street MELBOURNE 3000", latitude: -37.81424109, longitude: 144.9700212911386, emoji: "☕️" },
  { name: "Dr Martin's Tavern", address: "86A Collins Street MELBOURNE 3000", latitude: -37.81393809, longitude: 144.97059378480083, emoji: "☕️" },
  { name: "Mediterranean Deli", address: "Shop 6, 80 Collins Street MELBOURNE 3000", latitude: -37.81364064, longitude: 144.97069571393286, emoji: "☕️" },
  { name: "Stamford Plaza Hotel", address: "109-119 Little Collins Street MELBOURNE 3000", latitude: -37.81354692, longitude: 144.97003477811086, emoji: "☕️" },
  { name: "Paris End Cafe", address: "Shop 2, Ground, 20 Collins Street MELBOURNE 3000", latitude: -37.81330625, longitude: 144.97290153805756, emoji: "☕️" },
  { name: "Engel's Sandwich Bar & Delicatessen", address: "Shop 1, Ground, 20 Collins Street MELBOURNE 3000", latitude: -37.81330625, longitude: 144.97290153805756, emoji: "☕️" },
  { name: "Nook Cafe", address: "19 Spring Street MELBOURNE 3000", latitude: -37.81278986, longitude: 144.97319412608084, emoji: "☕️" },
  { name: "Spring Cafe & Larder", address: "9-11 Spring Street MELBOURNE 3000", latitude: -37.81260097, longitude: 144.97319174333387, emoji: "☕️" },
  { name: "Excello Cafe", address: "Ground, 1-3 Spring Street MELBOURNE 3000", latitude: -37.81260097, longitude: 144.97319174333387, emoji: "☕️" },
  { name: "Royal Melbourne Hotel", address: "621-633 Bourke Street MELBOURNE 3000", latitude: -37.8168684, longitude: 144.95523720563205, emoji: "☕️" },
  { name: "The Bourke Armoury Cafe", address: "Part Ground, 655 Bourke Street MELBOURNE 3000", latitude: -37.81732136, longitude: 144.9545026234553, emoji: "☕️" },
  { name: "St Arnou", address: "582-584 Little Collins Street MELBOURNE 3000", latitude: -37.81742034, longitude: 144.95536140545556, emoji: "☕️" },
    { name: "Cafe Diy", address: "Shop 20, 121 William Street MELBOURNE 3000", latitude: -37.81636672, longitude: 144.95782326528942, emoji: "☕️" },
  { name: "Cafenatics Espresso Bar", address: "Shop 18, 121 William Street MELBOURNE 3000", latitude: -37.81636672, longitude: 144.95782326528942, emoji: "☕️" },
  { name: "Cafe Pazzo", address: "Shop 15, 121 William Street MELBOURNE 3000", latitude: -37.81636672, longitude: 144.95782326528942, emoji: "☕️" },
  { name: "St James Take Away Food", address: "Shop 13, 121 William Street MELBOURNE 3000", latitude: -37.81636672, longitude: 144.95782326528942, emoji: "☕️" },
  { name: "Lure's Gourmet Sandwich Bar", address: "Part Ground, 575 Bourke Street MELBOURNE 3000", latitude: -37.81651449, longitude: 144.95667920481293, emoji: "☕️" },
  { name: "Lure's Gourmet Sandwich Bar", address: "Part Ground, 575 Bourke Street MELBOURNE 3000", latitude: -37.81651449, longitude: 144.95667920481293, emoji: "☕️" },
  { name: "Nex Cafe", address: "Part Ground, 140-146 King Street MELBOURNE 3000", latitude: -37.81673697, longitude: 144.95628515442587, emoji: "☕️" },
  { name: "Bambini Barrista", address: "Shop 7, 530 Little Collins Street MELBOURNE 3000", latitude: -37.81688112, longitude: 144.9571194391247, emoji: "☕️" },
  { name: "Salto Cafe & Bistro", address: "Shop 9, 532 Little Collins Street MELBOURNE 3000", latitude: -37.81688112, longitude: 144.9571194391247, emoji: "☕️" },
  { name: "Madisons Restaurant Bar Lounge", address: "Part Ground, 461 Bourke Street MELBOURNE 3000", latitude: -37.81549329, longitude: 144.96018234285577, emoji: "☕️" },
  { name: "Cafe Felice", address: "Part Ground, 461 Bourke Street MELBOURNE 3000", latitude: -37.81549329, longitude: 144.96018234285577, emoji: "☕️" },
  { name: "RACV City Club", address: "501-501 Bourke Street MELBOURNE 3000", latitude: -37.81588698, longitude: 144.9595939, emoji: "☕️" },
  { name: "CQ Bar", address: "Part Mezzanine 0, 123-0 Queen Street MELBOURNE 3000", latitude: -37.81581364, longitude: 144.9606455105183, emoji: "☕️" },
  { name: "Hudsons Coffee", address: "Part Ground, 455 Bourke Street MELBOURNE 3000", latitude: -37.8152734, longitude: 144.96051681010874, emoji: "☕️" },
  { name: "Basso", address: "Shop 16, 385 Bourke Street MELBOURNE 3000", latitude: -37.81493078, longitude: 144.9629309900082, emoji: "☕️" },
  { name: "Delicious Malaysian Cuisine & Vietnam Noodle", address: "Shop 10, 399-403 Bourke Street MELBOURNE 3000", latitude: -37.81513905, longitude: 144.96220519105626, emoji: "☕️" },
    { name: "Nutrients Pty Ltd", address: "Shop 10, 399-403 Bourke Street MELBOURNE 3000", latitude: -37.81513905, longitude: 144.96220519105626, emoji: "☕️" },
  { name: "Sarpinos Pizzeria", address: "Part 399 Bourke Street MELBOURNE 3000", latitude: -37.81513905, longitude: 144.96220519105626, emoji: "☕️" },
  { name: "Cafe 396", address: "396 Little Collins Street MELBOURNE 3000", latitude: -37.81556472, longitude: 144.96154034339344, emoji: "☕️" },
  { name: "Mr Birds Myo", address: "Ground, 384 Little Collins Street MELBOURNE 3000", latitude: -37.81560784, longitude: 144.9617476861053, emoji: "☕️" },
  { name: "Octane Espresso", address: "5 Little Collins Street MELBOURNE 3000", latitude: -37.81560784, longitude: 144.9617476861053, emoji: "☕️" },
  { name: "Oriental Tea House", address: "378-380 Little Collins Street MELBOURNE 3000", latitude: -37.81549303, longitude: 144.9620043350199, emoji: "☕️" },
  { name: "Oriental Tea House", address: "378-380 Little Collins Street MELBOURNE 3000", latitude: -37.81549303, longitude: 144.9620043350199, emoji: "☕️" },
  { name: "Gills Diner", address: "Part Ground, 360-360 Little Collins Street MELBOURNE 3000", latitude: -37.81528153, longitude: 144.96264789373743, emoji: "☕️" },
  { name: "Spontini Restaurant", address: "Basement, 20-22 McKillop Street MELBOURNE 3000", latitude: -37.81514717, longitude: 144.961828, emoji: "☕️" },
  { name: "Bare Pear", address: "Part LwrGround, 148 Queen Street MELBOURNE 3000", latitude: -37.8150928, longitude: 144.96117676554394, emoji: "☕️" },
  { name: "Bare Pear", address: "Part LwrGround, 148 Queen Street MELBOURNE 3000", latitude: -37.8150928, longitude: 144.96117676554394, emoji: "☕️" },
  { name: "J & Ty Cafe", address: "Part Ground, 140 Queen Street MELBOURNE 3000", latitude: -37.81539088, longitude: 144.96118536656502, emoji: "☕️" },
  { name: "The Pancake Parlour", address: "Shop 7, Basement, 283-297 Bourke Street MELBOURNE 3000", latitude: -37.81420712, longitude: 144.96523277165764, emoji: "☕️" },
  { name: "Riva Bar Cafe", address: "Shop 9, 309-325 Bourke Street MELBOURNE 3000", latitude: -37.81445862, longitude: 144.96454098046968, emoji: "☕️" },
  { name: "Sushi Monger", address: "Shop 17, 309-325 Bourke Street MELBOURNE 3000", latitude: -37.81445862, longitude: 144.96454098046968, emoji: "☕️" },
  { name: "Sushi Monger", address: "Shop 17, 309-325 Bourke Street MELBOURNE 3000", latitude: -37.81445862, longitude: 144.96454098046968, emoji: "☕️" },
  { name: "Riva Bar Cafe", address: "Shop 9, 309-325 Bourke Street MELBOURNE 3000", latitude: -37.81445862, longitude: 144.96454098046968, emoji: "☕️" },
  { name: "Malaysian Oriental Wok", address: "Shop 15, 309-325 Bourke Street MELBOURNE 3000", latitude: -37.81445862, longitude: 144.96454098046968, emoji: "☕️" },
  { name: "Camille Lucie", address: "Shop 24, Bourke Street MELBOURNE 3000", latitude: -37.81438908, longitude: 144.96397349236796, emoji: "☕️" },
  { name: "Red Rooster", address: "Unit 2, Basement, 341-357 Bourke Street MELBOURNE 3000", latitude: -37.81443467, longitude: 144.9636714886029, emoji: "☕️" },
  { name: "Gourmet Curry Hut", address: "Shop 3, 318-322 Little Collins Street MELBOURNE 3000", latitude: -37.81488233, longitude: 144.96401670012526, emoji: "☕️" },
  { name: "Gordons Cafe & Bar", address: "Shop 5, 306 Little Collins Street MELBOURNE 3000", latitude: -37.81473002, longitude: 144.9643574, emoji: "☕️" },
  { name: "Golden Tower Restaurant", address: "145 Swanston Street MELBOURNE 3000", latitude: -37.81433679, longitude: 144.96570882135708, emoji: "☕️" },
  { name: "Swanston Walk Cafe Bar", address: "157 Swanston Street MELBOURNE 3000", latitude: -37.81407862, longitude: 144.9655920366865, emoji: "☕️" },
  { name: "Swanston Walk Cafe Bar", address: "157 Swanston Street MELBOURNE 3000", latitude: -37.81407862, longitude: 144.9655920366865, emoji: "☕️" },
  { name: "Cafe Tono", address: "181 Russell Street MELBOURNE 3000", latitude: -37.81311087, longitude: 144.96797750661435, emoji: "☕️" },
  { name: "O Sushi", address: "143 Russell Street MELBOURNE 3000", latitude: -37.81311087, longitude: 144.96797750661435, emoji: "☕️" },
  { name: "Chatter Box - Curry & Noodle Bar", address: "Shop 18, 239 Bourke Street MELBOURNE 3000", latitude: -37.81374539, longitude: 144.96662896262313, emoji: "☕️" },


];

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

    if (!newCafeName.trim() || !newCafeAddress.trim()) {
      Alert.alert('Please fill in both the name and address');
      return;
    }

    const newCafe: Cafe = {
      name: newCafeName.trim(),
      address: newCafeAddress.trim(),
      emoji: selectedEmoji,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
    };

    setUserCafes(prev => [...prev, newCafe]);

    setNewCafeName('');
    setNewCafeAddress('');
    setSelectedEmoji('🍩');
    setSelectedLocation(null);

    Alert.alert('New café added!');
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
              <Marker
                key={index}
                coordinate={{ latitude: cafe.latitude, longitude: cafe.longitude }}
              >
                <Text style={{ fontSize: 28 }}>{cafe.emoji}</Text>
                <Callout>
                  <View style={{ width: 200 }}>
                    <Text style={{ fontWeight: 'bold' }}>{cafe.name}</Text>
                    <Text>{cafe.address}</Text>
                  </View>
                </Callout>
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
            value={newCafeAddress}
            onChangeText={setNewCafeAddress}
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

