// RegisterScreen.js
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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

export default function RegisterScreen() {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        full_name: '',
        mail_address: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);

    // Get default user role
    const getDefaultRole = async () => {
        try {
            const q = query(collection(db, 'roles'), where('name', '==', 'user'));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                return querySnapshot.docs[0].id;
            }
            // If no user role exists, create one
            const roleDoc = await addDoc(collection(db, 'roles'), { name: 'user' });
            return roleDoc.id;
        } catch (error) {
            console.error('Error getting default role:', error);
            return null;
        }
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const validateForm = () => {
        const { full_name, mail_address, password, confirmPassword } = formData;

        if (!full_name.trim()) {
            Alert.alert('Fout', 'Voer je volledige naam in');
            return false;
        }

        if (!mail_address.trim()) {
            Alert.alert('Fout', 'Voer je e-mailadres in');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(mail_address)) {
            Alert.alert('Fout', 'Voer een geldig e-mailadres in');
            return false;
        }

        if (password.length < 6) {
            Alert.alert('Fout', 'Wachtwoord moet minimaal 6 karakters zijn');
            return false;
        }

        if (password !== confirmPassword) {
            Alert.alert('Fout', 'Wachtwoorden komen niet overeen');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);

        try {
            // Create Firebase Auth user
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.mail_address,
                formData.password
            );

            // Get default role
            const defaultRoleId = await getDefaultRole();

            // Create user document in Firestore
            await addDoc(collection(db, 'users'), {
                full_name: formData.full_name,
                mail_address: formData.mail_address,
                password: formData.password, // In production, don't store plain text passwords
                role_id: defaultRoleId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                firebase_uid: userCredential.user.uid,
            });

            Alert.alert(
                'Registratie Succesvol',
                'Je account is aangemaakt!',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );

        } catch (error) {
            console.error('Registration error:', error);
            let errorMessage = 'Er is een fout opgetreden bij registratie';

            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Dit e-mailadres is al in gebruik';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Wachtwoord is te zwak';
            }

            Alert.alert('Registratie Fout', errorMessage);
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
                <Text style={styles.headerTitle}>Registreren</Text>
                <View />
            </View>

            <View style={styles.form}>
                <Text style={styles.title}>Account Aanmaken</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Volledige naam"
                    value={formData.full_name}
                    onChangeText={(text) => handleInputChange('full_name', text)}
                    autoCapitalize="words"
                />

                <TextInput
                    style={styles.input}
                    placeholder="E-mailadres"
                    value={formData.mail_address}
                    onChangeText={(text) => handleInputChange('mail_address', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Wachtwoord"
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    secureTextEntry
                />

                <TextInput
                    style={styles.input}
                    placeholder="Bevestig wachtwoord"
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                    secureTextEntry
                />

                <TouchableOpacity
                    style={[styles.registerButton, loading && styles.buttonDisabled]}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#444" />
                    ) : (
                        <Text style={styles.registerButtonText}>Registreren</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>
                        Heb je al een account? Inloggen
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
    registerButton: {
        backgroundColor: '#ffd700',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    registerButtonText: {
        fontWeight: '700',
        fontSize: 16,
        color: '#444',
    },
    loginLink: {
        textAlign: 'center',
        color: '#007BFF',
        fontSize: 16,
    },
});
