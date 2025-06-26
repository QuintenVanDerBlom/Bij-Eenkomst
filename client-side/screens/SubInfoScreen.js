import React, { useContext, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Image,
    Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderBar from '../navigation/HeaderBar';
import AppNavigator from '../navigation/AppNavigator';
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { DarkModeContext } from "../Contexts/DarkModeContext";

export default function SubInfoScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { subcategoryId } = route.params;

    const [entries, setEntries] = useState([]);
    const [subcategory, setSubcategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [difficultWords, setDifficultWords] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedWordInfo, setSelectedWordInfo] = useState(null);

    const { isDarkMode } = useContext(DarkModeContext);
    const styles = getStyles(isDarkMode);

    useEffect(() => {
        const loadData = async () => {
            try {
                const q = query(collection(db, 'entries'), where('sub_category_id', '==', subcategoryId));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEntries(data);

                const subSnap = await getDoc(doc(db, 'subcategories', subcategoryId));
                if (subSnap.exists()) {
                    setSubcategory({ id: subSnap.id, ...subSnap.data() });
                }

                const difficultSnap = await getDocs(collection(db, 'difficultWords'));
                const difficultData = difficultSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDifficultWords(difficultData);

            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [subcategoryId]);

    const toggleExpand = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    const highlightWords = (text) => {
        if (!text || difficultWords.length === 0) return text;

        const wordList = difficultWords.map(w => w.name);
        const parts = text.split(new RegExp(`(${wordList.join("|")})`, "gi"));

        return parts.map((part, index) => {
            const match = difficultWords.find(word => word.name.toLowerCase() === part.toLowerCase());
            if (match) {
                return (
                    <Text
                        key={index}
                        style={{ color: 'blue', textDecorationLine: 'underline' }}
                        onPress={() => {
                            setSelectedWordInfo(match);
                            setModalVisible(true);
                        }}
                    >
                        {part}
                    </Text>
                );
            }
            return <Text key={index}>{part}</Text>;
        });
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#ffdd00" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <HeaderBar />
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back" size={28} color={isDarkMode ? "#fff" : "#444"} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{subcategory?.name || 'Subcategorie Info'}</Text>
                </View>

                {subcategory?.description && (
                    <Text style={styles.subcategoryDescription}>{highlightWords(subcategory.description)}</Text>
                )}

                {entries.map((entry, index) => (
                    <View key={entry.id} style={styles.accordionItem}>
                        <TouchableOpacity style={styles.accordionHeader} onPress={() => toggleExpand(index)}>
                            <Text style={styles.accordionTitle}>{entry.title}</Text>
                            <MaterialIcons
                                name={expanded === index ? 'expand-less' : 'expand-more'}
                                size={24}
                                color="#444"
                            />
                        </TouchableOpacity>

                        {expanded === index && (
                            <View style={styles.accordionContent}>
                                {entry.head_image && typeof entry.head_image === 'string' && entry.head_image.startsWith('http') && (
                                    <Image
                                        source={{ uri: entry.head_image }}
                                        style={styles.image}
                                        resizeMode="contain"
                                    />
                                )}

                                <Text style={styles.label}>Beschrijving:</Text>
                                <Text style={styles.text}>{highlightWords(entry.description)}</Text>

                                <Text style={styles.label}>Extra informatie:</Text>
                                <Text style={styles.text}>{highlightWords(entry.information)}</Text>
                            </View>
                        )}
                    </View>
                ))}

                <View style={styles.filler}></View>
            </ScrollView>

            {selectedWordInfo && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedWordInfo.name}</Text>
                            <Text style={styles.modalText}>{selectedWordInfo.description}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Sluiten</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

            <AppNavigator />
        </SafeAreaView>
    );
}

const getStyles = (isDarkMode) => StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: isDarkMode ? '#121212' : '#fff',
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: isDarkMode ? '#333' : '#ddd',
        backgroundColor: isDarkMode ? '#1c1c1c' : '#fff',
    },
    backButton: {
        paddingRight: 12,
        paddingVertical: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: isDarkMode ? '#fff' : '#222',
    },
    subcategoryDescription: {
        fontSize: 16,
        color: isDarkMode ? '#ccc' : '#555',
        textAlign: 'center',
        marginHorizontal: 20,
        marginBottom: 10,
        paddingTop: 20
    },
    accordionItem: {
        marginBottom: 12,
        borderWidth: 1,
        borderColor: isDarkMode ? '#444' : '#ccc',
        borderRadius: 8,
        backgroundColor: isDarkMode ? '#1e1e1e' : '#f9f9f9',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 14,
        alignItems: 'center',
    },
    accordionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: isDarkMode ? '#fff' : '#333',
        flex: 1,
    },
    accordionContent: {
        paddingHorizontal: 14,
        paddingBottom: 12,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: isDarkMode ? '#333' : '#eee',
    },
    label: {
        fontWeight: 'bold',
        marginTop: 10,
        color: isDarkMode ? '#ddd' : '#444',
    },
    text: {
        color: isDarkMode ? '#ccc' : '#555',
        lineHeight: 20,
    },
    filler: {
        paddingTop: 70,
        paddingBottom: 10
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#007bff',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
