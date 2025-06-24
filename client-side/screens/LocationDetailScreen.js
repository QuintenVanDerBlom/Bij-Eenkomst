// LocationDetailScreen.js
import React, {useState, useEffect, useContext} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    ActivityIndicator,
    Share,
    Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../auth/AuthContext';
import LikedLocationsService from '../services/LikedLocationsService';
import {DarkModeContext} from "../Contexts/DarkModeContext";

export default function LocationDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { location } = route.params;
    const { currentUser } = useAuth();

    // State for like and favorite status
    const [liked, setLiked] = useState(false);
    const [favorited, setFavorited] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [favoritesCount, setFavoritesCount] = useState(15);
    const [likeLoading, setLikeLoading] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [shareLoading, setShareLoading] = useState(false);
    const { isDarkMode } = useContext(DarkModeContext);
    const styles = getStyles(isDarkMode);

    // Load like and favorite status when component mounts
    useEffect(() => {
        loadStatus();
    }, [currentUser, location.id]);

    const loadStatus = async () => {
        try {
            // Load likes count from database
            const count = await LikedLocationsService.getLikesCount(location.id);
            setLikesCount(count);

            if (currentUser) {
                const [isLiked, isFavorited] = await Promise.all([
                    LikedLocationsService.isLocationLiked(currentUser.uid, location.id),
                    LikedLocationsService.isLocationFavorited(currentUser.uid, location.id)
                ]);

                setLiked(isLiked);
                setFavorited(isFavorited);
            } else {
                setLiked(false);
                setFavorited(false);
            }
        } catch (error) {
            console.error('Error loading status:', error);
        } finally {
            setInitialLoading(false);
        }
    };

    const openInMap = () => {
        navigation.navigate('Map', {
            focusLocation: {
                latitude: location.latitude,
                longitude: location.longitude,
                name: location.name
            }
        });
    };

    const shareLocation = async () => {
        setShareLoading(true);

        try {
            // Create Google Maps URL
            const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

            // Create Apple Maps URL (for iOS)
            const appleMapsUrl = `http://maps.apple.com/?q=${location.latitude},${location.longitude}`;

            // Choose appropriate maps URL based on platform
            const mapsUrl = Platform.OS === 'ios' ? appleMapsUrl : googleMapsUrl;

            // Create share content
            const shareContent = {
                title: `${location.name} - Bij Eenkomst`,
                message: Platform.OS === 'ios'
                    ? `Bekijk deze ${location.type === 'butterfly' ? 'vlinder' : 'bij'} locatie: ${location.name}\n\n${location.description || 'Een geweldige plek om de natuur te ontdekken!'}\n\nCoördinaten: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}\n\nBekijk op kaart: ${mapsUrl}\n\nGedeeld via Bij Eenkomst app 🐝🦋`
                    : `Bekijk deze ${location.type === 'butterfly' ? 'vlinder' : 'bij'} locatie: ${location.name}\n\n${location.description || 'Een geweldige plek om de natuur te ontdekken!'}\n\nCoördinaten: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}\n\nBekijk op kaart: ${mapsUrl}\n\nGedeeld via Bij Eenkomst app 🐝🦋`,
                url: mapsUrl, // This works on iOS
            };

            const result = await Share.share(shareContent);

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Shared with activity type of result.activityType
                    console.log('Shared with activity type:', result.activityType);
                } else {
                    // Shared successfully
                    console.log('Shared successfully');
                }
            } else if (result.action === Share.dismissedAction) {
                // Share dialog was dismissed
                console.log('Share dismissed');
            }
        } catch (error) {
            console.error('Error sharing location:', error);
            Alert.alert('Fout', 'Er is een fout opgetreden bij het delen van deze locatie.');
        } finally {
            setShareLoading(false);
        }
    };

    const shareToSpecificApp = (app) => {
        const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
        const message = `Bekijk deze ${location.type === 'butterfly' ? 'vlinder' : 'bij'} locatie: ${location.name}\n\nCoördinaten: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}\n\nBekijk op kaart: ${googleMapsUrl}`;

        switch (app) {
            case 'whatsapp':
                const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
                Linking.canOpenURL(whatsappUrl).then(supported => {
                    if (supported) {
                        Linking.openURL(whatsappUrl);
                    } else {
                        Alert.alert('WhatsApp niet gevonden', 'WhatsApp is niet geïnstalleerd op dit apparaat.');
                    }
                });
                break;
            case 'telegram':
                const telegramUrl = `tg://msg?text=${encodeURIComponent(message)}`;
                Linking.canOpenURL(telegramUrl).then(supported => {
                    if (supported) {
                        Linking.openURL(telegramUrl);
                    } else {
                        Alert.alert('Telegram niet gevonden', 'Telegram is niet geïnstalleerd op dit apparaat.');
                    }
                });
                break;
            case 'email':
                const emailUrl = `mailto:?subject=${encodeURIComponent(`${location.name} - Bij Eenkomst`)}&body=${encodeURIComponent(message)}`;
                Linking.openURL(emailUrl);
                break;
            default:
                shareLocation();
        }
    };

    const showShareOptions = () => {
        Alert.alert(
            'Delen via',
            'Kies hoe je deze locatie wilt delen',
            [
                { text: 'Algemeen delen', onPress: shareLocation },
                { text: 'WhatsApp', onPress: () => shareToSpecificApp('whatsapp') },
                { text: 'Telegram', onPress: () => shareToSpecificApp('telegram') },
                { text: 'E-mail', onPress: () => shareToSpecificApp('email') },
                { text: 'Annuleren', style: 'cancel' }
            ]
        );
    };

    const toggleLike = async () => {
        if (!currentUser) {
            Alert.alert(
                'Inloggen Vereist',
                'Je moet ingelogd zijn om locaties te kunnen liken.',
                [
                    { text: 'Annuleren', style: 'cancel' },
                    { text: 'Inloggen', onPress: () => navigation.navigate('Login') }
                ]
            );
            return;
        }

        setLikeLoading(true);

        try {
            const newLikedStatus = await LikedLocationsService.toggleLikeLocation(currentUser.uid, location.id);
            setLiked(newLikedStatus);

            // Update likes count from database to get accurate count
            const updatedCount = await LikedLocationsService.getLikesCount(location.id);
            setLikesCount(updatedCount);

        } catch (error) {
            console.error('Error toggling like:', error);
            Alert.alert('Fout', 'Er is een fout opgetreden bij het liken van deze locatie.');
        } finally {
            setLikeLoading(false);
        }
    };

    const toggleFavorite = async () => {
        if (!currentUser) {
            Alert.alert(
                'Inloggen Vereist',
                'Je moet ingelogd zijn om locaties als favoriet te markeren.',
                [
                    { text: 'Annuleren', style: 'cancel' },
                    { text: 'Inloggen', onPress: () => navigation.navigate('Login') }
                ]
            );
            return;
        }

        setFavoriteLoading(true);

        try {
            const newFavoritedStatus = await LikedLocationsService.toggleFavoriteLocation(currentUser.uid, location.id);
            setFavorited(newFavoritedStatus);

            // Update favorites count (visual feedback)
            if (newFavoritedStatus) {
                setFavoritesCount(prev => prev + 1);
            } else {
                setFavoritesCount(prev => Math.max(0, prev - 1));
            }

        } catch (error) {
            console.error('Error toggling favorite:', error);
            Alert.alert('Fout', 'Er is een fout opgetreden bij het markeren als favoriet.');
        } finally {
            setFavoriteLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={styles.loadingText}>Locatie laden...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={isDarkMode? "#fff": "#333"} />
                    <Text style={styles.backText}>Terug</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Large type icon */}
                <View style={styles.typeIconLarge}>
                    <Text style={styles.typeEmojiLarge}>
                        {location.type === 'butterfly' ? '🦋' : '🐝'}
                    </Text>
                </View>

                {/* Title */}
                <Text style={styles.title}>{location.name}</Text>

                {/* Details Section */}
                <View style={styles.detailsSection}>
                    {/* Coordinates */}
                    <View style={styles.detailRow}>
                        <View style={styles.detailIconContainer}>
                            <Ionicons name="location" size={20} color={isDarkMode? "#333": "#FFD700"} />
                        </View>
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>Coördinaten</Text>
                            <Text style={styles.detailValue}>
                                {location.latitude?.toFixed(6)}, {location.longitude?.toFixed(6)}
                            </Text>
                        </View>
                    </View>

                    {/* Type */}
                    <View style={styles.detailRow}>
                        <View style={styles.detailIconContainer}>
                            <Text style={{ fontSize: 20 }}>
                                {location.type === 'butterfly' ? '🦋' : '🐝'}
                            </Text>
                        </View>
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>Type</Text>
                            <Text style={styles.detailValue}>
                                {location.type === 'butterfly' ? '🦋 Vlinder' : '🐝 Bij'}
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    {location.description && (
                        <View style={styles.detailRow}>
                            <View style={styles.detailIconContainer}>
                                <Ionicons name="document-text" size={20} color={isDarkMode? "#333":"#FFD700"} />
                            </View>
                            <View style={styles.detailTextContainer}>
                                <Text style={styles.detailLabel}>Beschrijving</Text>
                                <Text style={styles.detailValue}>{location.description}</Text>
                            </View>
                        </View>
                    )}

                    {/* Popularity */}
                    <View style={styles.detailRow}>
                        <View style={styles.detailIconContainer}>
                            <Ionicons name="heart" size={20} color={isDarkMode? "#333":"#FFD700"} />
                        </View>
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>Populariteit</Text>
                            <Text style={styles.detailValue}>{likesCount} likes • {favoritesCount} favorieten</Text>
                        </View>
                    </View>

                    {/* Date added */}
                    {location.created_at && (
                        <View style={styles.detailRow}>
                            <View style={styles.detailIconContainer}>
                                <Ionicons name="calendar" size={20} color="#FFD700" />
                            </View>
                            <View style={styles.detailTextContainer}>
                                <Text style={styles.detailLabel}>Toegevoegd op</Text>
                                <Text style={styles.detailValue}>
                                    {new Date(location.created_at).toLocaleDateString('nl-NL')}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionSection}>
                    {/* Like Button */}
                    <TouchableOpacity
                        style={[styles.actionButton, liked && styles.likedButton]}
                        onPress={toggleLike}
                        disabled={likeLoading}
                    >
                        {likeLoading ? (
                            <ActivityIndicator size="small" color={liked ? "#fff" : "#666"} />
                        ) : (
                            <Ionicons
                                name={liked ? "heart" : "heart-outline"}
                                size={20}
                                color={liked ? "#fff" : "#666"}
                            />
                        )}
                        <Text style={[styles.actionText, liked && styles.likedText]}>
                            {likeLoading ? "..." : (liked ? "Geliked" : "Like")}
                        </Text>
                    </TouchableOpacity>

                    {/* Favorite Button */}
                    <TouchableOpacity
                        style={[styles.actionButton, favorited && styles.favoritedButton]}
                        onPress={toggleFavorite}
                        disabled={favoriteLoading}
                    >
                        {favoriteLoading ? (
                            <ActivityIndicator size="small" color={favorited ? "#fff" : "#666"} />
                        ) : (
                            <Ionicons
                                name={favorited ? "star" : "star-outline"}
                                size={20}
                                color={favorited ? "#fff" : "#666"}
                            />
                        )}
                        <Text style={[styles.actionText, favorited && styles.favoritedText]}>
                            {favoriteLoading ? "..." : (favorited ? "Favoriet" : "Favoriet")}
                        </Text>
                    </TouchableOpacity>

                    {/* Share Button */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={showShareOptions}
                        disabled={shareLoading}
                    >
                        {shareLoading ? (
                            <ActivityIndicator size="small" color="#666" />
                        ) : (
                            <Ionicons name="share-outline" size={20} color={isDarkMode? "#fff": "#666"} />
                        )}
                        <Text style={styles.actionText}>
                            {shareLoading ? "..." : "Delen"}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Map Button */}
                <TouchableOpacity style={styles.mapButton} onPress={openInMap}>
                    <Ionicons name="map" size={24} color="#291700" />
                    <Text style={styles.mapButtonText}>Bekijk op Kaart</Text>
                </TouchableOpacity>

                {/* Additional Info */}
                <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>Over deze locatie</Text>
                    <Text style={styles.infoText}>
                        {location.type === 'butterfly'
                            ? 'Deze locatie is gemarkeerd als een vlinderplek. Hier kun je verschillende vlindersoorten spotten en hun natuurlijke habitat observeren.'
                            : 'Deze locatie is gemarkeerd als een bijenplek. Hier kun je bijen in hun natuurlijke omgeving observeren en meer leren over hun belangrijke rol in het ecosysteem.'
                        }
                    </Text>

                    <Text style={styles.infoText}>
                        Respecteer de natuur en houd afstand van de dieren. Neem alleen foto's en laat alleen voetafdrukken achter.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const getStyles = (isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDarkMode ? '#121212' : '#f8f9fa',
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
    header: {
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? '#333' : '#e9ecef',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backText: {
        marginLeft: 8,
        fontSize: 16,
        color: isDarkMode ? '#ccc' : '#333',
        fontWeight: '500',
    },
    content: {
        padding: 20,
    },
    typeIconLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFF8DC', // laat geelachtig
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    typeEmojiLarge: {
        fontSize: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: isDarkMode ? '#fff' : '#000',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 34,
    },
    detailsSection: {
        backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    detailIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF8DC', // niet aanpassen
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: isDarkMode ? '#aaa' : '#666',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailValue: {
        fontSize: 16,
        color: isDarkMode ? '#eee' : '#000',
        lineHeight: 22,
    },
    actionSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 8,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: isDarkMode ? '#444' : '#e9ecef',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    likedButton: {
        backgroundColor: '#FF6B6B',
        borderColor: '#FF6B6B',
    },
    favoritedButton: {
        backgroundColor: '#FFD700',
        borderColor: '#FFD700',
    },
    actionText: {
        marginLeft: 6,
        fontSize: 13,
        fontWeight: '600',
        color: isDarkMode ? '#ccc' : '#666',
    },
    likedText: {
        color: '#fff',
    },
    favoritedText: {
        color: '#291700', // geel dus niet aanpassen
    },
    mapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFD700', // laat zoals gevraagd
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    mapButtonText: {
        marginLeft: 12,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#291700', // laat zoals gevraagd
    },
    infoSection: {
        backgroundColor: isDarkMode ? '#1e1e1e' : 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    infoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: isDarkMode ? '#fff' : '#000',
        marginBottom: 16,
    },
    infoText: {
        fontSize: 16,
        color: isDarkMode ? '#ccc' : '#666',
        lineHeight: 24,
        marginBottom: 12,
    },
});