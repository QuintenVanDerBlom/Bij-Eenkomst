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
    const [users, setUsers] = useState([]);
    const [entries, setEntries] = useState([]);
    const [roles, setRoles] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        fetch('http://145.24.223.126:5000/api/categories')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Fout bij ophalen categorieën:', error));

        fetch('http://145.24.223.126:5000/api/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Fout bij ophalen users:', error));

        fetch('http://145.24.223.126:5000/api/entries')
            .then(response => response.json())
            .then(data => setEntries(data))
            .catch(error => console.error('Fout bij ophalen entries:', error));

        fetch('http://145.24.223.126:5000/api/roles')
            .then(response => response.json())
            .then(data => setRoles(data))
            .catch(error => console.error('Fout bij ophalen roles:', error));

        fetch('http://145.24.223.126:5000/api/subcategories')
            .then(response => response.json())
            .then(data => setSubcategories(data))
            .catch(error => console.error('Fout bij ophalen subcategories:', error));

        fetch('http://145.24.223.126:5000/api/locations')
            .then(response => response.json())
            .then(data => setLocations(data))
            .catch(error => console.error('Fout bij ophalen locations:', error));
    }, []);

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const handleCreateCategory = () => {
        fetch('http://145.24.223.126:5000/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCategoryName, description: newDescription })
        })
            .then(response => response.json())
            .then(data => {
                setCategories([...categories, data]);
                setNewCategoryName('');
                setNewDescription('');
                setShowCategoryModal(false);
            })
            .catch(error => {
                console.error('Fout bij aanmaken categorie:', error);
            });
    };



    return (
        <>
            <SafeAreaView style={{flex: 1}}>
                <HeaderBar/>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={28} color="#444" />
                    </TouchableOpacity>
                </View>

                {/*<Text>Welkom op de admin page</Text>*/}

                <Text>Categories</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setShowCategoryModal(true)}
                >
                    <Text style={styles.addButtonText}>+ Voeg categorie toe</Text>
                </TouchableOpacity>

                <ScrollView contentContainerStyle={styles.container}>
                    {categories.map((cat) => (
                        <View key={cat._id} style={styles.card}>
                            <Text style={styles.cardText}>{cat.name}</Text>
                        </View>
                    ))}
                </ScrollView>

                <Text>Users</Text>
                <ScrollView contentContainerStyle={styles.container}>
                    {users.map((usr) => (
                        <View key={usr._id} style={styles.card}>
                            <Text style={styles.cardText}>{usr.full_name}</Text>
                        </View>
                    ))}
                </ScrollView>

                <Text>Entries</Text>
                <ScrollView contentContainerStyle={styles.container}>
                    {entries.map((ent) => (
                        <View key={ent._id} style={styles.card}>
                            <Text style={styles.cardText}>{ent.title}</Text>
                        </View>
                    ))}
                </ScrollView>

                <Text>Roles</Text>
                <ScrollView contentContainerStyle={styles.container}>
                    {roles.map((rol) => (
                        <View key={rol._id} style={styles.card}>
                            <Text style={styles.cardText}>{rol.name}</Text>
                        </View>
                    ))}
                </ScrollView>

                <Text>Subcategories</Text>
                <ScrollView contentContainerStyle={styles.container}>
                    {subcategories.map((sub) => (
                        <View key={sub._id} style={styles.card}>
                            <Text style={styles.cardText}>{sub.name}</Text>
                        </View>
                    ))}
                </ScrollView>

                <Text>Locations</Text>
                <ScrollView contentContainerStyle={styles.container}>
                    {locations.map((loc) => (
                        <View key={loc._id} style={styles.card}>
                            <Text style={styles.cardText}>{loc.name}</Text>
                        </View>
                    ))}
                </ScrollView>




            </SafeAreaView>

            {showCategoryModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Nieuwe categorie</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Naam van categorie"
                            value={newCategoryName}
                            onChangeText={setNewCategoryName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Beschrijving"
                            value={newDescription}
                            onChangeText={setNewDescription}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleCreateCategory}>
                            <Text style={styles.saveButtonText}>Opslaan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCategoryModal(false)}>
                            <Text style={styles.cancelButtonText}>Annuleer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

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
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        margin: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 6,
        marginBottom: 10,
    },
    saveButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    cancelButton: {
        padding: 10,
        borderRadius: 6,
        backgroundColor: '#ccc',
    },
    cancelButtonText: {
        textAlign: 'center',
    }

});
