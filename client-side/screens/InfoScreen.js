import React, {useContext, useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderBar from '../navigation/HeaderBar';
import Searchbar from '../components/SearchBar';
import AppNavigator from '../navigation/AppNavigator';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import {DarkModeContext} from "../Contexts/DarkModeContext.js";

export default function InfoScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { categoryId } = route.params;

    const [subcategories, setSubcategories] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useContext(DarkModeContext);
    const styles = getStyles(isDarkMode);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Subcategorieën ophalen
                const q = query(collection(db, 'subcategories'), where('category_id', '==', categoryId));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSubcategories(data);

                // Categorie ophalen
                const categoryRef = doc(db, 'categories', categoryId);
                const categorySnap = await getDoc(categoryRef);
                if (categorySnap.exists()) {
                    setCategory({ id: categorySnap.id, ...categorySnap.data() });
                } else {
                    console.warn('Categorie niet gevonden');
                }

            } catch (error) {
                console.error('Fout bij laden van gegevens:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [categoryId]);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#ffdd00" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderBar />

            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={28} color={isDarkMode? "#fff": "#444"} />
                    </TouchableOpacity>
                </View>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={28} color="#444" />
                </TouchableOpacity>
                <View style={styles.searchBar}>
                    <Searchbar />
                </View>
            </View>




                <ScrollView contentContainerStyle={styles.scrollView}>
                    {category && (
                        <>
                            <Text style={styles.title}>{category.name}</Text>
                            <Text style={styles.categoryDescription}>{category.description}</Text>
                            {category.image ? (
                                <Image source={{ uri: category.image }} style={styles.image} />
                            ) : (
                                <Image source={require('../assets/bee.png')} style={styles.image} />
                            )}
                        </>
                    )}

                    {subcategories.length === 0 ? (
                        <Text>Geen subcategorieën beschikbaar voor deze categorie.</Text>
                    ) : (
                        subcategories.map((sub) => (
                            <View key={sub.id} style={styles.subcategoryCard}>
                                <Text style={styles.subcategoryTitle}>{sub.name}</Text>
                                <Text style={styles.subcategoryDescription}>{sub.description}</Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate('SubInfo', {
                                            subcategoryId: sub.id,
                                        })
                                    }
                                >
                                    <Text style={styles.moreInfoLink}>Meer info ➔</Text>
                                </TouchableOpacity>
                            </View>

                        ))
                    )}
                </ScrollView>
            </View>
            <AppNavigator />
        </SafeAreaView>
    );
}

const getStyles = (isDarkMode) => StyleSheet.create({
    safeView:{
        flex: 1,
        backgroundColor: isDarkMode ? '#121212' : '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: isDarkMode ? '#121212' : '#fff',
        paddingBottom: 15
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        gap: 10, // optioneel voor ruimte tussen knop en balk
    },
    scrollView: {
        padding: 20,
    },
    searchBar: {
        flex: 1, // neemt alle resterende ruimte in
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: isDarkMode ? '#fff' : '#222',
    },
    categoryDescription: {
        fontSize: 16,
        color: isDarkMode ? '#ccc' : '#555',
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
    subcategoryCard: {
        backgroundColor: isDarkMode ? '#2e2a2a' : '#f9f9f9',
        borderRadius: 8,
        padding: 15,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: isDarkMode ? '#232222' : '#ddd',
    },
    subcategoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
        color: isDarkMode ? '#fff' : '#333',
    },
    subcategoryDescription: {
        fontSize: 15,
        color: isDarkMode ? '#aaa' : '#555',
    },
    moreInfoLink: {
        marginTop: 10,
        color: isDarkMode ? '#4da6ff' : '#007BFF',
        fontWeight: '600',
    },
});