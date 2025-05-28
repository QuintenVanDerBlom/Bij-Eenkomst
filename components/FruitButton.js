import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const fruits = [
    { key: 'aardbei', title: 'Aardbei', icon: 'strawberry' },
    { key: 'framboos', title: 'Framboos', icon: 'raspberry-pi' },
    { key: 'kers', title: 'Kers', icon: 'cherry' },
    { key: 'braam', title: 'Braam', icon: 'leaf' },
];

export default function FruitScreen() {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');

    // Filter de fruits op basis van search (case insensitive)
    const filteredFruits = fruits.filter(fruit =>
        fruit.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ScrollView>

            {/* Zoekbalk */}
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Zoek fruit..."
                    value={search}
                    onChangeText={setSearch}
                    style={styles.searchInput}
                    clearButtonMode="while-editing"
                />
            </View>

            {/* Grid met gefilterde fruit */}
            <View style={styles.grid}>
                {filteredFruits.map(({ key, title, icon }) => (
                    <TouchableOpacity
                        key={key}
                        style={styles.card}
                        onPress={() =>
                            navigation.navigate('InfoScreen', {
                                fruit: key,
                                locationId: 'locatie123', // als je bijvoorbeeld unieke locatiegegevens hebt
                            })
                        }
                        activeOpacity={0.7}
                    >
                        <Text style={styles.title}>{title}</Text>
                        <MaterialCommunityIcons name={icon} size={64} color="gold" />
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#fff8c4',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginHorizontal: 10,
        marginTop: 10,
    },
    card: {
        width: '45%',
        backgroundColor: '#fff8c4',
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
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: 'goldenrod',
        marginBottom: 10,
    },
});
