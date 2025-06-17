import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function LocationDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { location } = route.params;

    // Local state for like and favorite
    const [liked, setLiked] = useState(false);
    const [favorited, setFavorited] = useState(false);

    // Simulated likes count (in real app this would come from backend)
    const [likesCount, setLikesCount] = useState(42);

    const openInMap = () => {
        navigation.navigate('Map', {
            focusLocation: {
                latitude: location.latitude,
                longitude: location.longitude,
                name: location.name
            }
        });
    };

    const toggleLike = () => {
        if (liked) {
            setLikesCount(likesCount - 1);
        } else {
            setLikesCount(likesCount + 1);
        }
        setLiked(!liked);
    };

    const toggleFavorite = () => setFavorited(!favorited);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                    <Text style={styles.backText}>Terug</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.typeIconLarge}>
                    <Text style={styles.typeEmojiLarge}>
                        {location.type === 'butterfly' ? '🦋' : '🐝'}
                    </Text>
                </View>

                <Text style={styles.title}>{location.name}</Text>

                <View style={styles.detailsSection}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailIconContainer}>
                            <Ionicons name="location-outline" size={20} color="#291700" />
                        </View>
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>Coördinaten</Text>
                            <Text style={styles.detailValue}>
                                {location.latitude?.toFixed(6)}, {location.longitude?.toFixed(6)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.detailRow}>
                        <View style={styles.detailIconContainer}>
                            <Ionicons name="options-outline" size={20} color="#291700" />
                        </View>
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>Type</Text>
                            <Text style={styles.detailValue}>
                                {location.type === 'butterfly' ? '🦋 Vlinder' : '🐝 Bij'}
                            </Text>
                        </View>
                    </View>

                    {location.description && (
                        <View style={styles.detailRow}>
                            <View style={styles.detailIconContainer}>
                                <Ionicons name="document-text-outline" size={20} color="#291700" />
                            </View>
                            <View style={styles.detailTextContainer}>
                                <Text style={styles.detailLabel}>Beschrijving</Text>
                                <Text style={styles.detailValue}>{location.description}</Text>
                            </View>
                        </View>
                    )}

                    {/* Likes count in line with other info */}
                    <View style={styles.detailRow}>
                        <View style={styles.detailIconContainer}>
                            <Ionicons name="heart" size={20} color="#e0245e" />
                        </View>
                        <View style={styles.detailTextContainer}>
                            <Text style={styles.detailLabel}>Populariteit</Text>
                            <Text style={styles.detailValue}>{likesCount} likes</Text>
                        </View>
                    </View>

                    {location.user_id && (
                        <View style={styles.detailRow}>
                            <View style={styles.detailIconContainer}>
                                <Ionicons name="person-outline" size={20} color="#291700" />
                            </View>
                            <View style={styles.detailTextContainer}>
                                <Text style={styles.detailLabel}>Eigenaar ID</Text>
                                <Text style={styles.detailValue}>{location.user_id}</Text>
                            </View>
                        </View>
                    )}

                    {/* Like and Favorite icons inside info box */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity onPress={toggleLike} style={styles.actionButton}>
                            <Ionicons
                                name={liked ? "heart" : "heart-outline"}
                                size={24}
                                color={liked ? "#e0245e" : "#666"}
                            />
                            <Text style={styles.actionText}>
                                {liked ? "Geliked" : "Like"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={toggleFavorite} style={styles.actionButton}>
                            <Ionicons
                                name={favorited ? "star" : "star-outline"}
                                size={24}
                                color={favorited ? "#FFD700" : "#666"}
                            />
                            <Text style={styles.actionText}>
                                {favorited ? "Favoriet" : "Favoriet"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.mapButton} onPress={openInMap}>
                    <Ionicons name="map-outline" size={20} color="#291700" />
                    <Text style={styles.mapButtonText}>Bekijk op Kaart</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: 'white',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
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
    content: {
        flex: 1,
        padding: 24,
    },
    typeIconLarge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFF8DC',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 24,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    typeEmojiLarge: {
        fontSize: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#291700',
        textAlign: 'center',
        marginBottom: 32,
    },
    detailsSection: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 4,
    },
    detailIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF8DC',
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
        color: '#666',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    detailValue: {
        fontSize: 16,
        color: '#291700',
        lineHeight: 22,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
    },
    actionText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    mapButton: {
        backgroundColor: '#FFD700',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    mapButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#291700',
        marginLeft: 8,
    },
});
