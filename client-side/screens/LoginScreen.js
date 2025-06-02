import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import AppNavigator from '../navigation/AppNavigator';
import HomeScreen from "./HomeScreen";

export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setloading] = useState('');

    const handleLogin = async () => {
        if (!email) {
            Alert.alert("Vul uw e-mail in")
        }

        if (!password) {
            Alert.alert("Vul uw wachtwoord in")
        }

        setLoading(true)

        try {
            const response = await fetch('https://jouw-api-url.com/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Inloggen mislukt');
            }

            if (data.role === 'admin') {
                navigation.navigate('AdminDashboard');
            } else {
                Alert.alert('Geen toegang', 'Alleen admins kunnen inloggen.');
                navigation.navigate('Home')
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Fout', error.message);
        }

        setLoading(false);

    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Header met terugknop */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={28} color="#444" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Inloggen</Text>
                <View style={{ width: 28 }} /> {/* Placeholder om header in balans te houden */}
            </View>

            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Wachtwoord"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
            </View>

            <AppNavigator />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        justifyContent: 'flex-start',
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
    },
    loginButtonText: {
        fontWeight: '700',
        fontSize: 16,
        color: '#444',
    },
});
