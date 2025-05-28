import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function SearchBar({ placeholder }) {
    return (
        <View style={styles.searchBar}>
            <TextInput
                placeholder={placeholder}
                style={styles.input}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        margin: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 24,
        paddingHorizontal: 16,
    },
    input: { height: 40 },
});