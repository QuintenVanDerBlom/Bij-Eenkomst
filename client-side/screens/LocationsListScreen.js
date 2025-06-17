import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import AppNavigator from '../navigation/AppNavigator';
import { LinearGradient } from 'expo-linear-gradient';

export default function LocationsListScreen() {
    const navigation = useNavigation();
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'locations'));
                const locs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLocations(locs);
            } catch (error) {
                console.error('Error fetching locations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLocations();
    }, []);

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
                    <Ionicons name="chevron-forward" size={20} color="#000000" />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={styles.loadingText}>Locaties laden...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Alle Locaties</Text>
            </View>

            <FlatList
                data={locations}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Bottom navigation */}
            <AppNavigator />
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
        borderBottomColor: '#000000',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
        textAlign: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    itemContainer: {
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#000000',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden',
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
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
});
