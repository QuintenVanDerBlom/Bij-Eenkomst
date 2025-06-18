import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderBar from '../navigation/HeaderBar';
import AppNavigator from '../navigation/AppNavigator';
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export default function SubInfoScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { subcategoryId } = route.params;

    const [entries, setEntries] = useState([]);
    const [subcategory, setSubcategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const q = query(collection(db, 'entries'), where('sub_category_id', '==', subcategoryId));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEntries(data);

                const subRef = doc(db, 'subcategories', subcategoryId);
                const subSnap = await getDoc(subRef);
                if (subSnap.exists()) {
                    setSubcategory({ id: subSnap.id, ...subSnap.data() });
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [subcategoryId]);

    const toggleExpand = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#ffdd00" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <HeaderBar />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={28} color="#444" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{subcategory?.name || 'Subcategorie Info'}</Text>
            </View>

            {subcategory?.description && (
                <Text style={styles.subcategoryDescription}>{subcategory.description}</Text>
            )}

            <ScrollView contentContainerStyle={styles.container}>
                {entries.length === 0 ? (
                    <Text>Geen entries gevonden voor deze subcategorie.</Text>
                ) : (
                    entries.map((entry, index) => (
                        <View key={entry.id} style={styles.accordionItem}>

                            {/* Accordion header: alleen titel + icoon */}
                            <TouchableOpacity
                                style={styles.accordionHeader}
                                onPress={() => toggleExpand(index)}
                            >
                                <Text style={styles.accordionTitle}>{entry.title}</Text>
                                <MaterialIcons
                                    name={expanded === index ? 'expand-less' : 'expand-more'}
                                    size={24}
                                    color="#444"
                                />
                            </TouchableOpacity>

                            {/* Accordion content: wordt alleen gerenderd als expanded */}
                            {expanded === index && (
                                <View style={styles.accordionContent}>

                                    {/* Image alleen tonen als head_image bestaat en een geldige URL is */}
                                    {entry.head_image &&
                                        typeof entry.head_image === 'string' &&
                                        entry.head_image.startsWith('http') && (
                                            <Image
                                                source={{ uri: entry.head_image }}
                                                style={styles.image}
                                                resizeMode="contain"
                                                onError={(error) => {
                                                    console.warn('Afbeelding kon niet worden geladen:', entry.head_image, error.nativeEvent);
                                                }}
                                            />
                                        )}

                                    <Text style={styles.label}>Beschrijving:</Text>
                                    <Text style={styles.text}>{entry.description}</Text>

                                    <Text style={styles.label}>Extra informatie:</Text>
                                    <Text style={styles.text}>{entry.information}</Text>
                                </View>
                            )}
                        </View>
                    ))
                )}
            </ScrollView>

            <AppNavigator />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    backButton: {
        paddingRight: 12,
        paddingVertical: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
    },
    subcategoryDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginHorizontal: 20,
        marginBottom: 10,
        marginTop: 5,
    },
    container: {
        padding: 20,
    },
    accordionItem: {
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 14,
        alignItems: 'center',
    },
    accordionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1, // neemt ruimte tussen titel en icon
    },
    accordionContent: {
        paddingHorizontal: 14,
        paddingBottom: 12,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#eee', // tijdelijke achtergrond om ruimte te tonen
    },
    label: {
        fontWeight: 'bold',
        marginTop: 10,
        color: '#444',
    },
    text: {
        color: '#555',
        lineHeight: 20,
    },
});
