import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, TextInput, Alert, Modal, ScrollView, Image, KeyboardAvoidingView, Pressable, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import AppNavigator from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


const beeMarker = require('../assets/bee-marker.png');
const butterflyMarker = require('../assets/butterfly-marker.png');

export default function MapScreen({ route }) {
    const navigation = useNavigation();
    const { focusLocation } = route.params || {};
    const mapRef = useRef(null);

    const [pins, setPins] = useState([]);
    const [newPin, setNewPin] = useState(null);
    const [pinTitle, setPinTitle] = useState('');
    const [pinDescription, setPinDescription] = useState('');
    const [pinType, setPinType] = useState('bee'); // Default to bee
    const [editingPin, setEditingPin] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [locationSaved, setLocationSaved] = useState(false);

    useEffect(() => {
        fetchLocations();
    }, []);

    // Focus op de geselecteerde locatie wanneer deze wordt doorgegeven
    useEffect(() => {
        if (focusLocation && mapRef.current) {
            // Focus op de geselecteerde locatie
            setTimeout(() => {
                mapRef.current.animateToRegion({
                    latitude: focusLocation.latitude,
                    longitude: focusLocation.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }, 1000);
            }, 500);
        }
    }, [focusLocation]);

    const fetchLocations = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'locations'));
            const locations = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPins(locations);
        } catch (error) {
            console.error('Error fetching locations:', error);
            Alert.alert('Error', 'Failed to fetch locations');
        }
    };

    const handleMapPress = (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setNewPin({ latitude, longitude });
        setPinTitle('');
        setPinDescription('');
        setPinType('bee'); // Reset to default
        setCreateModalVisible(true);
    };

    const addPin = async () => {
        if (newPin && pinTitle) {
            try {
                const newLocation = {
                    latitude: newPin.latitude,
                    longitude: newPin.longitude,
                    name: pinTitle,
                    description: pinDescription,
                    type: pinType, // Add type field
                    user_id: "SOXmjhQBfQMFjJKJlGBKlKF2CJH2"
                };

                const docRef = await addDoc(collection(db, 'locations'), newLocation);
                const addedLocation = {
                    id: docRef.id,
                    ...newLocation
                };

                setPins(prevPins => [...prevPins, addedLocation]);
                setNewPin(null);
                setPinTitle('');
                setPinDescription('');
                setPinType('bee');
                setCreateModalVisible(false);
            } catch (error) {
                console.error('Error adding location:', error);
                Alert.alert('Error', 'Failed to add location');
            }
        }
    };

    const cancelCreatePin = () => {
        setNewPin(null);
        setPinTitle('');
        setPinDescription('');
        setPinType('bee');
        setCreateModalVisible(false);
    };

    const handlePinPress = (pin) => {
        setSelectedLocation(pin);
        setModalVisible(true);
    };

    const startEditing = () => {
        setEditingPin(selectedLocation);
        setPinTitle(selectedLocation.name);
        setPinDescription(selectedLocation.description || '');
        setPinType(selectedLocation.type || 'bee');
        setModalVisible(false);
        setSelectedLocation(null);
    };

    const updatePin = async () => {
        if (editingPin && pinTitle) {
            try {
                const updatedLocation = {
                    latitude: editingPin.latitude,
                    longitude: editingPin.longitude,
                    name: pinTitle,
                    description: pinDescription,
                    type: pinType,
                    user_id: editingPin.user_id
                };

                await updateDoc(doc(db, 'locations', editingPin.id), updatedLocation);

                setPins(prevPins =>
                    prevPins.map(pin =>
                        pin.id === editingPin.id ? { ...updatedLocation, id: editingPin.id } : pin
                    )
                );
                setEditingPin(null);
                setPinTitle('');
                setPinDescription('');
                setPinType('bee');
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
                `Are you sure you want to delete "${editingPin.name}"?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                await deleteDoc(doc(db, 'locations', editingPin.id));
                                setPins(prevPins => prevPins.filter(pin => pin.id !== editingPin.id));
                                setEditingPin(null);
                                setPinTitle('');
                                setPinDescription('');
                                setPinType('bee');
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

    // Function to get the appropriate marker image
    const getMarkerImage = (type) => {
        return type === 'butterfly' ? butterflyMarker : beeMarker;
    };

    const markLocationAsVisited = async (location) => {
        try {
            const json = await AsyncStorage.getItem('visitedLocations');
            const visited = json != null ? JSON.parse(json) : [];

            const alreadyVisited = visited.some(item => item.name === location.name);
            if (!alreadyVisited) {
                visited.push(location);
                await AsyncStorage.setItem('visitedLocations', JSON.stringify(visited));
                setLocationSaved(true);
            } else {
                setLocationSaved(true);
            }
        } catch (e) {
            console.error('Fout bij opslaan locatie:', e);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header with back button and list button */}
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                    <Text style={styles.headerButtonText}>Terug</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('LocationsList')}
                    style={[styles.headerButton, styles.listButton]}
                >
                    <Ionicons name="list" size={24} color="#333" />
                    <Text style={styles.headerButtonText}>Lijst</Text>
                </TouchableOpacity>
            </View>

            {/* Map */}
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: focusLocation?.latitude || 51.9225,
                    longitude: focusLocation?.longitude || 4.47917,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                onPress={handleMapPress}
            >
                {pins.map((pin) => (
                    <Marker
                        key={pin.id}
                        coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
                        title={pin.name}
                        onPress={() => handlePinPress(pin)}
                        anchor={{ x: 0.5, y: 0.5 }}
                        centerOffset={{ x: 0, y: 0 }}
                    >
                        <View style={styles.markerContainer}>
                            <Image
                                source={getMarkerImage(pin.type)}
                                style={styles.markerImage}
                            />
                        </View>
                    </Marker>
                ))}
                {newPin && (
                    <Marker
                        key="new-pin"
                        coordinate={newPin}
                        title="Nieuwe locatie"
                        anchor={{ x: 0.5, y: 0.5 }}
                        centerOffset={{ x: 0, y: 0 }}
                    >
                        <View style={styles.markerContainer}>
                            <Image
                                source={getMarkerImage(pinType)}
                                style={styles.markerImage}
                            />
                        </View>
                    </Marker>
                )}
            </MapView>

            {/* Modern Edit Modal */}
            {editingPin && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={!!editingPin}
                    onRequestClose={() => setEditingPin(null)}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalKeyboardAvoidingView}
                    >
                        <View style={styles.modernModalOverlay}>
                            <View style={styles.modernModalContainer}>
                                {/* Close button */}
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => {
                                        setEditingPin(null);
                                        setPinTitle('');
                                        setPinDescription('');
                                        setPinType('bee');
                                    }}
                                >
                                    <Ionicons name="close" size={24} color="#666" />
                                </TouchableOpacity>

                                {/* Content */}
                                <ScrollView style={styles.modernModalContent} showsVerticalScrollIndicator={false}>
                                    {/* Title */}
                                    <Text style={styles.modernModalTitle}>Locatie Bewerken</Text>

                                    {/* Input section */}
                                    <View style={styles.detailsSection}>
                                        <View style={styles.detailRow}>
                                            <View style={styles.detailIconContainer}>
                                                <Ionicons name="create-outline" size={20} color="#291700" />
                                            </View>
                                            <View style={styles.detailTextContainer}>
                                                <Text style={styles.detailLabel}>Naam</Text>
                                                <TextInput
                                                    style={styles.modernInput}
                                                    placeholder="Wijzig locatie naam"
                                                    onChangeText={(text) => setPinTitle(text)}
                                                    value={pinTitle}
                                                />
                                            </View>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <View style={styles.detailIconContainer}>
                                                <Ionicons name="document-text-outline" size={20} color="#291700" />
                                            </View>
                                            <View style={styles.detailTextContainer}>
                                                <Text style={styles.detailLabel}>Beschrijving</Text>
                                                <TextInput
                                                    style={[styles.modernInput, styles.modernTextArea]}
                                                    placeholder="Wijzig beschrijving"
                                                    onChangeText={(text) => setPinDescription(text)}
                                                    value={pinDescription}
                                                    multiline
                                                    numberOfLines={4}
                                                />
                                            </View>
                                        </View>

                                        {/* Type selector */}
                                        <View style={styles.detailRow}>
                                            <View style={styles.detailIconContainer}>
                                                <Ionicons name="options-outline" size={20} color="#291700" />
                                            </View>
                                            <View style={styles.detailTextContainer}>
                                                <Text style={styles.detailLabel}>Type</Text>
                                                <View style={styles.typeSelector}>
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.typeButton,
                                                            pinType === 'bee' && styles.typeButtonActive
                                                        ]}
                                                        onPress={() => setPinType('bee')}
                                                    >
                                                        <Text style={[
                                                            styles.typeButtonText,
                                                            pinType === 'bee' && styles.typeButtonTextActive
                                                        ]}>🐝 Bij</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.typeButton,
                                                            pinType === 'butterfly' && styles.typeButtonActive
                                                        ]}
                                                        onPress={() => setPinType('butterfly')}
                                                    >
                                                        <Text style={[
                                                            styles.typeButtonText,
                                                            pinType === 'butterfly' && styles.typeButtonTextActive
                                                        ]}>🦋 Vlinder</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </ScrollView>

                                {/* Action buttons */}
                                <View style={styles.modernModalButtonContainer}>
                                    <TouchableOpacity
                                        style={[styles.modernButton, styles.modernDeleteButton]}
                                        onPress={deletePin}
                                    >
                                        <Ionicons name="trash-outline" size={20} color="white" />
                                        <Text style={styles.modernButtonTextWhite}>Verwijderen</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.modernEditButton}
                                        onPress={updatePin}
                                    >
                                        <Ionicons name="checkmark-outline" size={20} color="black" />
                                        <Text style={styles.modernButtonText}>Bijwerken</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            )}

            {/* Modern Create Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={createModalVisible}
                onRequestClose={() => setCreateModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalKeyboardAvoidingView}
                >
                    <View style={styles.modernModalOverlay}>
                        <View style={styles.modernModalContainer}>
                            {/* Close button */}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={cancelCreatePin}
                            >
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>

                            {/* Content */}
                            <ScrollView style={styles.modernModalContent} showsVerticalScrollIndicator={false}>
                                {/* Title */}
                                <Text style={styles.modernModalTitle}>Nieuwe Locatie</Text>

                                {/* Details section */}
                                <View style={styles.detailsSection}>
                                    <View style={styles.detailRow}>
                                        <View style={styles.detailIconContainer}>
                                            <Ionicons name="location-outline" size={20} color="#291700" />
                                        </View>
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Coördinaten</Text>
                                            <Text style={styles.detailValue}>
                                                {newPin?.latitude?.toFixed(6)}, {newPin?.longitude?.toFixed(6)}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <View style={styles.detailIconContainer}>
                                            <Ionicons name="create-outline" size={20} color="#291700" />
                                        </View>
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Naam</Text>
                                            <TextInput
                                                style={styles.modernInput}
                                                placeholder="Naam van de locatie"
                                                onChangeText={(text) => setPinTitle(text)}
                                                value={pinTitle}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <View style={styles.detailIconContainer}>
                                            <Ionicons name="document-text-outline" size={20} color="#291700" />
                                        </View>
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Beschrijving</Text>
                                            <TextInput
                                                style={[styles.modernInput, styles.modernTextArea]}
                                                placeholder="Beschrijving (optioneel)"
                                                onChangeText={(text) => setPinDescription(text)}
                                                value={pinDescription}
                                                multiline
                                                numberOfLines={4}
                                            />
                                        </View>
                                    </View>

                                    {/* Type selector */}
                                    <View style={styles.detailRow}>
                                        <View style={styles.detailIconContainer}>
                                            <Ionicons name="options-outline" size={20} color="#291700" />
                                        </View>
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Type</Text>
                                            <View style={styles.typeSelector}>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.typeButton,
                                                        pinType === 'bee' && styles.typeButtonActive
                                                    ]}
                                                    onPress={() => setPinType('bee')}
                                                >
                                                    <Text style={[
                                                        styles.typeButtonText,
                                                        pinType === 'bee' && styles.typeButtonTextActive
                                                    ]}>🐝 Bij</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={[
                                                        styles.typeButton,
                                                        pinType === 'butterfly' && styles.typeButtonActive
                                                    ]}
                                                    onPress={() => setPinType('butterfly')}
                                                >
                                                    <Text style={[
                                                        styles.typeButtonText,
                                                        pinType === 'butterfly' && styles.typeButtonTextActive
                                                    ]}>🦋 Vlinder</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>

                            {/* Action buttons */}
                            <View style={styles.modernModalButtonContainer}>
                                <TouchableOpacity
                                    style={styles.modernEditButton}
                                    onPress={addPin}
                                    disabled={!pinTitle}
                                >
                                    <Ionicons name="add-outline" size={20} color="black" />
                                    <Text style={styles.modernButtonText}>Toevoegen</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Modern Details Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modernModalOverlay}>
                    <View style={styles.modernModalContainer}>
                        {/* Close button */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                        {/* Content */}
                        <ScrollView style={styles.modernModalContent} showsVerticalScrollIndicator={false}>
                            {/* Title */}
                            <Text style={styles.modernModalTitle}>{selectedLocation?.name}</Text>

                            {/* Details section */}
                            <View style={styles.detailsSection}>
                                <View style={styles.detailRow}>
                                    <View style={styles.detailIconContainer}>
                                        <Ionicons name="location-outline" size={20} color="#291700" />
                                    </View>
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Coördinaten</Text>
                                        <Text style={styles.detailValue}>
                                            {selectedLocation?.latitude?.toFixed(6)}, {selectedLocation?.longitude?.toFixed(6)}
                                        </Text>
                                    </View>
                                </View>

                                {selectedLocation?.type && (
                                    <View style={styles.detailRow}>
                                        <View style={styles.detailIconContainer}>
                                            <Ionicons name="options-outline" size={20} color="#291700" />
                                        </View>
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Type</Text>
                                            <Text style={styles.detailValue}>
                                                {selectedLocation.type === 'butterfly' ? '🦋 Vlinder' : '🐝 Bij'}
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                {selectedLocation?.description && (
                                    <View style={styles.detailRow}>
                                        <View style={styles.detailIconContainer}>
                                            <Ionicons name="document-text-outline" size={20} color="#291700" />
                                        </View>
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Beschrijving</Text>
                                            <Text style={styles.detailValue}>{selectedLocation.description}</Text>
                                        </View>
                                    </View>
                                )}

                                {selectedLocation?.user_id && (
                                    <View style={styles.detailRow}>
                                        <View style={styles.detailIconContainer}>
                                            <Ionicons name="person-outline" size={20} color="#291700" />
                                        </View>
                                        <View style={styles.detailTextContainer}>
                                            <Text style={styles.detailLabel}>Eigenaar ID</Text>
                                            <Text style={styles.detailValue}>{selectedLocation.user_id}</Text>
                                        </View>
                                    </View>
                                )}

                                <View>
                                    <Pressable
                                        style={[
                                            styles.visitedButton,
                                            locationSaved && styles.visitedButtonSaved
                                        ]}
                                        onPress={() => markLocationAsVisited({
                                            name: selectedLocation.name
                                        })}
                                    >
                                        <Text style={locationSaved ? styles.savedText : styles.unsavedText}>
                                            {locationSaved ? 'Opgeslagen!' : 'Markeer als bezocht'}
                                        </Text>
                                    </Pressable>

                                </View>
                            </View>
                        </ScrollView>

                        {/* Action buttons */}
                        <View style={styles.modernModalButtonContainer}>
                            <TouchableOpacity
                                style={styles.modernEditButton}
                                onPress={startEditing}
                            >
                                <Ionicons name="create-outline" size={20} color="black" />
                                <Text style={styles.modernButtonText}>Bewerken</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
    headerContainer: {
        position: 'absolute',
        top: 40,
        left: 16,
        right: 16,
        zIndex: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerButton: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 8,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    listButton: {
        backgroundColor: 'rgba(255, 215, 0, 0.9)', // Yellow background for list button
    },
    headerButtonText: {
        marginLeft: 6,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    // Custom marker container and image - TERUG NAAR ORIGINELE GROOTTE
    markerContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
    },
    markerImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },
    modalKeyboardAvoidingView: {
        flex: 1,
    },
    // Type selector styles
    typeSelector: {
        flexDirection: 'row',
        marginTop: 8,
        gap: 8,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
    },
    typeButtonActive: {
        backgroundColor: '#FFD700',
        borderColor: '#FFD700',
    },
    typeButtonText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    typeButtonTextActive: {
        color: '#000',
        fontWeight: '600',
    },
    visitedButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
    },
    visitedButtonSaved: {
        backgroundColor: '#a5d6a7', // lichtgroen als visueel "success"
        borderColor: '#388e3c',
        borderWidth: 1,
    },
    unsavedText: {
        color: '#000',
        fontWeight: 'bold',
    },
    savedText: {
        color: '#2e7d32', // donkergroen
        fontWeight: 'bold',
    },
    // Modern modal styles - consistent across all modals
    modernModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'flex-end',
    },
    modernModalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '95%',
        minHeight: '70%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -8,
        },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modernModalContent: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    modernModalTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 30,
        textAlign: 'center',
    },
    detailsSection: {
        marginBottom: 30,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        paddingVertical: 6,
    },
    detailIconContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#FFF8DC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 18,
        marginTop: 0,
    },
    detailTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    detailLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
        marginBottom: 6,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailValue: {
        fontSize: 18,
        color: '#1a1a1a',
        lineHeight: 26,
    },
    modernInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        marginTop: 4,
        minHeight: 44,
    },
    modernTextArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modernModalButtonContainer: {
        paddingHorizontal: 24,
        paddingVertical: 25,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        flexDirection: 'row',
        gap: 12,
    },
    modernEditButton: {
        backgroundColor: '#FFD700',
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FFD700',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        flex: 1,
    },
    modernButton: {
        borderRadius: 12,
        paddingVertical: 18,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        flex: 1,
    },
    modernDeleteButton: {
        backgroundColor: '#FF4444',
        shadowColor: '#FF4444',
    },
    modernButtonText: {
        color: 'black',
        fontSize: 17,
        fontWeight: '600',
        marginLeft: 8,
    },
    modernButtonTextWhite: {
        color: 'white',
        fontSize: 17,
        fontWeight: '600',
        marginLeft: 8,
    },
});
