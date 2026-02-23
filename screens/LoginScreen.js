import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, 
  StatusBar, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { supabase } from '../services/supabaseClient'; // Ensure this path is correct

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [netID, setNetID] = useState(''); // We'll treat this as the email prefix
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- SSO LOGIC (Keeping your existing Cognito setup) ---
  const discovery = {
    authorizationEndpoint: 'https://us-east-1ajdpaxco3.auth.us-east-1.amazoncognito.com/login',
    tokenEndpoint: 'https://us-east-1ajdpaxco3.auth.us-east-1.amazoncognito.com/oauth2/token',
    revocationEndpoint: 'https://us-east-1ajdpaxco3.auth.us-east-1.amazoncognito.com/oauth2/revoke',
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: '4qqigiekfgl525le0qmb3ub05h',
      scopes: ['email', 'openid', 'phone', 'profile'],
      redirectUri: AuthSession.makeRedirectUri({ scheme: 'patriotgo' }),
      responseType: AuthSession.ResponseType.Code,
    },
    discovery
  );

  const handleUserNavigation = useCallback(async (authCode) => {
    navigation.replace('Main');
  }, [navigation]);

  useEffect(() => {
    if (response?.type === 'success') {
      handleUserNavigation(response.params.code);
    }
  }, [response, handleUserNavigation]);

  const handleSSOLogin = () => {
    if (request) {
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      promptAsync();
    }
  };

  // --- SUPABASE MANUAL LOGIN ---
  const handleManualLogin = async () => {
    if (!netID || !password) {
      Alert.alert("Credentials Required", "Please enter your Mason NetID and password.");
      return;
    }

    setLoading(true);
    const fullEmail = `${netID.trim().toLowerCase()}@gmu.edu`;

    const { error } = await supabase.auth.signInWithPassword({
      email: fullEmail,
      password: password,
    });

    if (error) {
      Alert.alert("Login Failed", error.message);
      setLoading(false);
    } else {
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.replace('Main');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#006633', '#004D26', '#002211']} style={styles.fullBg}>
        <View style={styles.content}>
          <View style={styles.topSection}>
            <Text style={styles.preTitle}>SECURE ACCESS</Text>
            <View style={styles.logoRow}>
              <Text style={styles.logoText}>PATRIOT</Text>
              <Text style={[styles.logoText, styles.goldText]}>GO</Text>
            </View>
          </View>

          <View style={styles.formContainer}>
            <TouchableOpacity style={styles.ssoBtn} onPress={handleSSOLogin}>
              <View style={styles.innerBtn}>
                <MaterialCommunityIcons name="shield-account" size={22} color="#FFF" />
                <Text style={styles.ssoText}>SIGN IN WITH MASON SSO</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>OR NETID</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.inputBox}>
              <MaterialCommunityIcons name="account-outline" size={20} color="rgba(255,255,255,0.6)" />
              <TextInput 
                style={styles.input}
                placeholder="NetID"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={netID}
                onChangeText={setNetID}
                autoCapitalize="none"
              />
              <Text style={styles.emailSuffix}>@gmu.edu</Text>
            </View>

            <View style={[styles.inputBox, { marginTop: 15 }]}>
              <MaterialCommunityIcons name="lock-outline" size={20} color="rgba(255,255,255,0.6)" />
              <TextInput 
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255,255,255,0.3)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={handleManualLogin} disabled={loading}>
              <LinearGradient colors={['#FFCC33', '#EBB700']} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.btnGradient}>
                {loading ? (
                  <ActivityIndicator color="#004D26" />
                ) : (
                  <>
                    <Text style={styles.loginText}>CONTINUE</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="#004D26" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* CREATE ACCOUNT LINK */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('SignUp')} 
              style={styles.signUpLink}
            >
              <Text style={styles.signUpText}>
                NEW TO PATRIOTGO? <Text style={styles.signUpGold}>CREATE ACCOUNT</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fullBg: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 35, justifyContent: 'center' },
  topSection: { marginBottom: 40 },
  preTitle: { color: '#FFCC33', fontSize: 10, fontWeight: '800', letterSpacing: 4, marginBottom: 8 },
  logoRow: { flexDirection: 'row', alignItems: 'baseline' },
  logoText: { fontSize: 42, fontWeight: '300', color: '#FFF', letterSpacing: -1 },
  goldText: { fontWeight: '800', color: '#FFCC33' },
  formContainer: { width: '100%' },
  ssoBtn: { height: 56, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', justifyContent: 'center' },
  innerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  ssoText: { color: '#FFF', fontSize: 13, fontWeight: '600', letterSpacing: 1, marginLeft: 12 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  line: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: { color: 'rgba(255,255,255,0.3)', marginHorizontal: 15, fontSize: 9, fontWeight: '700' },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, height: 56, paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  input: { flex: 1, color: '#FFF', fontSize: 15, marginLeft: 12 },
  emailSuffix: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: '600' },
  loginBtn: { marginTop: 25, height: 60, borderRadius: 18, overflow: 'hidden' },
  btnGradient: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  loginText: { color: '#004D26', fontSize: 15, fontWeight: '800', letterSpacing: 1, marginRight: 10 },
  signUpLink: { marginTop: 25, alignItems: 'center' },
  signUpText: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  signUpGold: { color: '#FFCC33', fontWeight: '900' }
});
