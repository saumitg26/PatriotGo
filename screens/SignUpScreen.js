import React, { useState } from 'react';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform 
} from 'react-native';
import { supabase } from '../services/supabaseClient';

export default function SignUpScreen({ navigation }) {
  // Auth & Profile State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [major, setMajor] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [gender, setGender] = useState('');
  const [car, setCar] = useState('');
  const [location, setLocation] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // 1. Validation
    if (!email || !password || !name || !major || !gradYear) {
      Alert.alert("Missing Info", "Please fill out all required fields to join the ride.");
      return;
    }

    if (!email.includes('gmu.edu')) {
      Alert.alert("Mason Access Only", "Please use your @gmu.edu or @masonlive.gmu.edu email.");
      return;
    }

    try {
      setLoading(true);

      // 2. Create the Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) throw authError;

      // 3. Insert Additional Info into 'profiles' table
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: authData.user.id, // Primary Key link to Auth
              full_name: name,
              major: major,
              grad_year: parseInt(gradYear), // Ensure it's a number
              gender: gender,
              car_model: car,
              location: location
            }
          ]);

        if (profileError) throw profileError;

        Alert.alert(
          "Patriot Registered!", 
          "Success! Check your Mason email for a confirmation link."
        );
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.brand}>PATRIOT<Text style={{color: '#FFCC33'}}>GO</Text></Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>JOIN THE CARPOOL REVOLUTION</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Identity</Text>
          <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#999" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Gender" placeholderTextColor="#999" value={gender} onChangeText={setGender} />
          
          <Text style={styles.sectionTitle}>Academic Details</Text>
          <TextInput style={styles.input} placeholder="Major" placeholderTextColor="#999" value={major} onChangeText={setMajor} />
          <TextInput style={styles.input} placeholder="Graduation Year" placeholderTextColor="#999" keyboardType="numeric" value={gradYear} onChangeText={setGradYear} />

          <Text style={styles.sectionTitle}>Ride Info</Text>
          <TextInput style={styles.input} placeholder="Car (Make/Model or 'None')" placeholderTextColor="#999" value={car} onChangeText={setCar} />
          <TextInput style={styles.input} placeholder="Commute Starting Point" placeholderTextColor="#999" value={location} onChangeText={setLocation} />

          <Text style={styles.sectionTitle}>Credentials</Text>
          <TextInput style={styles.input} placeholder="Mason Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />

          <TouchableOpacity style={styles.btn} onPress={handleSignUp} disabled={loading}>
            {loading ? <ActivityIndicator color="#006633" /> : <Text style={styles.btnText}>REGISTER NOW</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
            <Text style={styles.loginText}>HAVE AN ACCOUNT? <Text style={{fontWeight: '900', color: '#006633'}}>LOG IN</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 30, backgroundColor: '#FFFFFF', paddingTop: 60, paddingBottom: 50 },
  header: { alignItems: 'center', marginBottom: 25 },
  brand: { fontSize: 38, fontWeight: '900', color: '#006633', letterSpacing: -1 },
  divider: { height: 4, width: 40, backgroundColor: '#FFCC33', marginVertical: 8, borderRadius: 2 },
  subtitle: { fontSize: 10, fontWeight: '800', color: '#BBB', letterSpacing: 2 },
  
  form: { marginTop: 5 },
  sectionTitle: { fontSize: 11, fontWeight: '900', color: '#006633', marginBottom: 8, marginTop: 10, marginLeft: 5, textTransform: 'uppercase', opacity: 0.5 },
  input: { 
    backgroundColor: '#F9F9F9', 
    borderRadius: 15, 
    padding: 16, 
    marginBottom: 12, 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#333',
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  
  btn: { 
    backgroundColor: '#FFCC33',
    padding: 20, 
    borderRadius: 15, 
    alignItems: 'center', 
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  btnText: { color: '#006633', fontWeight: '900', letterSpacing: 1.5, fontSize: 16 },
  
  loginLink: { marginTop: 25, alignItems: 'center' },
  loginText: { fontSize: 11, color: '#AAA', fontWeight: '600', letterSpacing: 0.5 }
});
