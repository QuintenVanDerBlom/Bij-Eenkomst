import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import AppNavigator from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons'; // of 'react-native-vector-icons/Ionicons' in bare RN

export default function InfoScreen() {
    const navigation = useNavigation();

    const pins = [
        { id: 1, lat: 51.9225, lon: 4.47917, title: 'Locatie A' },
        { id: 2, lat: 51.924, lon: 4.481, title: 'Locatie B' },
    ];

    return (
        <View style={styles.container}>
            {/* Terugknop bovenin */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                    <Text style={styles.backText}>Terug</Text>
                </TouchableOpacity>
            </View>

            {/* Kaart */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 51.9225,
                    longitude: 4.47917,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                {pins.map((pin) => (
                    <Marker
                        key={pin.id}
                        coordinate={{ latitude: pin.lat, longitude: pin.lon }}
                        title={pin.title}
                    />
                ))}
            </MapView>

            {/* Onderbalk */}
            <AppNavigator />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    header: {
        position: 'absolute',
        top: 40,
        left: 16,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 8,
        padding: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        marginLeft: 6,
        fontSize: 16,
        color: '#333',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
});
