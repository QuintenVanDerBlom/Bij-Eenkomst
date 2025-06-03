import React, { useEffect, useState } from 'react';

import {
    ScrollView,
    View,
    StyleSheet,
    SafeAreaView,
    Text,
    TouchableOpacity, TextInput,
} from 'react-native';
import CategoryButton from '../components/CategoryCard';
import AppNavigator from '../navigation/AppNavigator';
import Searchbar from '../components/SearchBar';
import HeaderBar from '../navigation/HeaderBar';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@expo/vector-icons';

export default function AdminScreen() {
    const navigation = useNavigation();

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch('http://145.24.223.126:5000/api/categories')  // pas IP aan indien nodig
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Fout bij ophalen categorieën:', error));
    }, []);


    return (
        <>
            <SafeAreaView style={{flex: 1}}>
                <HeaderBar/>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={28} color="#444" />
                    </TouchableOpacity>
                </View>

                <Text>Welkom op de admin page</Text>

                <ScrollView contentContainerStyle={styles.container}>
                    {categories.map((cat) => (
                        <View key={cat._id} style={styles.card}>
                            <Text style={styles.cardText}>{cat.name}</Text>
                        </View>
                    ))}
                </ScrollView>


            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    header: {
        padding: 16,
    },
    card: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        marginVertical: 8,
        borderRadius: 6,
    },
    cardText: {
        fontSize: 16,
        color: '#333',
    },
});
