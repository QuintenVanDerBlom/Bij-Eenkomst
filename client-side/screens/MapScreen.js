import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import AppNavigator from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons'; // of 'react-native-vector-icons/Ionicons' in bare RN

export default function MapScreen() {
    const navigation = useNavigation();
    const [pins, setPins] = React.useState([
        { id: 1, lat: 51.9225, lon: 4.47917, title: 'Locatie A' },
        { id: 2, lat: 51.924, lon: 4.481, title: 'Locatie B' },
    ]);
    const [newPin, setNewPin] = React.useState(null);
    const [pinTitle, setPinTitle] = React.useState('');

    const handleMapPress = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setNewPin({ latitude, longitude });
        setPinTitle('');
    };

    const addPin = () => {
        if (newPin && pinTitle) {
            setPins(prevPins => [
                ...prevPins,
                { 
                    id: Date.now(),
                    lat: newPin.latitude,
                    lon: newPin.longitude,
                    title: pinTitle
                }
            ]);
            setNewPin(null);
            setPinTitle('');
        }
    };

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
                onPress={handleMapPress}
            >
                {pins.map((pin) => (
                    <Marker
                        key={pin.id}
                        coordinate={{ latitude: pin.lat, longitude: pin.lon }}
                        title={pin.title}
                    />
                ))}
                {newPin && (
                    <Marker
                        coordinate={newPin}
                        title="Nieuwe locatie"
                        pinColor="blue"
                    />
                )}
            </MapView>
            {newPin && (
                <View style={styles.pinInputContainer}>
                    <TextInput
                        style={styles.pinInput}
                        placeholder="Voer een naam in voor de nieuwe locatie"
                        onChangeText={(text) => setPinTitle(text)}
                        value={pinTitle}
                    />
                    <TouchableOpacity style={styles.pinButton} onPress={() => addPin(pinTitle)}>
                        <Text style={styles.pinButtonText}>Voeg toe</Text>
                    </TouchableOpacity>
                </View>
            )}

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
    addLocationButton: {
        position: 'absolute',
        bottom: 60,
        right: 20,
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addLocationButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    pinInputContainer: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    pinInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    pinButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    pinButtonText: {
        color: 'white',
        fontWeight: 'bold',
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
