import React from 'react';
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
    const { titel, imageKey, beschrijving, insects, extraDetails } = route.params;

    const imageMap = {
        sunflower: require('../assets/sunflower.png'),
        lavender: require('../assets/lavender.png'),
        rose: require('../assets/rose.png'),
        marjoram: require('../assets/marjoram.png'),
        bee: require('../assets/bee.png'),
        butterfly: require('../assets/butterfly.png'),
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <HeaderBar />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={28} color="#444" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{titel}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <Image
                    source={imageMap[imageKey]}
                    style={styles.titleImage}
                />

                <Text style={styles.label}>Beschrijving:</Text>
                <Text style={styles.text}>{beschrijving}</Text>

                <Text style={styles.label}>Bijbehorende insecten:</Text>
                <View style={styles.insectContent}>
                        {insects.map((insect, index) => (
                            <Image
                                key={index}
                                source={imageMap[insect]}
                                style={styles.insectImage}
                            />
                        ))}
                </View>

                <Text style={styles.label}>Extra informatie:</Text>
                <Text style={styles.text}>{extraDetails}</Text>

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
