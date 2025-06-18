// LoginScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const getUserData = async (firebaseUid) => {
        try {
            const q = query(collection(db, 'users'), where('firebase_uid', '==', firebaseUid));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
            }
            return null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    };

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Fout', 'Vul alle velden in');
            return;
        }

        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userData = await getUserData(userCredential.user.uid);

            if (userData) {
                // Check if user is admin
                const roleQuery = query(collection(db, 'roles'), where('__name__', '==', userData.role_id));
                const roleSnapshot = await getDocs(roleQuery);

                let isAdmin = false;
                if (!roleSnapshot.empty) {
                    const roleData = roleSnapshot.docs[0].data();
                    isAdmin = roleData.name === 'admin';
                }

                Alert.alert(
                    'Inloggen Succesvol',
                    `Welkom ${userData.full_name}!`,
                    [{
                        text: 'OK',
                        onPress: () => {
                            if (isAdmin) {
                                navigation.navigate('AdminScreen');
                            } else {
                                navigation.navigate('Home');
                            }
                        }
                    }]
                );
            } else {
                Alert.alert('Fout', 'Gebruikersgegevens niet gevonden');
            }
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Er is een fout opgetreden bij inloggen';

            if (error.code === 'auth/user-not-found') {
                errorMessage = 'Gebruiker niet gevonden';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Onjuist wachtwoord';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Ongeldig e-mailadres';
            }

            Alert.alert('Inlog Fout', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="#444" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Inloggen</Text>
                <View />
            </View>

            <View style={styles.form}>
                <Text style={styles.title}>Welkom Terug</Text>

                <TextInput
                    style={styles.input}
                    placeholder="E-mailadres"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Wachtwoord"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={[styles.loginButton, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#444" />
                    ) : (
                        <Text style={styles.loginButtonText}>Inloggen</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerLink}>
                        Nog geen account? Registreren
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#444',
    },
    form: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        justifyContent: 'flex-start',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#444',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 20,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#ffd700',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    loginButtonText: {
        fontWeight: '700',
        fontSize: 16,
        color: '#444',
    },
    registerLink: {
        textAlign: 'center',
        color: '#007BFF',
        fontSize: 16,
    },
});
