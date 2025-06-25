import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const imageMap = {
    Bijen: require('../assets/bee.png'),
    Vlinders: require('../assets/butterfly.png'),
    Flora: require('../assets/tulips.png'),
    Voeding: require('../assets/fruits.png'),
};

export default function CategoryCard() {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadCategories = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'categories'));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCategories(data);
        } catch (err) {
            console.error('Fout bij ophalen categorieën:', err);
            setError('Fout bij ophalen categorieën');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#ffdd00" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.grid}>
                {filteredCategories.map(({ id, name }) => (
                    <TouchableOpacity
                        key={id}
                        style={styles.card}
                        onPress={() =>
                            navigation.navigate('InfoScreen', {
                                categoryId: id,
                            })
                        }
                        activeOpacity={0.7}
                    >
                        <Image
                            source={imageMap[name] || require('../assets/bee.png')}
                            style={styles.categoryImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>{name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginHorizontal: 10,
    },
    card: {
        width: '45%',
        backgroundColor: '#ffdd00',
        borderRadius: 12,
        paddingVertical: 20,
        alignItems: 'center',
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    categoryImage: {
        width: 64,
        height: 64,
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: 'black',
        textAlign: 'center',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
