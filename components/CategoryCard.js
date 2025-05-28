import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const category = [
    { key: 'Bijen', title: 'Bijen', image: require('../assets/bee.png') },
    { key: 'Vlinder', title: 'Vlinder', image: require('../assets/butterfly.png') },
    { key: 'Bloemen', title: 'Bloemen', image: require('../assets/tulips.png') },
    { key: 'Fruit', title: 'Fruit', image: require('../assets/fruits.png') },
];

export default function CategoryCard() {
    const navigation = useNavigation();
    const [search, setSearch] = useState('');

    const filteredCategories = category.filter(fruit =>
        fruit.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.grid}>
                {filteredCategories.map(({ key, title, image }) => (


                    <TouchableOpacity
                        key={key}
                        style={styles.card}
                        onPress={() =>
                            navigation.navigate('InfoScreen', {
                                categorie: key,
                                locationId: 'locatie123',
                            })
                        }
                        activeOpacity={0.7}
                    >
                        <Image
                            source={image}
                            style={styles.categoryImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>{title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginHorizontal: 10,
        marginTop: 10,
    },
    card: {
        width: '45%',
        backgroundColor: '#ffdd00', // gele achtergrond
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
        color: 'black', // zwart
        textAlign: 'center',
    },
});
