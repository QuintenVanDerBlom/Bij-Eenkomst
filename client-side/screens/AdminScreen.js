// GEHERSTRUCTUREERDE AdminScreen.js MET VOLLEDIGE FORMULIEREN VOOR ALLE TYPES

import React, { useEffect, useState } from 'react';
import {
    ScrollView, View, StyleSheet, SafeAreaView, Text,
    TouchableOpacity, TextInput
} from 'react-native';
import HeaderBar from '../navigation/HeaderBar';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function AdminScreen() {
    const navigation = useNavigation();

    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [entries, setEntries] = useState([]);
    const [roles, setRoles] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [locations, setLocations] = useState([]);

    const [modalType, setModalType] = useState(null);
    const [editingId, setEditingId] = useState(null);

    // Algemene formvelden
    const [fieldValues, setFieldValues] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        fetch('http://145.24.223.126:5000/api/categories').then(res => res.json()).then(setCategories);
        fetch('http://145.24.223.126:5000/api/users').then(res => res.json()).then(setUsers);
        fetch('http://145.24.223.126:5000/api/entries').then(res => res.json()).then(setEntries);
        fetch('http://145.24.223.126:5000/api/roles').then(res => res.json()).then(setRoles);
        fetch('http://145.24.223.126:5000/api/subcategories').then(res => res.json()).then(setSubcategories);
        fetch('http://145.24.223.126:5000/api/locations').then(res => res.json()).then(setLocations);
    };

    const endpointMap = {
        category: 'categories',
        role: 'roles',
        subcategory: 'subcategories',
        location: 'locations',
        user: 'users',
        entry: 'entries'
    };

    const defaultFieldValues = {
        name: '',
        description: '',
        title: '',
        head_image: '',
        sub_images: '',
        information: '',
        latitude: '',
        longitude: '',
        full_name: '',
        mail_adress: '',
        password: '',
        role_id: '',
        category_id: '',
        sub_category_id: '',
        created_by: '',
        linked_categories: []
    };

    const payloadMap = {
        category: (v) => ({ name: v.name, description: v.description }),
        role: (v) => ({ name: v.name }),
        subcategory: (v) => ({ name: v.name, description: v.description, category_id: v.category_id }),
        location: (v) => ({
            name: v.name,
            description: v.description,
            latitude: parseFloat(v.latitude),
            longitude: parseFloat(v.longitude),
            user_id: v.created_by
        }),
        user: (v) => ({
            full_name: v.full_name,
            mail_adress: v.mail_adress,
            password: v.password,
            role_id: v.role_id
        }),
        entry: (v) => ({
            title: v.title,
            description: v.description,
            head_image: v.head_image,
            sub_images: v.sub_images ? v.sub_images.split(',') : [],
            information: v.information,
            category_id: v.category_id,
            sub_category_id: v.sub_category_id,
            created_by: v.created_by,
            linked_categories: [v.category_id]
        })
    };

    const handleSaveModal = () => {
        const isEditing = !!editingId;
        const endpoint = endpointMap[modalType];
        const payload = payloadMap[modalType](fieldValues);

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing
            ? `http://145.24.223.126:5000/api/${endpoint}/${editingId}`
            : `http://145.24.223.126:5000/api/${endpoint}`;

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(() => {
                fetchData();
                closeModal();
            })
            .catch(console.error);
    };

    const closeModal = () => {
        setModalType(null);
        setFieldValues({});
        setEditingId(null);
    };

    const handleDelete = (type, id) => {
        fetch(`http://145.24.223.126:5000/api/${type}/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) fetchData();
            })
            .catch(console.error);
    };

    const handleChange = (field, value) => {
        setFieldValues(prev => ({ ...prev, [field]: value }));
    };

    const renderInputs = () => {
        const fields = {
            category: ['name', 'description'],
            role: ['name'],
            subcategory: ['name', 'description', 'category_id'],
            location: ['name', 'description', 'latitude', 'longitude', 'created_by'],
            user: ['full_name', 'mail_adress', 'password', 'role_id'],
            entry: [
                'title', 'description', 'head_image', 'sub_images', 'information',
                'category_id', 'sub_category_id', 'created_by'
            ]
        }[modalType];

        return fields.map(field => {
            if (field.includes('_id')) {
                const options = {
                    category_id: categories,
                    sub_category_id: subcategories,
                    created_by: users,
                    role_id: roles
                }[field];

                return (
                    <Picker
                        key={field}
                        selectedValue={fieldValues[field] || ''}
                        onValueChange={(value) => handleChange(field, value)}
                    >
                        <Picker.Item label={`Selecteer ${field}`} value="" />
                        {options.map(opt => (
                            <Picker.Item key={opt._id} label={opt.name || opt.full_name} value={opt._id} />
                        ))}
                    </Picker>
                );
            }
            return (
                <TextInput
                    key={field}
                    style={styles.input}
                    placeholder={field}
                    value={fieldValues[field] || ''}
                    onChangeText={(value) => handleChange(field, value)}
                />
            );
        });
    };

    const renderEntitySection = (title, data, type) => (
        <>
            <Text>{title}</Text>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    setModalType(type);
                    setFieldValues(defaultFieldValues);
                    setEditingId(null);
                }}
            >
                <Text style={styles.addButtonText}>+ Voeg {title.toLowerCase()} toe</Text>
            </TouchableOpacity>
            {data.map((item) => (
                <View key={item._id} style={styles.card}>
                    <Text style={styles.cardText}>{item.name || item.title || item.full_name}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={() => {
                            setModalType(type);
                            setFieldValues(item);
                            setEditingId(item._id);
                        }}>
                            <Text style={{ color: 'blue' }}>Bewerk</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(endpointMap[type], item._id)}>
                            <Text style={{ color: 'red' }}>Verwijder</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
        </>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderBar />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={28} color="#444" />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.container}>
                {renderEntitySection('Categories', categories, 'category')}
                {renderEntitySection('Roles', roles, 'role')}
                {renderEntitySection('Subcategories', subcategories, 'subcategory')}
                {renderEntitySection('Locations', locations, 'location')}
                {renderEntitySection('Users', users, 'user')}
                {renderEntitySection('Entries', entries, 'entry')}
            </ScrollView>

            {modalType && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>{editingId ? 'Bewerk' : 'Nieuwe'} {modalType}</Text>
                        {renderInputs()}
                        <TouchableOpacity style={styles.saveButton} onPress={handleSaveModal}>
                            <Text style={styles.saveButtonText}>Opslaan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                            <Text style={styles.cancelButtonText}>Annuleer</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16 },
    header: { padding: 16 },
    card: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        marginVertical: 8,
        borderRadius: 6,
    },
    cardText: { fontSize: 16, color: '#333' },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        margin: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    addButtonText: { color: 'white', fontSize: 16 },
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
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
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
    saveButtonText: { color: 'white', textAlign: 'center' },
    cancelButton: {
        padding: 10,
        borderRadius: 6,
        backgroundColor: '#ccc',
    },
    cancelButtonText: { textAlign: 'center' },
});
