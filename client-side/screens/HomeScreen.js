import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ImageBackground,
    SafeAreaView,
    TouchableOpacity,
    Image,
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

                {/* Titel met bij icoon */}
                <View style={styles.titleRow}>
                    <Image
                        source={require('../assets/bee.png')} // pas dit pad aan als nodig
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

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
        bottom: 80,  // ruimte tussen navbar en disclaimer
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
