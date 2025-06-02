import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderBar from '../navigation/HeaderBar';
import AppNavigator from '../navigation/AppNavigator';

export default function SubDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    // const { titel, imageKey, beschrijving, insects, extraDetails, links } = route.params;
    const { id } = route.params
    const [entrie, setEntrie] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEntrie() {
            try {
                const response = await fetch(`http://145.137.57.63:5000/api/entries/${id}`);
                const data = await response.json();

                setEntrie(data);
                // console.log("Fetched data:", data);

            } catch (error) {
                console.error('Error fetching entries:', error);
                setEntrie([]);
            } finally {
                setLoading(false);
            }
        }

        fetchEntrie();
    }, [id]);

    // const imageMap = {
    //     sunflower: require('../assets/sunflower.png'),
    //     lavender: require('../assets/lavender.png'),
    //     rose: require('../assets/rose.png'),
    //     marjoram: require('../assets/marjoram.png'),
    //     bee: require('../assets/bee.png'),
    //     butterfly: require('../assets/butterfly.png'),
    // };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <HeaderBar />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={28} color="#444" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{entrie.title}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <Image
                    source={require('../assets/sunflower.png')}
                    style={styles.titleImage}
                />

                <View style={styles.contentSection}>
                    <Text style={styles.label}>Beschrijving:</Text>
                    <Text style={styles.text}>{entrie.description}</Text>
                </View>

                <View style={styles.contentSection}>
                    <Text style={styles.label}>Bijbehorende insecten:</Text>
                    {/*<View style={styles.insectContent}>*/}
                    {/*    {insects.map((insect, index) => (*/}
                    {/*        <Image*/}
                    {/*            key={index}*/}
                    {/*            source={imageMap[insect]}*/}
                    {/*            style={styles.insectImage}*/}
                    {/*        />*/}
                    {/*    ))}*/}
                    {/*</View>*/}
                </View>

                <View style={styles.contentSection}>
                    <Text style={styles.label}>Extra informatie:</Text>
                    {/*<Text style={styles.text}>{extraDetails}</Text>*/}
                </View>

                <View style={styles.contentSection}>
                    <Text style={styles.label}>Bronnen:</Text>
                    {/*<Text>*/}
                    {/*    {links.map((link, index) => (*/}

                    {/*        {link}*/}
                    {/*    ))}*/}
                    {/*</Text>*/}
                    {/*{links.map((link, index) => (*/}
                    {/*    <Text key={index}>*/}
                    {/*        {link}*/}
                    {/*    </Text>*/}
                    {/*))}*/}
                </View>

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
        height: 50,
        width: 50,
    }
});
