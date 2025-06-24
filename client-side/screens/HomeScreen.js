import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { useAuth } from '../auth/AuthContext';
import { auth } from '../firebaseConfig';
import AppNavigator from '../navigation/AppNavigator';

export default function HomeScreen() {
    const navigation = useNavigation();
    const { currentUser, userData } = useAuth(); // Get authentication state

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

                {/* Grote bijenfeitje in het midden */}
                <View style={styles.factContainer}>
                    <Text style={styles.factBig}>🐝 Bijen zijn essentieel voor het ecosysteem!</Text>
                </View>
            </ScrollView>

            {/* Disclaimerblok met link onderaan */}
            <View style={styles.disclaimerBox}>
                <Text style={styles.description}>
                    Wij zijn studenten en dit is een testplatform. De inhoud is bedoeld voor educatieve doeleinden en kan onvolledig of onjuist zijn.
                </Text>

                {/* Development/Admin links */}
                <View style={styles.devLinksContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Admin Login</Text>
                    </TouchableOpacity>

                    <Text style={styles.linkSeparator}>•</Text>

                    <TouchableOpacity onPress={() => navigation.navigate('TestMarijn')}>
                        <Text style={styles.loginLink}>Test Page</Text>
                    </TouchableOpacity>
                </View>
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
        marginBottom: 12,
    },
    devLinksContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    loginLink: {
        color: '#ffd700',
        fontSize: 14,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    linkSeparator: {
        color: '#ddd',
        fontSize: 14,
    },
});
