import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Picker } from '@react-native-picker/picker';

export default function RegisterScreen() {
    const navigation = useNavigation();
    const [roles, setRoles] = useState([]);

    const [formUser, setFormUser] = useState({
        full_name: '',
        mail_adress: '',
        password: '',
        role_id: '',
    });

    const handleInputUser = (field, value) => {
        setFormUser({ ...formUser, [field]: value });
    };

    const loadRoles = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'roles'));
            const rolesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRoles(rolesData);
        } catch (error) {
            Alert.alert('Fout', 'Kan rollen niet laden');
        }
    };

    useEffect(() => {
        loadRoles();
    }, []);

    const addUser = async () => {
        const { full_name, mail_adress, password, role_id } = formUser;
        if (!full_name || !mail_adress || !password || !role_id) {
            Alert.alert('Fout', 'Vul alle velden in.');
            return;
        }

        try {
            await addDoc(collection(db, 'users'), {
                full_name,
                mail_adress,
                password,
                role_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            });

            Alert.alert('Succes', 'Gebruiker succesvol geregistreerd!');
            setFormUser({ full_name: '', mail_adress: '', password: '', role_id: '' });
            navigation.navigate('Login'); // Of 'Admin' als je direct naar admin wilt
        } catch (error) {
            Alert.alert('Fout', 'Gebruiker kon niet worden toegevoegd.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registreren</Text>

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
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
            />
            <TextInput
                placeholder="Wachtwoord"
                value={formUser.password}
                onChangeText={text => handleInputUser('password', text)}
                secureTextEntry
                style={styles.input}
            />

            <Picker
                selectedValue={formUser.role_id}
                onValueChange={value => handleInputUser('role_id', value)}
                style={styles.input}
            >
                <Picker.Item label="Selecteer een rol" value="" />
                {roles.map(role => (
                    <Picker.Item key={role.id} label={role.name} value={role.id} />
                ))}
            </Picker>

            <TouchableOpacity onPress={addUser} style={styles.button}>
                <Text style={styles.buttonText}>Registreer</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        marginBottom: 24,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#34A853',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
