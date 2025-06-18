import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import AppNavigator from '../navigation/AppNavigator';
import {StyleSheet, View, Text, ScrollView, Pressable, Switch, Alert, Modal, TextInput } from "react-native";
import HeaderBar from "../navigation/HeaderBar";
import { onAuthStateChanged } from 'firebase/auth';
import {auth, db} from '../firebaseConfig';
import {collection, getDocs} from "firebase/firestore";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth, deleteUser } from 'firebase/auth';

export default function ProfileScreen() {
    const [user, setUser] = useState(null);
    const [locations, setLocations] = useState(null);
    const [darkMode, setDarkMode] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [visitedLocations, setVisitedLocations] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [editedName, setEditedName] = useState(user?.full_name || '');
    const [editedEmail, setEditedEmail] = useState(user?.mail_adress || '');
    const [editedPassword, setEditedPassword] = useState('');

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    //         if (currentUser) {
    //             setUser(currentUser);
    //         } else {
    //             setUser(null);
    //         }
    //     });
    //
    //     // Cleanup de listener
    //     return () => unsubscribe();
    // }, []);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'locations'));
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setLocations(data);
        } catch (error) {
            console.error('Error fetching locations:', error);
            Alert.alert('Error', 'Failed to fetch locations');
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

    const handleSave = () => {
        // Hier zou je normaal je gegevens naar Firebase sturen
        // Voor nu: log of update je state
        console.log('Nieuwe gegevens:', {
            naam: editedName,
            email: editedEmail,
            wachtwoord: editedPassword,
        });

        setModalVisible(false);
    };

    const deleteAccount = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                await deleteUser(user);
                Alert.alert('Account verwijderd', 'Je account is succesvol verwijderd.');
                // eventueel: navigeren naar login/home
            }
        } catch (error) {
            console.error('Fout bij verwijderen account:', error);

            if (error.code === 'auth/requires-recent-login') {
                Alert.alert(
                    'Bevestiging nodig',
                    'Je moet recent opnieuw zijn ingelogd om je account te verwijderen. Log opnieuw in en probeer het nog eens.'
                );
            } else {
                Alert.alert('Fout', 'Er ging iets mis bij het verwijderen van je account.');
            }
        }
    };


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderBar/>

            <ScrollView contentContainerStyle={styles.container}>
                <View>
                    <Text style={styles.title}>Profiel</Text>
                    <Text style={styles.welcome}>Welkom</Text>
                    {/*<Text style={styles.username}>{user.full_name}</Text>*/}
                </View>

                <View style={styles.profileCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Naam:</Text>
                        {/*<Text style={styles.cardText}>{user.full_name}</Text>*/}
                        <Pressable style={styles.editIcon} onPress={() => setModalVisible(true)}>
                            <Feather name="tool" size={20} color="#000" />
                        </Pressable>
                    </View>
                    <Text style={styles.cardTitle}>E-mail:</Text>
                    {/*<Text style={styles.cardText}>{user.mail_adress}</Text>*/}
                    <Text style={styles.cardTitle}>Wachtwoord:</Text>
                    <View style={styles.passwordRow}>
                        <Text style={styles.cardText}>{showPassword ? 'wachtwoord123' : '********'}</Text>
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
                                // placeholder={user.full_name}
                                value={editedName}
                                onChangeText={setEditedName}
                            />
                            <Text>E-mail:</Text>
                            <TextInput
                                style={styles.input}
                                // placeholder={user.mail_adress}
                                value={editedEmail}
                                onChangeText={setEditedEmail}
                            />
                            <Text>Wachtwoord:</Text>
                            <TextInput
                                style={styles.input}
                                // placeholder={user.password}
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
                                <Pressable onPress={() => deleteAccount()}>
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
