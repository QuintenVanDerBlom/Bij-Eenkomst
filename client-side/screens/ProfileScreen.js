import React, {useEffect, useState} from 'react'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppNavigator from '../navigation/AppNavigator';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Pressable,
    Switch,
    Alert,
    Modal,
    TextInput,
    ActivityIndicator
} from "react-native";
import HeaderBar from "../navigation/HeaderBar";
import { db } from '../firebaseConfig';
import { doc, updateDoc} from "firebase/firestore";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { deleteUser } from 'firebase/auth';
import { useAuth } from "../auth/AuthContext";

export default function ProfileScreen() {
    const { currentUser, userData, loading  } = useAuth();
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [editedPassword, setEditedPassword] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [visitedLocations, setVisitedLocations] = useState([]);
    const [darkMode, setDarkMode] = useState(null);
    const navigation = useNavigation();

    const auth = useAuth();

    useEffect(() => {
        if (auth.loading) return; // Wacht tot de auth-status geladen is
        if (!currentUser) {
            navigation.navigate('Login');
        }
    }, [currentUser, auth.loading]);

    useEffect(() => {
        if (userData) {
            setEditedName(userData.full_name || '');
            setEditedEmail(userData.mail_adress || '');
        }
    }, [userData]);

    const updateUserData = async () => {
        if (!userData?.id) return;

        const updatedFields = {
            full_name: editedName,
            mail_adress: editedEmail,
        };

        if (editedPassword) {
            updatedFields.passwordHash = editedPassword; // Alleen als je zelf wachtwoorden beheert
        }

        try {
            const userRef = doc(db, 'users', userData.id);
            await updateDoc(userRef, updatedFields);
            Alert.alert('Succes', 'Profiel bijgewerkt.');
            setModalVisible(false);
        } catch (error) {
            console.error('Fout bij updaten profiel:', error);
            Alert.alert('Fout', 'Kon profiel niet bijwerken.');
        }
    };

    const handleSave = () => {
        updateUserData();
    };

    const handleDeleteAccount = async () => {
        try {
            if (currentUser) {
                await deleteUser(currentUser);
                Alert.alert('Account verwijderd', 'Je account is verwijderd.');
                navigation.navigate('Login')
            }
        } catch (error) {
            if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                    'Opnieuw inloggen vereist',
                    'Log opnieuw in om je account te verwijderen.'
                );
            } else {
                Alert.alert('Fout', 'Er ging iets mis bij het verwijderen van je account.');
            }
        }
    };

    useFocusEffect( // --> opnieuw geladen als de pagina opent
        React.useCallback(() => {
            const fetchVisitedLocations = async () => {
                try {
                    const json = await AsyncStorage.getItem('visitedLocations');
                    if (json !== null) {
                        setVisitedLocations(JSON.parse(json));
                    }
                } catch (e) {
                    console.error('Fout bij ophalen locaties:', e);
                }
            };

            fetchVisitedLocations();
        }, [])
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!currentUser || !userData) {
        navigation.navigate('Login');
        return null;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderBar/>

            <ScrollView contentContainerStyle={styles.container}>
                <View>
                    <Text style={styles.title}>Profiel</Text>
                    <Text style={styles.welcome}>Welkom</Text>
                    <Text style={styles.username}>{userData?.full_name}</Text>
                </View>

                <View style={styles.profileCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Naam:</Text>
                        <Pressable style={styles.editIcon} onPress={() => setModalVisible(true)}>
                            <Feather name="tool" size={20} color="#000" />
                        </Pressable>
                    </View>
                    <Text style={styles.cardText}>{userData?.full_name}</Text>
                    <Text style={styles.cardTitle}>E-mail:</Text>
                    <Text style={styles.cardText}>{userData?.mail_address}</Text>
                    <Text style={styles.cardTitle}>Wachtwoord:</Text>
                    <View style={styles.passwordRow}>
                        <Text style={styles.cardText}>{showPassword ? userData.password : '********'}</Text>
                        <Pressable onPress={() => setShowPassword(!showPassword)}>
                            <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} />
                        </Pressable>
                    </View>
                </View>

                <View>
                    <Text style={styles.sectionTitle}>Bezochte locaties:</Text>
                    {visitedLocations.length === 0 ? (
                        <Text>Je hebt nog geen locaties bezocht.</Text>
                    ) : (
                        visitedLocations.map((location, index) => (
                            <Pressable key={index} style={styles.locationButton}>
                                <Text style={styles.locationText}>{location.name}</Text>
                            </Pressable>
                        ))
                    )}
                </View>

                <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Darkmode</Text>
                    <Switch
                        value={darkMode}
                        onValueChange={setDarkMode}
                        thumbColor={darkMode ? '#fff' : '#000'}
                        trackColor={{ true: '#6c6c6c', false: '#ccc' }}
                    />
                </View>

                <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Profiel aanpassen</Text>

                            <Text>Naam:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={userData.full_name || ''}
                                value={editedName}
                                onChangeText={setEditedName}
                            />
                            <Text>E-mail:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={userData.mail_address || ''}
                                value={editedEmail}
                                onChangeText={setEditedEmail}
                            />
                            <Text>Wachtwoord:</Text>
                            <TextInput
                                style={styles.input}
                                secureTextEntry
                                value={editedPassword}
                                onChangeText={setEditedPassword}
                            />

                            <Pressable style={styles.saveButton} onPress={handleSave}>
                                <Text style={styles.saveButtonText}>Opslaan</Text>
                            </Pressable>

                            <View style={styles.deleteAccount}>
                                <Pressable onPress={() => setModalVisible(false)}>
                                    <Text style={{ color: 'red', marginTop: 20 }}>Annuleer</Text>
                                </Pressable>
                                <Pressable onPress={() => handleDeleteAccount()}>
                                    <Text style={{ color: 'red', marginTop: 20 }}>Verwijder account</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
            <AppNavigator/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    welcome: {
        fontSize: 18,
        marginTop: 10,
    },
    username: {
        fontStyle: 'italic',
        fontSize: 16,
    },
    beeIcon: {
        width: 40,
        height: 40,
        marginTop: 5,
    },
    profileCard: {
        backgroundColor: '#eee',
        borderRadius: 10,
        padding: 15,
        marginVertical: 20,
        borderWidth: 1,
        borderColor: '#444',
        width: '100%',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardTitle: {
        fontWeight: 'bold',
        marginTop: 10,
    },
    cardText: {
        fontSize: 16,
    },
    editIcon: {
        backgroundColor: '#ffeb3b',
        padding: 5,
        marginLeft: 'auto',
        borderRadius: 6,
    },
    passwordRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
    },
    locationButton: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        width: 300,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    locationText: {
        fontSize: 15,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    deleteAccount: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 10,
        marginVertical: 5,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 6,
        marginTop: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    switchLabel: {
        marginRight: 10,
        fontSize: 16,
    },
});
