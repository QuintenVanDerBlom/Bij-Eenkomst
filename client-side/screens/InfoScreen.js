    import React, { useEffect, useState } from 'react';
    import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
    import { SafeAreaView } from 'react-native-safe-area-context';
    import { useRoute, useNavigation } from '@react-navigation/native';
    import { MaterialIcons } from '@expo/vector-icons';
    import HeaderBar from '../navigation/HeaderBar';
    import AppNavigator from '../navigation/AppNavigator';
    import {db} from "../firebaseConfig";
    import { collection, query, where, getDocs } from "firebase/firestore";

export default function InfoScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { categoryId } = route.params;
    const [entries, setEntries] = useState([]);
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(true);

        useEffect(() => {
            const loadData = async () => {
                try {
                    const q = query(collection(db, 'entries'), where('category_id', '==', categoryId));
                    const querySnapshot = await getDocs(q);
                    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setEntries(data);
                } catch (error) {
                    console.error('Error loading entries:', error);
                } finally {
                    setLoading(false);
                }
            };

            loadData();
        }, [categoryId]);

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
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderBar />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={28} color="#444" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}></Text>

                {entries[0]?.category_id?.description && (
                    <>
                        <Text style={styles.categoryDescription}>
                            {entries[0].category_id.description}
                        </Text>
                        <Image
                            source={require('../assets/bee.png')}
                            style={styles.image}
                        />
                    </>
                )}

                {entries.length === 0 ? (
                    <Text>Geen informatie beschikbaar voor deze categorie.</Text>
                ) : (
                    entries.map((item, index) => (
                        <View key={item.id} style={styles.accordionItem}>
                            <TouchableOpacity
                                style={styles.accordionHeader}
                                onPress={() => toggleExpand(index)}
                            >
                                <Text style={styles.accordionTitle}>{item.title}</Text>
                                <MaterialIcons
                                    name={expanded === index ? 'expand-less' : 'expand-more'}
                                    size={24}
                                    color="#444"
                                />
                            </TouchableOpacity>
                            {expanded === index && (
                                <View style={styles.accordionContent}>
                                    <Text>{item.description}</Text>
                                    <TouchableOpacity
                                        onPress={() =>
                                            navigation.navigate('SubInfo', {
                                                entryId: item.id,
                                            })
                                        }
                                    >
                                        <Text style={styles.moreInfoLink}>Meer info ➔</Text>
                                    </TouchableOpacity>
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
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
    },
    container: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#222',
    },
    categoryDescription: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
        resizeMode: 'cover',
    },
    accordionItem: {
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 6,
        overflow: 'hidden',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
    },
    accordionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    accordionContent: {
        padding: 12,
    },
    moreInfoLink: {
        marginTop: 10,
        color: '#007BFF',
        fontWeight: '600',
    },
});
