// screens/LikedLocationsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../auth/AuthContext';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import LikedLocationsService from '../services/LikedLocationsService';

export default function LikedLocationsScreen() {
    const navigation = useNavigation();
    const { currentUser } = useAuth();
    const [likedLocations, setLikedLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            loadLikedLocations();
        }, [currentUser])
    );

    const loadLikedLocations = async () => {
        if (!currentUser) {
            setLikedLocations([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            // Get liked location IDs from AsyncStorage
            const likedLocationIds = await LikedLocationsService.getLikedLocations(currentUser.uid);

            if (likedLocationIds.length === 0) {
                setLikedLocations([]);
                setLoading(false);
                return;
            }

            // Fetch location details from Firestore
            const q = query(collection(db, 'locations'), where('__name__', 'in', likedLocationIds));
            const querySnapshot = await getDocs(q);
            const locations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setLikedLocations(locations);
        } catch (error) {
            console.error('Error loading liked locations:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('LocationDetail', { location: item })}
        >
            <View style={styles.typeIcon}>
                <Text style={styles.typeEmoji}>
                    {item.type === 'butterfly' ? '🦋' : '🐝'}
                </Text>
            </View>
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemSubtitle}>
                    {item.description || 'Geen beschrijving'}
                </Text>
                <Text style={styles.itemCoordinates}>
                    {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}
                </Text>
            </View>
            <Ionicons name="heart" size={20} color="#FF6B6B" />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={styles.loadingText}>Gelikte locaties laden...</Text>
            </View>
        );
    }

    if (!currentUser) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Gelikte Locaties</Text>
                    <View />
                </View>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Je moet ingelogd zijn om gelikte locaties te bekijken.</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Gelikte Locaties</Text>
                <View />
            </View>

            {likedLocations.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>Nog geen gelikte locaties</Text>
                    <Text style={styles.emptySubtext}>
                        Ontdek locaties en like ze om ze hier te zien!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={likedLocations}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    listContent: {
        padding: 16,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    typeIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF8DC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    typeEmoji: {
        fontSize: 24,
    },
    itemContent: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },
    itemSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        lineHeight: 20,
    },
    itemCoordinates: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'monospace',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        textAlign: 'center',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 8,
    },
});
