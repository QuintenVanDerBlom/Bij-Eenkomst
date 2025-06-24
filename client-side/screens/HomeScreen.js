import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AppNavigator from '../navigation/AppNavigator';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig'; // pas dit pad aan als nodig
import { signOut } from 'firebase/auth';
import { useAuth } from '../auth/AuthContext';


export default function HomeScreen() {
    const navigation = useNavigation();
    const [fact, setFact] = useState('Even een feitje ophalen...');
    const { currentUser, userData } = useAuth(); // Get authentication state

    useEffect(() => {
        const fetchFact = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'bijen- en vlinder weetje'));
                const facts = snapshot.docs.map(doc => doc.data().weetje);
                if (facts.length === 0) {
                    setFact('Geen feitjes gevonden.');
                    return;
                }

                const storedIndex = await AsyncStorage.getItem('factIndex');
                const nextIndex = storedIndex ? (parseInt(storedIndex) + 1) % facts.length : 0;

                setFact(facts[nextIndex]);
                await AsyncStorage.setItem('factIndex', nextIndex.toString());
            } catch (err) {
                console.error('Fout bij ophalen feitjes:', err);
                setFact('Feitje ophalen is mislukt.');
            }
        };

        fetchFact();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            Alert.alert('Uitgelogd', 'Je bent succesvol uitgelogd');
        } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Fout', 'Er is een fout opgetreden bij uitloggen');
        }
    };

    const confirmLogout = () => {
        Alert.alert(
            'Uitloggen',
            'Weet je zeker dat je wilt uitloggen?',
            [
                { text: 'Annuleren', style: 'cancel' },
                { text: 'Uitloggen', onPress: handleLogout, style: 'destructive' }
            ]
        );
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={require('../assets/achtergrond-Bijeenkomst.jpg')}
                style={StyleSheet.absoluteFill}
                blurRadius={8}
            />

            <ScrollView contentContainerStyle={styles.container}>

                {/* Titel met bij icoon */}
                <View style={styles.titleRow}>
                    <Image
                        source={require('../assets/bee.png')}
                        style={styles.beeIcon}
                        resizeMode="contain"
                    />
                    <Text style={styles.pageTitle}>Bij Eenkomst</Text>
                </View>

                {/* Conditional Authentication Buttons */}
                <View style={styles.authButtonsContainer}>
                    {currentUser ? (
                        // Show logout button and welcome message when logged in
                        <View style={styles.loggedInContainer}>
                            {userData && (
                                <Text style={styles.welcomeText}>
                                    Welkom, {userData.full_name}!
                                </Text>
                            )}
                            <TouchableOpacity
                                style={[styles.authButton, styles.logoutButton]}
                                onPress={confirmLogout}
                            >
                                <Text style={[styles.authButtonText, styles.logoutButtonText]}>
                                    Uitloggen
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        // Show login/register buttons when not logged in
                        <>
                            <TouchableOpacity
                                style={styles.authButton}
                                onPress={() => navigation.navigate('Login')}
                            >
                                <Text style={styles.authButtonText}>Inloggen</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.authButton, styles.registerButton]}
                                onPress={() => navigation.navigate('Register')}
                            >
                                <Text style={styles.authButtonText}>Registreren</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>


                <View style={styles.factContainer}>
                    <Text style={styles.factBig}>{fact}</Text>
                </View>

            </ScrollView>

            {/* Disclaimerblok met link onderaan */}
            <View style={styles.disclaimerBox}>
                <Text style={styles.description}>
                    Wij zijn studenten en dit is een testplatform. De inhoud is bedoeld voor educatieve doeleinden en kan onvolledig of onjuist zijn.
                </Text>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.loginLink}>Secret Admin login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('TestMarijn')}>
                    <Text style={styles.loginLink}>to Admin page</Text>
                </TouchableOpacity>
            </View>

            <AppNavigator />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        gap: 10,
    },
    beeIcon: {
        width: 80,
        height: 80,
    },
    pageTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'yellow',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    // Auth buttons container
    authButtonsContainer: {
        position: 'absolute',
        top: 20,
        right: 16,
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    // Logged in container
    loggedInContainer: {
        alignItems: 'flex-end',
        gap: 8,
    },
    welcomeText: {
        color: 'yellow',
        fontSize: 12,
        fontWeight: '600',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
        maxWidth: 150,
        textAlign: 'right',
    },
    authButton: {
        backgroundColor: 'rgba(255, 215, 0, 0.9)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ffd700',
    },
    registerButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderColor: '#ffd700',
    },
    logoutButton: {
        backgroundColor: 'rgba(220, 20, 60, 0.9)', // Crimson red
        borderColor: '#dc143c',
    },
    authButtonText: {
        color: '#444',
        fontSize: 14,
        fontWeight: '600',
    },
    logoutButtonText: {
        color: '#fff', // White text for logout button
    },
    factContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
        marginBottom: 80,
        paddingHorizontal: 20,
    },
    factBig: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'yellow',
        textAlign: 'center',
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    disclaimerBox: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 16,
        borderRadius: 20,
        position: 'absolute',
        bottom: 80,
        left: '5%',
        right: '5%',
        width: '90%',
    },
    description: {
        color: '#ddd',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 8,
    },
    loginLink: {
        color: '#ffd700',
        fontSize: 14,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});
