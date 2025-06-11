import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, TextInput, Alert, Modal, ScrollView, Image, KeyboardAvoidingView, Platform } from 'react-native';
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
    const [pinDescription, setPinDescription] = useState('');
    const [editingPin, setEditingPin] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [createModalVisible, setCreateModalVisible] = useState(false);

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
        setPinDescription('');
        setCreateModalVisible(true);
    };

    const addPin = async () => {
        if (newPin && pinTitle) {
            try {
                const newLocation = {
                    latitude: newPin.latitude,
                    longitude: newPin.longitude,
                    name: pinTitle,
                    description: pinDescription
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
                setPinDescription('');
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
        setModalVisible(false);
        setSelectedLocation(null);
    };

    const updatePin = async () => {
        if (editingPin && pinTitle) {
            try {
                const updatedLocation = {
                    ...editingPin,
                    name: pinTitle,
                    description: pinDescription
                };

                const response = await fetch(`${API_URL}/${editingPin._id}`, {
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
                        pin._id === editingPin._id ? data : pin
                    )
                );
                setEditingPin(null);
                setPinTitle('');
                setPinDescription('');
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
                                const response = await fetch(`${API_URL}/${editingPin._id}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                });
                                if (!response.ok) throw new Error('Failed to delete location');
                                setPins(prevPins => prevPins.filter(pin => pin._id !== editingPin._id));
                                setEditingPin(null);
                                setPinTitle('');
                                setPinDescription('');
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
                        key={pin._id}
                        coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
                        title={pin.name}
                        onPress={() => handlePinPress(pin)}
                    />
                ))}
                {newPin && (
                    <Marker
                        key="new-pin"
                        coordinate={newPin}
                        title="Nieuwe locatie"
                        pinColor="blue"
                    />
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
                                            <Text style={styles.detailLabel}>Eigenaar</Text>
                                            <Text style={styles.detailValue}>{selectedLocation.user_id.full_name}</Text>
                                        </View>
                                    </View>
                                )}
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
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        marginLeft: 6,
        fontSize: 16,
        color: '#333',
    },
    modalKeyboardAvoidingView: {
        flex: 1,
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
        alignItems: 'center', // Changed from 'flex-start' to 'center' for better alignment
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
        marginTop: 0, // Ensure no extra margin that could cause misalignment
    },
    detailTextContainer: {
        flex: 1,
        justifyContent: 'center', // Added to center content vertically
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
        minHeight: 44, // Added consistent height for better alignment
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
