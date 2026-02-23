import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  Image, ScrollView, Alert, ActivityIndicator, SafeAreaView 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer'; 
import { supabase } from '../services/supabaseClient'; //
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Form States - Matched to Supabase Columns
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      const { data: { user } } = await supabase.auth.getUser(); //
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single(); //

        if (data) {
          setName(data.full_name || '');
          setMajor(data.major || '');
          setBio(data.bio || '');
          setAvatarUrl(data.avatar_url || null);
        }
      }
    } catch (error) {
      console.log('Load error:', error.message);
    } finally {
      setFetching(false);
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
      base64: true,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0]);
    }
  };

  async function uploadImage(asset) {
    try {
      setIsUploading(true);
      const { data: { user } } = await supabase.auth.getUser(); //
      
      if (!user) throw new Error("Session expired. Please re-login.");

      // Path: profiles/{user_id}/{timestamp}.png
      const fileExt = asset.uri.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, decode(asset.base64), {
          contentType: `image/${fileExt}`,
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('profiles').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl); // Update state for the final Save
      
    } catch (error) {
      Alert.alert('Upload Error', error.message);
    } finally {
      setIsUploading(false);
    }
  }

  const handleSaveForever = async () => {
    try {
      setLoading(true);
      
      // SESSION GUARD: Fixes the 'id of null' error
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        Alert.alert("Session Expired", "Please log out and log back in to refresh your Patriot token.");
        return;
      }

      // UPSERT: Saves data to 'profiles' table permanently
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: name,
        major: major,
        bio: bio,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      });

      if (error) throw error;

      Alert.alert("Patriot Sync", "Profile saved forever! 🟢");
      navigation.goBack(); // Auto-refreshes ProfileScreen
    } catch (error) {
      Alert.alert("Save Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <View style={styles.center}><ActivityIndicator color="#006633" /></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-down" size={28} color="#006633" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EDIT PROFILE</Text>
        <TouchableOpacity onPress={handleSaveForever} disabled={loading || isUploading}>
          {loading ? <ActivityIndicator size="small" color="#006633" /> : <Text style={styles.saveText}>SYNC</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* AVATAR UPLOAD */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} disabled={isUploading} style={styles.imageWrapper}>
            <Image source={{ uri: avatarUrl || 'https://i.pravatar.cc/300?u=mason' }} style={styles.avatar} />
            <View style={styles.cameraCircle}>
              <Ionicons name="camera" size={18} color="#FFF" />
            </View>
            {isUploading && <View style={styles.uploadOverlay}><ActivityIndicator color="#FFCC33" /></View>}
          </TouchableOpacity>
          <Text style={styles.avatarHint}>TAP TO CHANGE PATRIOT PHOTO</Text>
        </View>

        {/* INPUTS - URBAN MASON STYLE */}
        <View style={styles.form}>
          <View style={styles.inputBox}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Saumit Guduguntla" />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>MAJOR • DEPARTMENT</Text>
            <TextInput style={styles.input} value={major} onChangeText={setMajor} placeholder="Computer Science" />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>BIO</Text>
            <TextInput 
              style={[styles.input, styles.bioInput]} 
              value={bio} 
              onChangeText={setBio} 
              multiline 
              placeholder="Tell other Patriots about yourself..." 
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  headerTitle: { fontSize: 12, fontWeight: '900', letterSpacing: 2, color: '#1A1A1A' },
  saveText: { color: '#006633', fontWeight: '900', fontSize: 14 },
  backBtn: { padding: 4 },
  
  scrollContent: { paddingBottom: 60 },
  avatarSection: { alignItems: 'center', marginTop: 30 },
  imageWrapper: { position: 'relative' },
  avatar: { width: 140, height: 140, borderRadius: 55, backgroundColor: '#F8F8F8', borderWidth: 1, borderColor: '#EEE' },
  cameraCircle: { position: 'absolute', bottom: -5, right: -5, backgroundColor: '#006633', padding: 10, borderRadius: 20, borderWidth: 4, borderColor: '#FFF' },
  uploadOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 55, justifyContent: 'center', alignItems: 'center' },
  avatarHint: { marginTop: 15, fontSize: 9, fontWeight: '800', color: '#BBB', letterSpacing: 1 },

  form: { padding: 25 },
  inputBox: { marginBottom: 25 },
  label: { fontSize: 10, fontWeight: '900', color: '#006633', letterSpacing: 1.5, marginBottom: 10 },
  input: { backgroundColor: '#F9F9F9', borderRadius: 18, padding: 20, fontSize: 16, fontWeight: '600', color: '#1A1A1A' },
  bioInput: { height: 120, textAlignVertical: 'top' }
});
