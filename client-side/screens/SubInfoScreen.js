import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
    Image
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderBar from '../navigation/HeaderBar';
import AppNavigator from '../navigation/AppNavigator';
import { db } from "../firebaseConfig";
import {collection, query, where, getDoc, doc} from "firebase/firestore";

export default function InfoScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { entryId } = route.params;
    const [entry, setEntry] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [loading, setLoading] = useState(true);

    const imageMap = {
        Zonnebloem: require('../assets/sunflower.png'),
        Lavendel: require('../assets/lavender.png'),
        Klaproos: require('../assets/rose.png'),
        Bij: require('../assets/bee.png'),
        Vlinder: require('../assets/bee.png')
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const docRef = doc(db, 'entries', entryId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setEntry({ id: docSnap.id, ...docSnap.data() });
                } else {
                    setEntry(null);
                }

                // setEntries(data);
                // console.log("categoryId", entryId);
                console.log("entries", entry);
            } catch (error) {
                console.error('Error loading entries:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [entryId]);

    const toggleExpand = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#ffdd00" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <HeaderBar />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={28} color="#444" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{entry.title}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <Image
                    source={imageMap[entry.head_image] || require('../assets/bee.png')}
                    style={styles.titleImage}
                />

                <View style={styles.contentSection}>
                    <Text style={styles.label}>Beschrijving:</Text>
                    <Text style={styles.text}>{entry.description}</Text>
                </View>

                {/*{entry.sub_images && entry.sub_images.length > 0 && (*/}
                {/*    <View style={styles.contentSection}>*/}
                {/*        <Text style={styles.label}>Foto's:</Text>*/}
                {/*        <View style={styles.insectContent}>*/}
                {/*            {entry.sub_images.map((insect, index) => (*/}
                {/*                <Image*/}
                {/*                    key={index}*/}
                {/*                    source={{uri: insect}}*/}
                {/*                    style={styles.insectImage}*/}
                {/*                />*/}
                {/*            ))}*/}
                {/*        </View>*/}
                {/*    </View>*/}
                {/*)}*/}

                <View style={styles.contentSection}>
                    <Text style={styles.label}>Extra informatie:</Text>
                    <Text style={styles.text}>{entry.information}</Text>
                </View>

                {/*<View style={styles.contentSection}>*/}
                {/*    <Text style={styles.label}>Bronnen:</Text>*/}
                {/*    <Text>Dit moet nog in de database gezet worden</Text>*/}
                {/*</View>*/}

            </ScrollView>

            <AppNavigator />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
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
    },
    content: {
        padding: 20,
        flexDirection: "column",
        alignItems: 'center',
    },
    contentSection: {
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderColor: '#291700',
    },
    titleImage: {
        width: 150,
        height: 150,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        color: '#444',
        alignSelf: "center",
    },
    text: {
        fontSize: 15,
        lineHeight: 22,
        color: '#333',
        marginTop: 4,
        textAlign: "center",
    },
    insectContent: {
        flexDirection: "row",
        alignItems: "center"
    },
    insectImage: {
        margin: 10,
        height: 100,
        width: 100,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
