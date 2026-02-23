import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, 
  SafeAreaView, ActivityIndicator, Alert 
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { supabase } from '../services/supabaseClient'; 

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [])
  );

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      }
    } catch (error) {
      console.error('Fetch Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Log out of PatriotGo?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: async () => {
          await supabase.auth.signOut();
          // App.js listener handles the navigation reset automatically!
      }}
    ]);
  };

  if (loading && !profile) {
    return <View style={styles.loader}><ActivityIndicator size="large" color="#006633" /></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.headerNav}>
          <Text style={styles.brandText}>PATRIOT<Text style={{color: '#FFCC33'}}>GO</Text></Text>
          <TouchableOpacity 
            style={styles.iconCircle} 
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="options-outline" size={22} color="#006633" />
          </TouchableOpacity>
        </View>

        {/* HERO SECTION */}
        <View style={styles.hero}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={{ uri: profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name}&background=006633&color=fff` }} 
              style={styles.profilePic} 
            />
            {profile?.car_model && (
              <LinearGradient colors={['#FFCC33', '#E6B800']} style={styles.driverBadge}>
                <MaterialCommunityIcons name="car-check" size={16} color="#004D26" />
              </LinearGradient>
            )}
          </View>
          <Text style={styles.nameText}>{profile?.full_name || 'Patriot Student'}</Text>
          <View style={styles.majorPill}>
            <Text style={styles.majorText}>
              {profile?.major?.toUpperCase() || 'UNDECIDED'} • CLASS OF {profile?.grad_year || '----'}
            </Text>
          </View>
        </View>

        {/* BENTO STATS GRID */}
        <View style={styles.bentoSection}>
          <LinearGradient colors={['#006633', '#004D26']} style={styles.mainBento}>
            <Text style={styles.bentoVal}>{profile?.total_wallet_balance || '0'}</Text>
            <Text style={styles.bentoLabel}>MASON CREDITS</Text>
          </LinearGradient>
          
          <View style={styles.sideBento}>
            <View style={styles.miniCard}>
              <View style={styles.miniRow}>
                <Ionicons name="leaf" size={14} color="#006633" />
                <Text style={styles.miniVal}>12.4kg</Text>
              </View>
              <Text style={styles.miniLabel}>CO2 SAVED</Text>
            </View>
            <View style={styles.miniCard}>
              <View style={styles.miniRow}>
                <Ionicons name="git-compare" size={14} color="#006633" />
                <Text style={styles.miniVal}>24</Text>
              </View>
              <Text style={styles.miniLabel}>TRIPS COMPLETED</Text>
            </View>
          </View>
        </View>

        {/* DETAILS SECTION */}
        <View style={styles.cardSection}>
          <Text style={styles.cardHeading}>COMMUTE DETAILS</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="map-marker-radius" size={20} color="#006633" />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>PRIMARY LOCATION</Text>
                <Text style={styles.detailValue}>{profile?.location || 'Fairfax Campus'}</Text>
              </View>
            </View>
            
            <View style={[styles.detailItem, { marginTop: 20 }]}>
              <MaterialCommunityIcons name="car-hatchback" size={20} color="#006633" />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>VEHICLE</Text>
                <Text style={styles.detailValue}>{profile?.car_model || 'No vehicle registered'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* BIO CARD */}
        <View style={styles.cardSection}>
          <Text style={styles.cardHeading}>BIO</Text>
          <View style={styles.glassCard}>
            <Text style={styles.bioContent}>
              {profile?.bio || `Hey! I'm ${profile?.full_name?.split(' ')[0] || 'a Patriot'}, a ${profile?.major} major graduating in ${profile?.grad_year}. Let's save some gas!`}
            </Text>
          </View>
        </View>

        {/* LOGOUT ACTION */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout-variant" size={18} color="#FF4444" />
          <Text style={styles.logoutText}>TERMINATE SESSION</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  headerNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 20 },
  brandText: { fontSize: 22, fontWeight: '900', color: '#006633', letterSpacing: -1 },
  iconCircle: { width: 45, height: 45, borderRadius: 22, backgroundColor: '#F0F9F4', justifyContent: 'center', alignItems: 'center' },
  hero: { alignItems: 'center', marginTop: 30, marginBottom: 35 },
  avatarWrapper: { position: 'relative' },
  profilePic: { width: 130, height: 130, borderRadius: 65, borderWidth: 5, borderColor: '#F8F8F8' },
  driverBadge: { position: 'absolute', bottom: 5, right: 5, padding: 6, borderRadius: 15, borderWidth: 3, borderColor: '#FFF' },
  nameText: { fontSize: 28, fontWeight: '900', color: '#1A1A1A', marginTop: 15 },
  majorPill: { backgroundColor: '#E8F5E9', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 12, marginTop: 8 },
  majorText: { fontSize: 10, fontWeight: '900', color: '#006633', letterSpacing: 1 },
  bentoSection: { flexDirection: 'row', paddingHorizontal: 25, gap: 12, marginBottom: 35 },
  mainBento: { flex: 1.2, borderRadius: 28, padding: 22, justifyContent: 'center', elevation: 4, shadowColor: '#006633', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: {width: 0, height: 5} },
  bentoVal: { color: '#FFCC33', fontSize: 36, fontWeight: '900' },
  bentoLabel: { color: '#FFF', fontSize: 9, fontWeight: '800', letterSpacing: 1.5, marginTop: 4, opacity: 0.9 },
  sideBento: { flex: 1, gap: 12 },
  miniCard: { flex: 1, backgroundColor: '#F9F9F9', borderRadius: 22, padding: 15, justifyContent: 'center', borderWidth: 1, borderColor: '#F0F0F0' },
  miniRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  miniVal: { fontSize: 18, fontWeight: '900', color: '#1A1A1A' },
  miniLabel: { fontSize: 7, fontWeight: '800', color: '#AAA', letterSpacing: 0.5, marginTop: 2 },
  cardSection: { paddingHorizontal: 25, marginBottom: 30 },
  cardHeading: { fontSize: 10, fontWeight: '900', color: '#BBB', letterSpacing: 2, marginBottom: 12, marginLeft: 5 },
  detailCard: { backgroundColor: '#F9F9F9', padding: 22, borderRadius: 24, borderWidth: 1, borderColor: '#F0F0F0' },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  detailTextContainer: { flex: 1 },
  detailLabel: { fontSize: 8, fontWeight: '800', color: '#AAA', letterSpacing: 1 },
  detailValue: { fontSize: 14, fontWeight: '700', color: '#333', marginTop: 2 },
  glassCard: { backgroundColor: '#F9F9F9', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#F0F0F0' },
  bioContent: { fontSize: 14, color: '#555', lineHeight: 22, fontWeight: '500' },
  logoutBtn: { marginHorizontal: 25, marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#FFF0F0', padding: 18, borderRadius: 20 },
  logoutText: { color: '#FF4444', fontWeight: '900', fontSize: 11, letterSpacing: 1.5 }
});
