import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet} from 'react-native';
import {db} from '../firebaseConfig';
import {collection, addDoc, getDocs, deleteDoc, updateDoc, doc} from 'firebase/firestore';
import {Picker} from '@react-native-picker/picker';


export default function FirestoreCRUDPage() {
    const [categories, setCategories] = useState([]);
    const [roles, setRoles] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [users, setUsers] = useState([]);
    const [entries, setEntries] = useState([]);


// Category
    const [formCat, setformCat] = useState({
        name: '',
        description: '',
    });

    const handleInputCat = (field, value) => {
        setformCat({...formCat, [field]: value});
    };

    const addCategory = async () => {
        if (!formCat.name || !formCat.description) return;
        await addDoc(collection(db, 'categories'), {
            name: formCat.name,
            description: formCat.description,
        });
        setformCat({name: '', description: ''});
        loadData();
    };
// Category

// Role
    const [formRol, setformRol] = useState({
        name: '',
    });

    const handleInputRol = (field, value) => {
        setformRol({...formRol, [field]: value});
    };

    const addRole = async () => {
        if (!formRol.name) return;
        await addDoc(collection(db, 'roles'), {
            name: formRol.name
        });
        setformCat({name: ''});
        loadData();
    };

    const updateRole = async (id, newName) => {
        if (!newName) return;
        await updateDoc(doc(db, 'roles', id), {
            name: newName,
        });
        loadData();
    };

    const deleteRole = async (id) => {
        await deleteDoc(doc(db, 'roles', id));
        loadData();
    };

// Role

// SubCategory
    const [formSub, setformSub] = useState({
        category_id: '',
        name: '',
        description: '',
    });

    const handleInputSub = (field, value) => {
        setformSub({...formSub, [field]: value});
    };

    const addSubCategory = async () => {
        if (!formSub.name || !formSub.description) return;
        await addDoc(collection(db, 'subcategories'), {
            category_id: formSub.category_id,
            name: formSub.name,
            description: formSub.description,
        });

        setformSub({category_id: '', name: '', description: ''});
        loadData();
    };
// Category

// Users

    const [formUser, setFormUser] = useState({
        full_name: '',
        mail_adress: '',
        password: '',
        role_id: ''
    });

    const handleInputUser = (field, value) => {
        setFormUser({...formUser, [field]: value});
    };

    const addUser = async () => {
        if (!formUser.full_name || !formUser.mail_adress || !formUser.password || !formUser.role_id) return;
        await addDoc(collection(db, 'users'), {
            full_name: formUser.full_name,
            mail_adress: formUser.mail_adress,
            password: formUser.password,
            role_id: formUser.role_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
        setFormUser({full_name: '', mail_adress: '', password: '', role_id: ''});
        loadData();
    };
// Users
// Locations

    const [formLocation, setFormLocation] = useState({
        user_id: '',
        name: '',
        latitude: '',
        longitude: '',
        description: ''
    });

    const handleInputLocation = (field, value) => {
        setFormLocation({...formLocation, [field]: value});
    };

    const addLocation = async () => {
        if (!formLocation.user_id || !formLocation.name || !formLocation.latitude || !formLocation.longitude) return;
        await addDoc(collection(db, 'locations'), {
            user_id: formLocation.user_id,
            name: formLocation.name,
            latitude: parseFloat(formLocation.latitude),
            longitude: parseFloat(formLocation.longitude),
            description: formLocation.description,
        });
        setFormLocation({user_id: '', name: '', latitude: '', longitude: '', description: ''});
        loadData();
    };
// Locations
// Entry

    const [formEntry, setFormEntry] = useState({
        category_id: '',
        sub_category_id: '',
        created_by: '',
        title: '',
        description: '',
        head_image: '',
        sub_images: '',
        information: '',
        linked_categories: []
    });

    const handleInputEntry = (field, value) => {
        setFormEntry({...formEntry, [field]: value});
    };

    const addEntry = async () => {
        const {
            category_id,
            sub_category_id,
            created_by,
            title,
            description,
            head_image,
            sub_images,
            information,
            linked_categories
        } = formEntry;
        if (!category_id || !sub_category_id || !title || !description || !head_image || !information) return;
        await addDoc(collection(db, 'entries'), {
            category_id,
            sub_category_id,
            created_by,
            title,
            description,
            head_image,
            sub_images: sub_images.split(',').map(i => i.trim()),
            information,
            linked_categories: linked_categories ? linked_categories.split(',').map(i => i.trim()) : []
        });
        setFormEntry({
            category_id: '',
            sub_category_id: '',
            created_by: '',
            title: '',
            description: '',
            head_image: '',
            sub_images: '',
            information: '',
            linked_categories: []
        });
        loadData();
    };

// Entry

    const loadData = async () => {
        const fetchCollection = async (name, setter) => {
            const querySnapshot = await getDocs(collection(db, name));
            const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            setter(data);
        };

        fetchCollection('categories', setCategories);
        fetchCollection('roles', setRoles);
        fetchCollection('subcategories', setSubcategories);
        fetchCollection('locations', setLocations);
        fetchCollection('users', setUsers);
        fetchCollection('entries', setEntries);
    };

    useEffect(() => {
        loadData();
    }, []);


    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/*Category*/}
            <Text style={styles.header}>Voeg categorie toe</Text>
            <TextInput
                placeholder="Naam"
                value={formCat.name}
                onChangeText={text => handleInputCat('name', text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Beschrijving"
                value={formCat.description}
                onChangeText={text => handleInputCat('description', text)}
                style={styles.input}
            />
            <TouchableOpacity onPress={addCategory} style={styles.button}>
                <Text style={styles.buttonText}>Toevoegen</Text>
            </TouchableOpacity>
            {/*Category*/}
            {/*Role*/}
            <Text style={styles.header}>Voeg role toe</Text>
            <TextInput
                placeholder="Naam"
                value={formRol.name}
                onChangeText={text => handleInputRol('name', text)}
                style={styles.input}
            />

            <TouchableOpacity onPress={addRole} style={styles.button}>
                <Text style={styles.buttonText}>Toevoegen</Text>
            </TouchableOpacity>
            {/*Role*/}
            {/*SubCategory*/}
            <Text style={styles.header}>Voeg subCategorie toe</Text>

            <Picker
                selectedValue={formSub.category_id}
                onValueChange={(value) => handleInputSub('category_id', value)}
                style={styles.input}
            >
                <Picker.Item label="Selecteer een categorie" value=""/>
                {categories.map((cat) => (
                    <Picker.Item key={cat.id} label={cat.name} value={cat.id}/>
                ))}
            </Picker>

            <TextInput
                placeholder="Naam"
                value={formSub.name}
                onChangeText={text => handleInputSub('name', text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Beschrijving"
                value={formSub.description}
                onChangeText={text => handleInputSub('description', text)}
                style={styles.input}
            />
            <TouchableOpacity onPress={addSubCategory} style={styles.button}>
                <Text style={styles.buttonText}>Toevoegen</Text>
            </TouchableOpacity>
            {/*SubCategory*/}
            {/*User*/}
            <Text style={styles.header}>Voeg gebruiker toe</Text>

            <TextInput
                placeholder="Volledige naam"
                value={formUser.full_name}
                onChangeText={text => handleInputUser('full_name', text)}
                style={styles.input}
            />
            <TextInput
                placeholder="E-mailadres"
                value={formUser.mail_adress}
                onChangeText={text => handleInputUser('mail_adress', text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Wachtwoord"
                value={formUser.password}
                secureTextEntry
                onChangeText={text => handleInputUser('password', text)}
                style={styles.input}
            />

            <Picker
                selectedValue={formUser.role_id}
                onValueChange={(value) => handleInputUser('role_id', value)}
                style={styles.input}
            >
                <Picker.Item label="Selecteer een rol" value=""/>
                {roles.map((role) => (
                    <Picker.Item key={role.id} label={role.name} value={role.id}/>
                ))}
            </Picker>

            <TouchableOpacity onPress={addUser} style={styles.button}>
                <Text style={styles.buttonText}>Toevoegen</Text>
            </TouchableOpacity>
            {/*User*/}
            {/*Location*/}

            <Text style={styles.header}>Voeg locatie toe</Text>

            <Picker
                selectedValue={formLocation.user_id}
                onValueChange={(value) => handleInputLocation('user_id', value)}
                style={styles.input}
            >
                <Picker.Item label="Selecteer gebruiker" value=""/>
                {users.map((user) => (
                    <Picker.Item key={user.id} label={user.full_name} value={user.id}/>
                ))}
            </Picker>

            <TextInput
                placeholder="Locatienaam"
                value={formLocation.name}
                onChangeText={text => handleInputLocation('name', text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Latitude"
                value={formLocation.latitude}
                onChangeText={text => handleInputLocation('latitude', text)}
                style={styles.input}
                keyboardType="numeric"
            />
            <TextInput
                placeholder="Longitude"
                value={formLocation.longitude}
                onChangeText={text => handleInputLocation('longitude', text)}
                style={styles.input}
                keyboardType="numeric"
            />
            <TextInput
                placeholder="Beschrijving"
                value={formLocation.description}
                onChangeText={text => handleInputLocation('description', text)}
                style={styles.input}
            />

            <TouchableOpacity onPress={addLocation} style={styles.button}>
                <Text style={styles.buttonText}>Toevoegen</Text>
            </TouchableOpacity>

            {/*Location*/}
            {/*Entry*/}

            <Text style={styles.header}>Voeg entry toe</Text>

            <Picker
                selectedValue={formEntry.category_id}
                onValueChange={(value) => handleInputEntry('category_id', value)}
                style={styles.input}
            >
                <Picker.Item label="Selecteer een categorie" value=""/>
                {categories.map((cat) => (
                    <Picker.Item key={cat.id} label={cat.name} value={cat.id}/>
                ))}
            </Picker>

            <Picker
                selectedValue={formEntry.sub_category_id}
                onValueChange={(value) => handleInputEntry('sub_category_id', value)}
                style={styles.input}
            >
                <Picker.Item label="Selecteer een subcategorie" value=""/>
                {subcategories.map((sub) => (
                    <Picker.Item key={sub.id} label={sub.name} value={sub.id}/>
                ))}
            </Picker>

            <Picker
                selectedValue={formEntry.created_by}
                onValueChange={(value) => handleInputEntry('created_by', value)}
                style={styles.input}
            >
                <Picker.Item label="Gemaakt door (optioneel)" value=""/>
                {users.map((user) => (
                    <Picker.Item key={user.id} label={user.full_name} value={user.id}/>
                ))}
            </Picker>

            <TextInput
                placeholder="Titel"
                value={formEntry.title}
                onChangeText={text => handleInputEntry('title', text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Beschrijving"
                value={formEntry.description}
                onChangeText={text => handleInputEntry('description', text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Afbeelding (hoofd) URL"
                value={formEntry.head_image}
                onChangeText={text => handleInputEntry('head_image', text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Afbeelding(en) (komma gescheiden)"
                value={formEntry.sub_images}
                onChangeText={text => handleInputEntry('sub_images', text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Informatie"
                value={formEntry.information}
                onChangeText={text => handleInputEntry('information', text)}
                style={styles.input}
            />
            <TextInput
                placeholder="Gelinkte categorieën (ID's, komma gescheiden)"
                value={formEntry.linked_categories}
                onChangeText={text => handleInputEntry('linked_categories', text)}
                style={styles.input}
            />

            <TouchableOpacity onPress={addEntry} style={styles.button}>
                <Text style={styles.buttonText}>Toevoegen</Text>
            </TouchableOpacity>

            {/*Entry*/}

            <Text style={styles.header}>Alle gegevens</Text>

            {[{title: 'Categories', data: categories},
                {title: 'Roles', data: roles},
                {title: 'Subcategories', data: subcategories},
                {title: 'Locations', data: locations},
                {title: 'Users', data: users},
                {title: 'Entries', data: entries}
            ].map(({title, data}) => (
                <View key={title} style={styles.block}>
                    <Text style={styles.blockTitle}>{title}</Text>
                    {data.map((item) => (
                        <Text key={item.id} style={styles.item}>{JSON.stringify(item)}</Text>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {padding: 20},
    header: {fontSize: 20, fontWeight: 'bold', marginVertical: 10},
    input: {borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5},
    button: {backgroundColor: 'blue', padding: 10, borderRadius: 5},
    buttonText: {color: 'white', textAlign: 'center'},
    block: {marginVertical: 15},
    blockTitle: {fontSize: 18, fontWeight: 'bold'},
    item: {fontSize: 12, paddingVertical: 2}
});
