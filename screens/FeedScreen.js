import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, Text, View, FlatList, Image, 
  TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator, Modal, Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics'; //

const { width } = Dimensions.get('window');

// --- CONSTANTS MOVED OUTSIDE TO FIX ESLINT WARNING ---
const MASON_LAT = 38.8315;
const MASON_LONG = -77.3075;

// --- MOCK DATA SOURCE ---
const MOCK_DRIVERS = [
  { id: '2', full_name: 'Elena Gilbert', major: 'Biology', car_model: 'Honda Civic', lat: 38.8290, long: -77.3050, avatar_url: 'https://i.pravatar.cc/150?u=elena', rating: '5.0' },
  { id: '3', full_name: 'Marcus Smart', major: 'Economics', car_model: 'Jeep Wrangler', lat: 38.8400, long: -77.3150, avatar_url: 'https://i.pravatar.cc/150?u=marcus', rating: '4.7' },
  { id: '4', full_name: 'Sarah Jenkins', major: 'Government', car_model: 'Toyota Prius', lat: 38.8250, long: -77.2950, avatar_url: 'https://i.pravatar.cc/150?u=sarah', rating: '4.8' }
];

export default function FeedScreen({ navigation }) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Simulation States
  const [isRequesting, setIsRequesting] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [syncStatus, setSyncStatus] = useState("LOCATING NEARBY PATRIOTS...");

  // Optimized Fetch logic with empty dependency array
  const fetchNearbyDrivers = useCallback(async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      const processed = MOCK_DRIVERS.map(driver => {
        const distSq = Math.pow(driver.lat - MASON_LAT, 2) + Math.pow(driver.long - MASON_LONG, 2); 
        return { ...driver, milesAway: (Math.sqrt(distSq) * 69).toFixed(1) };
      });
      setDrivers(processed);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNearbyDrivers(); }, [fetchNearbyDrivers]);

  // UI-BASED LIVE SYNC SIMULATION
  const handleGoPress = (driver) => {
    setSelectedDriver(driver);
    setIsRequesting(true);
    setSyncStatus("PINGING NEARBY PATRIOTS...");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Sequence for Demo
    setTimeout(() => setSyncStatus(`${driver.full_name.split(' ')[0].toUpperCase()} IS VIEWING...`), 2000);
    
    setTimeout(() => {
      setSyncStatus("MATCHED! SYNCING CHAT...");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 4000);

    setTimeout(() => {
      setIsRequesting(false);
      navigation.navigate('ChatList', { 
        screen: 'Chat', 
        params: { name: driver.full_name, avatar: driver.avatar_url } 
      });
    }, 5500);
  };

  const renderDriver = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHero}>
        <Image source={{ uri: item.avatar_url }} style={styles.profilePic} />
        <View style={styles.cardInfo}>
          <View style={styles.nameHeader}>
            <Text style={styles.driverName}>{item.full_name}</Text>
            <View style={styles.ratingBox}>
              <Ionicons name="star" size={12} color="#FFCC33" />
              <Text style={styles.ratingVal}>{item.rating}</Text>
            </View>
          </View>
          <View style={styles.majorPill}><Text style={styles.majorText}>{item.major?.toUpperCase()}</Text></View>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons name="car-hatchback" size={18} color="#006633" />
          <View>
            <Text style={styles.detailLabel}>VEHICLE</Text>
            <Text style={styles.detailValue}>{item.car_model}</Text>
          </View>
        </View>
        <View style={styles.costBadge}>
          <Text style={styles.costText}>25</Text>
          <Text style={styles.costSub}>CREDITS</Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <View style={styles.distRow}>
          <Ionicons name="location" size={14} color="#006633" />
          <Text style={styles.distBadge}>{item.milesAway} miles away</Text>
        </View>
        <TouchableOpacity style={styles.goAction} onPress={() => handleGoPress(item)}>
          <Text style={styles.goBtnText}>GO!!!!</Text>
          <Ionicons name="flash" size={16} color="#006633" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.brandText}>PATRIOT<Text style={{color: '#FFCC33'}}>GO</Text></Text>
          <Text style={styles.subBrand}>MASON CARPOOL FEED</Text>
        </View>
        <TouchableOpacity style={styles.iconCircle}>
          <MaterialCommunityIcons name="molecule" size={22} color="#006633" />
        </TouchableOpacity>
      </View>

      {/* LIVE SYNC MODAL */}
      <Modal visible={isRequesting} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.requestCard}>
            <View style={styles.pulseContainer}>
               <ActivityIndicator size="large" color="#FFCC33" />
            </View>
            <Image source={{ uri: selectedDriver?.avatar_url }} style={styles.matchAvatar} />
            <Text style={styles.statusText}>{syncStatus}</Text>
            <TouchableOpacity onPress={() => setIsRequesting(false)}>
              <Text style={styles.cancelText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {loading ? (
        <ActivityIndicator style={{marginTop: 50}} color="#006633" />
      ) : (
        <FlatList 
          data={drivers} 
          keyExtractor={item => item.id} 
          renderItem={renderDriver} 
          contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 120 }} 
          showsVerticalScrollIndicator={false} 
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 20 },
  brandText: { fontSize: 24, fontWeight: '900', color: '#006633', letterSpacing: -1 },
  subBrand: { fontSize: 10, fontWeight: '800', color: '#BBB', letterSpacing: 2, marginTop: -2 },
  iconCircle: { width: 45, height: 45, borderRadius: 22, backgroundColor: '#F0F9F4', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#F9F9F9', borderRadius: 28, padding: 22, marginBottom: 20, borderWidth: 1, borderColor: '#F0F0F0' },
  cardHero: { flexDirection: 'row', alignItems: 'center' },
  profilePic: { width: 60, height: 60, borderRadius: 30, borderWidth: 3, borderColor: '#FFF' },
  cardInfo: { marginLeft: 15, flex: 1 },
  nameHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  driverName: { color: '#1A1A1A', fontSize: 18, fontWeight: '900' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  ratingVal: { color: '#FFCC33', fontWeight: '900', fontSize: 11, marginLeft: 4 },
  majorPill: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 6, alignSelf: 'flex-start' },
  majorText: { fontSize: 9, fontWeight: '900', color: '#006633' },
  cardDetails: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 15 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailLabel: { color: '#BBB', fontSize: 8, fontWeight: '900' },
  detailValue: { color: '#333', fontSize: 14, fontWeight: '700' },
  costBadge: { alignItems: 'center', backgroundColor: '#006633', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 16 },
  costText: { color: '#FFCC33', fontSize: 18, fontWeight: '900' },
  costSub: { color: '#FFF', fontSize: 7, fontWeight: '800' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 15 },
  distRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  distBadge: { color: '#888', fontWeight: '700', fontSize: 12 },
  goAction: { backgroundColor: '#F0F9F4', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15 },
  goBtnText: { color: '#006633', fontWeight: '900', marginRight: 6, fontSize: 14 },

  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 77, 38, 0.95)', justifyContent: 'center', alignItems: 'center', padding: 25 },
  requestCard: { backgroundColor: '#FFF', width: '100%', borderRadius: 35, padding: 40, alignItems: 'center' },
  pulseContainer: { marginBottom: 25, transform: [{ scale: 1.5 }] },
  matchAvatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: '#FFCC33', marginBottom: 20 },
  statusText: { fontSize: 11, fontWeight: '900', color: '#006633', letterSpacing: 2, textAlign: 'center', marginBottom: 30 },
  cancelText: { color: '#FF4444', fontWeight: '800', fontSize: 10, letterSpacing: 1 }
});
