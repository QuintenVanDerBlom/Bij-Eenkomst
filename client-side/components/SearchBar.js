import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SearchBar() {
    const [search, setSearch] = useState('');
    const [entries, setEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetch('http://145.24.223.126:5000/api/entries')
            .then(res => res.json())
            .then(data => setEntries(data))
            .catch(error => console.error('API fetch error:', error));
    }, []);

    useEffect(() => {
        if (!search.trim()) {
            setFilteredEntries([]);
            return;
        }

        const lowerSearch = search.toLowerCase();

        const results = entries
            .map(entry => {
                // Wat voor soort item is dit?
                // Ik check eerst of title matches categorie/subcategorie (naam)
                // Om vervolgens relevance te geven

                // Check categorie match
                const categoryName = entry.category_id?.name?.toLowerCase() || '';
                // Check subcategorie match
                const subCategoryName = entry.sub_category_id?.name?.toLowerCase() || '';
                // Titel
                const title = entry.title?.toLowerCase() || '';

                let relevance = 0;
                let type = 'info'; // default info item

                if (categoryName === lowerSearch) {
                    relevance = 4;
                    type = 'category';
                } else if (subCategoryName === lowerSearch) {
                    relevance = 3;
                    type = 'subcategory';
                } else if (title === lowerSearch) {
                    relevance = 5; // hoogste relevantie op titel precies match
                } else if (
                    title.includes(lowerSearch) ||
                    subCategoryName.includes(lowerSearch) ||
                    categoryName.includes(lowerSearch)
                ) {
                    relevance = 1;
                }

                return { ...entry, relevance, type };
            })
            .filter(e => e.relevance > 0)
            .sort((a, b) => b.relevance - a.relevance);

        setFilteredEntries(results);
    }, [search, entries]);

    const handlePress = (entry) => {
        // Navigeren afhankelijk van type
        if (entry.type === 'category') {
            navigation.navigate('InfoScreen', { id: entry.category_id._id, categoryName: entry.category_id.name });
        } else {
            // subcategory of info-item
            navigation.navigate('SubInfo', { id: entry._id });
        }

        setSearch('');
        setFilteredEntries([]);
    };

    const getTypeLabel = (entry) => {
        if (entry.type === 'category') return 'Categorie';
        if (entry.type === 'subcategory') return 'Subcategorie';
        return 'Informatie-item';
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Zoek informatie..."
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                clearButtonMode="while-editing"
            />
            {filteredEntries.length > 0 && (
                <FlatList
                    data={filteredEntries}
                    keyExtractor={(item) => item._id}
                    style={styles.suggestionsList}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handlePress(item)} style={styles.suggestionItem}>
                            <Text style={styles.titleText}>{item.title}</Text>
                            <Text style={styles.metaText}>{getTypeLabel(item)}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 15,
        paddingTop: 10,
        zIndex: 10,
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
    suggestionsList: {
        maxHeight: 200,
        marginTop: 5,
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    suggestionItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    titleText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#222',
    },
    metaText: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
});
