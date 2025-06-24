import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image} from 'react-native';
import {db} from '../firebaseConfig';
import {collection, addDoc, getDocs, deleteDoc, updateDoc, doc} from 'firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage';
import {storage} from '../firebaseConfig';
import HeaderBar from "../navigation/HeaderBar";
import {MaterialIcons} from "@expo/vector-icons";

import { useAuth } from '../auth/AuthContext';

export default function MakeBlogScreen() {
    const navigation = useNavigation();
    const { userData } = useAuth();

    const [blogPosts, setBlogPosts] = useState([]);
    const [locations, setLocations] = useState([]);

    const loadData = async () => {
        const fetchCollection = async (name, setter) => {
            const querySnapshot = await getDocs(collection(db, name));
            const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            setter(data);
        };
        fetchCollection('locations', setLocations);

    };

    useEffect(() => {
        if (userData) {
            setFormBlogPost((prev) => ({
                ...prev,
                user_id: userData.id
            }));
        }
    }, [userData]);


    useEffect(() => {
        loadData();
    }, []);
    const pickAndUploadImageForBlog = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.5,
            });


            console.log("Result:", result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const image = result.assets[0];

                const compressed = await ImageManipulator.manipulateAsync(
                    image.uri,
                    [{resize: {width: 800}}], // resize to 800px wide
                    {compress: 0.6, format: ImageManipulator.SaveFormat.JPEG}
                );

                const response = await fetch(compressed.uri);
                const blob = await response.blob();

                const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
                const storageRef = ref(storage, `blogImages/${Date.now()}-${filename}`);

                await uploadBytes(storageRef, blob);
                const downloadURL = await getDownloadURL(storageRef);

                setFormBlogPost(prev => ({
                    ...prev,
                    images: [...prev.images, downloadURL]
                }));
            }
        } catch (err) {
            console.error("Fout bij kiezen/uploaden:", err);
        }
    };

    useEffect(() => {
        (async () => {
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Toegang tot de galerij is nodig om afbeeldingen te kunnen uploaden.');
            }
        })();
    }, []);

    const [formBlogPost, setFormBlogPost] = useState({
        title: '',
        location_id: '',
        content: '',
        images: []
    });

    const handleInputBlogPost = (field, value) => {
        setFormBlogPost({...formBlogPost, [field]: value});
    };

    const addBlogPost = async () => {
        const { user_id, title, location_id, content, images } = formBlogPost;

        console.log("user_id:", user_id); // Debugging
        if (!user_id || !title || !content) {
            alert("Vul alle verplichte velden in.");
            return;
        }

        try {
            await addDoc(collection(db, 'blogposts'), {
                user_id: userData.id,
                title,
                location_id: location_id || null,
                content,
                images,
                created_at: new Date().toISOString()
            });

            setFormBlogPost({
                title: '',
                location_id: '',
                content: '',
                images: []
            });
            alert("Blog succesvol geplaatst!");
        } catch (err) {
            console.error("Fout bij opslaan:", err);
            alert("Er ging iets mis bij het posten.");
        }
    };


    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
            <HeaderBar/>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={28} color="#444" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Blog</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <TextInput
                    placeholder="Titel"
                    value={formBlogPost.title}
                    onChangeText={text => handleInputBlogPost('title', text)}
                    style={styles.input}
                />

                <Picker
                    selectedValue={formBlogPost.location_id}
                    onValueChange={(value) => handleInputBlogPost('location_id', value)}
                    style={styles.input}
                >
                    <Picker.Item label="Selecteer locatie (optioneel)" value=""/>
                    {locations.map((loc) => (
                        <Picker.Item key={loc.id} label={loc.name} value={loc.id}/>
                    ))}
                </Picker>

                <TextInput
                    placeholder="Content"
                    value={formBlogPost.content}
                    onChangeText={text => handleInputBlogPost('content', text)}
                    style={[styles.input, {textAlignVertical: 'top'}]}
                    multiline={true}
                    scrollEnabled={true}
                />

                <TouchableOpacity
                    onPress={pickAndUploadImageForBlog}
                    style={styles.imageButton}
                >
                    <Text style={styles.buttonText}>Afbeelding toevoegen</Text>
                </TouchableOpacity>

                {formBlogPost.images.length > 0 && (
                    <View style={{marginVertical: 10}}>
                        <Text style={{fontSize: 12}}>Toegevoegde afbeeldingen:</Text>
                        {formBlogPost.images.map((url, idx) => (
                            <Image
                                key={idx}
                                source={{uri: url}}
                                style={{width: 100, height: 100, marginBottom: 10}}
                            />
                        ))}
                    </View>
                )}

                {userData && (
                    <TouchableOpacity onPress={addBlogPost} style={styles.postButton}>
                        <Text style={styles.buttonText}>Post</Text>
                    </TouchableOpacity>
                )}

            </ScrollView>
        </SafeAreaView>

    )


}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    backButton: {
        paddingRight: 12,
        paddingVertical: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
        textAlign: 'center'
    },
    content: {
        padding: 20,
        paddingBottom: 100,
        marginBottom: 50,
        flexDirection: "column",
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
        width: '100%',
        fontSize: 16,
        backgroundColor: '#fafafa',
    },
    imageButton: {
        backgroundColor: '#0F948D',
        padding: 10,
        borderRadius: 5
    },
    postButton: {
        backgroundColor: '#7EC70A',
        padding: 10,
        borderRadius: 5
    },
    buttonText: {
        color: 'white',
        textAlign: 'center'
    },
});