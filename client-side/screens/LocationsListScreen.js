import React, {useEffect, useState, useCallback, useContext} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Switch } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import AppNavigator from '../navigation/AppNavigator';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../auth/AuthContext';
import LikedLocationsService from '../services/LikedLocationsService';
import {DarkModeContext} from "../Contexts/DarkModeContext";

export default function LocationsListScreen() {
    const navigation = useNavigation();
    const { currentUser } = useAuth();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false); // Start with false to prevent flash
    const [showFavorites, setShowFavorites] = useState(false);
    const [favoriteLocationIds, setFavoriteLocationIds] = useState([]);
    const [initialLoad, setInitialLoad] = useState(true);
    const {isDarkMode} = useContext(DarkModeContext);
    const styles = getStyles(isDarkMode);

    // Pre-load favorite IDs from AsyncStorage on component mount
    useEffect(() => {
        const preloadFavorites = async () => {
            if (currentUser) {
                try {
                    const favIds = await LikedLocationsService.getFavoriteLocations(currentUser.uid);
                    setFavoriteLocationIds(favIds);
                } catch (error) {
                    console.error('Error preloading favorites:', error);
                }
            }
            setInitialLoad(false);
        };
        preloadFavorites();
    }, [currentUser]);

    // Refresh favorites when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            const refreshFavorites = async () => {
                if (currentUser && showFavorites) {
                    try {
                        const favIds = await LikedLocationsService.getFavoriteLocations(currentUser.uid);
                        setFavoriteLocationIds(favIds);
                        // Only reload locations if favorites changed
                        if (JSON.stringify(favIds) !== JSON.stringify(favoriteLocationIds)) {
                            fetchLocations(true, favIds);
                        }
                    } catch (error) {
                        console.error('Error refreshing favorites:', error);
                    }
                }
            };
            refreshFavorites();
        }, [currentUser, showFavorites])
    );

    const fetchLocations = async (isFavorites = showFavorites, favIds = favoriteLocationIds) => {
        // Only show loading if we don't have initial data or if it's a significant change
        if (locations.length === 0 || (isFavorites !== showFavorites)) {
            setLoading(true);
        }

        try {
            if (isFavorites && currentUser) {
                const favoriteIds = favIds.length > 0 ? favIds : await LikedLocationsService.getFavoriteLocations(currentUser.uid);

                if (favoriteIds.length === 0) {
                    setLocations([]);
                    return;
                }

                // Firestore 'in' query supports max 10 elements, so chunk if needed
                const chunkSize = 10;
                let allFavLocations = [];
                for (let i = 0; i < favoriteIds.length; i += chunkSize) {
                    const chunk = favoriteIds.slice(i, i + chunkSize);
                    const q = query(collection(db, 'locations'), where('__name__', 'in', chunk));
                    const querySnapshot = await getDocs(q);
                    const locs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    allFavLocations = allFavLocations.concat(locs);
                }
                setLocations(allFavLocations);
            } else {
                // Show all locations
                const querySnapshot = await getDocs(collection(db, 'locations'));
                const locs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLocations(locs);
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch locations when showFavorites changes or on initial load
    useEffect(() => {
        if (!initialLoad) {
            fetchLocations();
        }
    }, [showFavorites, currentUser, initialLoad]);

    // Initial data load after preloading favorites
    useEffect(() => {
        if (!initialLoad) {
            fetchLocations();
        }
    }, [initialLoad]);

    const handleToggleFavorites = async (value) => {
        if (value && !currentUser) {
            // If user tries to show favorites but isn't logged in
            navigation.navigate('Login');
            return;
        }

        // Pre-load favorites if switching to favorites view
        if (value && currentUser) {
            try {
                const favIds = await LikedLocationsService.getFavoriteLocations(currentUser.uid);
                setFavoriteLocationIds(favIds);
            } catch (error) {
                console.error('Error loading favorites for toggle:', error);
            }
        }

        setShowFavorites(value);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('LocationDetail', { location: item })}
        >
            <LinearGradient
                colors={['#FFD700', '#FFEB99', '#FFFACD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBackground}
            >
                <View style={styles.itemHeader}>
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
                    <View style={styles.itemActions}>
                        {showFavorites && (
                            <Ionicons name="star" size={16} color="#FFD700" style={styles.favoriteIcon} />
                        )}
                        <Ionicons name="chevron-forward" size={20} color="#000000" />
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    // Show loading only if we're in initial load state or actively loading with no data
    if (initialLoad || (loading && locations.length === 0)) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={styles.loadingText}>
                    {showFavorites ? 'Favoriete locaties laden...' : 'Locaties laden...'}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    {showFavorites ? 'Favoriete Locaties' : 'Alle Locaties'}
                </Text>
                <View style={styles.switchContainer}>
                    <Text style={styles.switchLabel}>Favorieten</Text>
                    <Switch
                        value={showFavorites}
                        onValueChange={handleToggleFavorites}
                        thumbColor={showFavorites ? '#FFD700' : '#f4f3f4'}
                        trackColor={{ false: '#767577', true: '#ffe066' }}
                        disabled={!currentUser && showFavorites}
                    />
                </View>
            </View>

            {/* Show subtle loading indicator in header when refreshing data */}
            {loading && locations.length > 0 && (
                <View style={styles.refreshIndicator}>
                    <ActivityIndicator size="small" color="#FFD700" />
                    <Text style={styles.refreshText}>Bijwerken...</Text>
                </View>
            )}

            <FlatList
                data={locations}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name={showFavorites ? "star-outline" : "location-outline"}
                            size={64}
                            color="#ccc"
                        />
                        <Text style={styles.emptyText}>
                            {showFavorites
                                ? currentUser
                                    ? 'Je hebt nog geen favoriete locaties.'
                                    : 'Log in om je favoriete locaties te bekijken.'
                                : 'Geen locaties gevonden.'
                            }
                        </Text>
                        {showFavorites && !currentUser && (
                            <TouchableOpacity
                                style={styles.loginButton}
                                onPress={() => navigation.navigate('Login')}
                            >
                                <Text style={styles.loginButtonText}>Inloggen</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            />

            {/* Bottom navigation */}
            <AppNavigator />
        </View>
    );
}

const getStyles = (isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDarkMode ? '#121212' : '#f8f9fa',
    },
    header: {
        backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? '#333' : '#000000',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: isDarkMode ? '#ffffff' : '#000000',
        flex: 1,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    switchLabel: {
        fontSize: 16,
        color: isDarkMode ? '#fff' : '#000',
        fontWeight: '600',
    },
    refreshIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.05)' : 'rgba(255, 215, 0, 0.1)',
        gap: 8,
    },
    refreshText: {
        fontSize: 14,
        color: isDarkMode ? '#aaa' : '#666',
        fontStyle: 'italic',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    itemContainer: {
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: isDarkMode ? '#444' : '#000000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
        backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
    },
    gradientBackground: {
        borderRadius: 15,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    typeIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
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
        color: '#000000',
        marginBottom: 4,
    },
    itemSubtitle: {
        fontSize: 14,
        color: '#333333',
        marginBottom: 4,
        lineHeight: 20,
    },
    itemCoordinates: {
        fontSize: 12,
        color: '#555555',
        fontFamily: 'monospace',
    },
    itemActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    favoriteIcon: {
        marginRight: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDarkMode ? '#121212' : '#f8f9fa',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: isDarkMode ? '#aaa' : '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: 32,
    },
    emptyText: {
        fontSize: 18,
        color: isDarkMode ? '#999' : '#666',
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    loginButtonText: {
        color: '#291700',
        fontSize: 16,
        fontWeight: 'bold',
    },
});