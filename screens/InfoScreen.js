import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderBar from '../navigation/HeaderBar';
import AppNavigator from '../navigation/AppNavigator';

export default function InfoScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { categorie, locationId } = route.params;

    // Uitgebreide dummy data
    const data = {
        hoofdInformatie: `Informatie over ${categorie}. Deze categorie richt zich op planten die bijdragen aan de leefomgeving van bijen en vlinders.`,
        subInformatie: [
            {
                titel: "Zonnebloem",
                beschrijving: "Zonnebloemen bloeien in de zomer en bevatten veel nectar. Ze zijn ideaal voor bijen en zorgen ook voor mooie zaadjes in de herfst.",
            },
            {
                titel: "Lavendel",
                beschrijving: "Lavendel is een geurige plant die bijen aantrekt door zijn geur en lange bloeiperiode. Perfect voor zonnige tuinen.",
            },
            {
                titel: "Klaproos",
                beschrijving: "Deze felrode bloemen zijn een nectarbron voor wilde bijen en geven kleur aan bermen en tuinen.",
            },
            {
                titel: "Wilde Marjolein",
                beschrijving: "Ook wel oregano genoemd. Deze plant bloeit lang en trekt een verscheidenheid aan bestuivers aan.",
            },
        ],
    };

    const [expanded, setExpanded] = useState(null);

    const toggleExpand = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* HeaderBar met logo + gele rand */}
            <HeaderBar />

            {/* Terugknop */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={28} color="#444" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>{categorie}</Text>
                <Text style={styles.description}>{data.hoofdInformatie}</Text>

                <View style={styles.accordionContainer}>
                    {data.subInformatie.map((item, index) => (
                        <View key={index} style={styles.accordionItem}>
                            <TouchableOpacity
                                style={styles.accordionHeader}
                                onPress={() => toggleExpand(index)}
                            >
                                <Text style={styles.accordionTitle}>{item.titel}</Text>
                                <MaterialIcons
                                    name={expanded === index ? 'expand-less' : 'expand-more'}
                                    size={24}
                                    color="#444"
                                />
                            </TouchableOpacity>
                            {expanded === index && (
                                <View style={styles.accordionContent}>
                                    <Text>{item.beschrijving}</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* Navigatiebalk onderaan */}
            <AppNavigator />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#fff',
    },
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        color: '#222',
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
        color: '#333',
        lineHeight: 22,
    },
    accordionContainer: {
        marginTop: 10,
    },
    accordionItem: {
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        overflow: 'hidden',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#f8f8f8',
    },
    accordionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    accordionContent: {
        padding: 12,
        backgroundColor: '#fff',
    },
});
