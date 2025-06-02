import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

export default function SearchBar() {
    const [search, setSearch] = useState('');

    return (
        <View style={styles.searchContainer}>
            <TextInput
                placeholder="Zoek informatie..."
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                clearButtonMode="while-editing"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: 'white',
    },
});
