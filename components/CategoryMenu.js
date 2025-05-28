import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CategoryMenu({ categories }) {
    return (
        <View style={styles.menu}>
            {categories.map((category, index) => (
                <TouchableOpacity key={index} style={styles.categoryItem}>
                    <Text>{category}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    menu: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        margin: 16,
    },
    categoryItem: {
        padding: 16,
        backgroundColor: '#E3F2FD', // Light blue
        borderRadius: 8,
        margin: 8,
        minWidth: '40%',
        alignItems: 'center',
    },
});