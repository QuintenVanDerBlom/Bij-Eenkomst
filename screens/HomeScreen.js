import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ImageBackground,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppNavigator from '../navigation/AppNavigator';

export default function HomeScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={require('../assets/achtergrond-Bijeenkomst.jpg')}
                style={StyleSheet.absoluteFill}
                blurRadius={8}
            />

            <ScrollView contentContainerStyle={styles.container}>
                {/* Grote gele tekst bovenin */}
                <Text style={styles.pageTitle}>🐝 Bij Eenkomst</Text>

                <View style={styles.contentBox}>
                    <Text style={styles.factTitle}>Bijenfeitje:</Text>
                    <Text style={styles.fact}>You are beeutiful</Text>

                    <Text style={styles.description}>
                        Bijen en vlinders zijn essentieel voor het ecosysteem. Ze helpen
                        bij het bestuiven van planten, wat cruciaal is voor de voedselketen.
                        Bescherm ze door bloemen te planten en geen pesticiden te gebruiken.
                    </Text>

                    {/* Kleine link naar inloggen */}
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginLink}>Klik hier om in te loggen</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <AppNavigator />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingBottom: 100,
        paddingHorizontal: 16,
    },
    pageTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'yellow',
        textAlign: 'center',
        marginTop: 16,
        textShadowColor: '#000',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    contentBox: {
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 20,
        borderRadius: 16,
        marginTop: 24,
    },
    factTitle: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 4,
        textAlign: 'center',
    },
    fact: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        color: '#ddd',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 12,
    },
    loginLink: {
        color: '#ffd700',
        fontSize: 12,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});
