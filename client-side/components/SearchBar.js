import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function SearchBar() {
    const [search, setSearch] = useState('');
    const [entries, setEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const navigation = useNavigation();

    // Data ophalen uit Firebase
    useEffect(() => {
        const fetchEntries = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'entries'));
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setEntries(data);
            } catch (error) {
                console.error('Firebase fetch error:', error);
            }
        };

        fetchEntries();
    }, []);

    // Filter entries wanneer de zoekterm verandert
    useEffect(() => {
        if (!search.trim()) {
            setFilteredEntries([]);
            return;
        }

        const lowerSearch = search.toLowerCase();

        const results = entries
            .map(entry => {
                const categoryName = entry.category_id?.name?.toLowerCase() || '';
                const subCategoryName = entry.sub_category_id?.name?.toLowerCase() || '';
                const title = entry.title?.toLowerCase() || '';

                let relevance = 0;
                let type = 'info';

                if (categoryName === lowerSearch) {
                    relevance = 4;
                    type = 'category';
                } else if (subCategoryName === lowerSearch) {
                    relevance = 3;
                    type = 'subcategory';
                } else if (title === lowerSearch) {
                    relevance = 5;
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
        navigation.navigate('SubInfo', {
            entryId: entry.id,
        });

        setSearch('');
        setFilteredEntries([]);
    };

    const getTypeLabel = (entry) => {
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
                    keyExtractor={(item) => item.id}
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
