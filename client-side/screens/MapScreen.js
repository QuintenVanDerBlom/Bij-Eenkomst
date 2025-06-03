import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, TextInput, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import AppNavigator from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://145.24.223.126:5000/api/locations';

export default function MapScreen() {
    const navigation = useNavigation();
    const [pins, setPins] = useState([]);
    const [newPin, setNewPin] = useState(null);
    const [pinTitle, setPinTitle] = useState('');
    const [editingPin, setEditingPin] = useState(null);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch locations');
            const data = await response.json();
            setPins(data);
        } catch (error) {
            console.error('Error fetching locations:', error);
            Alert.alert('Error', 'Failed to fetch locations');
        }
    };

    const handleMapPress = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setNewPin({ latitude, longitude });
        setPinTitle('');
        setEditingPin(null);
    };

    const addPin = async () => {
        if (newPin && pinTitle) {
            try {
                const newLocation = {
                    lat: newPin.latitude,
                    lon: newPin.longitude,
                    title: pinTitle
                };
                
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newLocation),
                });
                if (!response.ok) throw new Error('Failed to add location');
                const data = await response.json();
                setPins(prevPins => [...prevPins, data]);
                setNewPin(null);
                setPinTitle('');
            } catch (error) {
                console.error('Error adding location:', error);
                Alert.alert('Error', 'Failed to add location');
            }
        }
    };

    const handlePinPress = (pin) => {
        setEditingPin(pin);
        setPinTitle(pin.title);
        setNewPin(null);
    };

    const updatePin = async () => {
        if (editingPin && pinTitle) {
            try {
                const updatedLocation = {
                    ...editingPin,
                    title: pinTitle
                };
                
                const response = await fetch(`${API_URL}/${editingPin.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedLocation),
                });
                if (!response.ok) throw new Error('Failed to update location');
                const data = await response.json();
                setPins(prevPins => 
                    prevPins.map(pin => 
                        pin.id === editingPin.id ? data : pin
                    )
                );
                setEditingPin(null);
                setPinTitle('');
            } catch (error) {
                console.error('Error updating location:', error);
                Alert.alert('Error', 'Failed to update location');
            }
        }
    };

    const deletePin = async () => {
        if (editingPin) {
            Alert.alert(
                'Confirm Delete',
                `Are you sure you want to delete "${editingPin.title}"?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                const response = await fetch(`${API_URL}/${editingPin.id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                });
                                if (!response.ok) throw new Error('Failed to delete location');
                                setPins(prevPins => prevPins.filter(pin => pin.id !== editingPin.id));
                                setEditingPin(null);
                                setPinTitle('');
                            } catch (error) {
                                console.error('Error deleting location:', error);
                                Alert.alert('Error', 'Failed to delete location');
                            }
                        },
                    },
                ]
            );
        }
    };

    return (
        <View style={styles.container}>
            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                    <Text style={styles.backText}>Terug</Text>
                </TouchableOpacity>
            </View>

            {/* Map */}
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
                        onPress={() => handlePinPress(pin)}
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

            {/* Input for new/edit pin */}
            {(newPin || editingPin) && (
                <View style={styles.pinInputContainer}>
                    <TextInput
                        style={styles.pinInput}
                        placeholder={editingPin ? "Wijzig locatie naam" : "Voer een naam in voor de nieuwe locatie"}
                        onChangeText={(text) => setPinTitle(text)}
                        value={pinTitle}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.pinButton, styles.cancelButton]} 
                            onPress={() => {
                                setNewPin(null);
                                setEditingPin(null);
                                setPinTitle('');
                            }}
                        >
                            <Text style={styles.pinButtonText}>Annuleren</Text>
                        </TouchableOpacity>
                        {editingPin && (
                            <TouchableOpacity 
                                style={[styles.pinButton, styles.deleteButton]} 
                                onPress={deletePin}
                            >
                                <Text style={styles.pinButtonText}>Verwijderen</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity 
                            style={[styles.pinButton, styles.saveButton]} 
                            onPress={editingPin ? updatePin : addPin}
                        >
                            <Text style={styles.pinButtonText}>
                                {editingPin ? 'Bijwerken' : 'Voeg toe'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Bottom navigation */}
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
        flex: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#f44336',
    },
    saveButton: {
        backgroundColor: '#007AFF',
    },
    deleteButton: {
        backgroundColor: '#d32f2f',
    },
});