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

    // Uitgebreide dummy data met extraDetails toegevoegd
    const data = {
        hoofdInformatie: `Informatie over ${categorie}. Deze categorie richt zich op planten die bijdragen aan de leefomgeving van bijen en vlinders.`,
        subInformatie: [
            {
                titel: "Zonnebloem",
                imageKey: "sunflower",
                beschrijving: "Zonnebloemen bloeien in de zomer en bevatten veel nectar. Ze zijn ideaal voor bijen en zorgen ook voor mooie zaadjes in de herfst.",
                insects: [
                    "bee"
                ],
                extraDetails: "Zonnebloemen kunnen tot wel 3 meter hoog worden en trekken vele verschillende soorten bijen en vogels aan. Ze zijn ook belangrijk voor landbouw als gewas.",
            },
            {
                titel: "Lavendel",
                imageKey: "lavender",
                insects: [
                    "bee"
                ],
                beschrijving: "Lavendel is een geurige plant die bijen aantrekt door zijn geur en lange bloeiperiode. Perfect voor zonnige tuinen.",
                extraDetails: "Lavendel wordt ook veel gebruikt voor etherische oliën en aromatherapie. De plant bloeit meestal van juni tot augustus.",
            },
            {
                titel: "Klaproos",
                imageKey: "rose",
                insects: [
                    "bee"
                ],
                beschrijving: "Deze felrode bloemen zijn een nectarbron voor wilde bijen en geven kleur aan bermen en tuinen.",
                extraDetails: "Klaprozen zijn vaak te vinden in wilde velden en staan symbool voor rust en vrede. Ze zijn ook belangrijk voor de biodiversiteit.",
            },
            {
                titel: "Wilde Marjolein",
                imageKey: "marjoram",
                insects: [
                    "bee",
                    "butterfly"
                ],
                beschrijving: "Ook wel oregano genoemd. Deze plant bloeit lang en trekt een verscheidenheid aan bestuivers aan.",
                extraDetails: "Wilde Marjolein wordt ook gebruikt in de keuken en als medicinale plant. De bloemen hebben een zachte geur die insecten aantrekt.",
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
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate('SubInfo', {
                                            titel: item.titel,
                                            imageKey: item.imageKey,
                                            beschrijving: item.beschrijving,
                                            insects: item.insects,
                                            extraDetails: item.extraDetails,
                                        })}
                                    >
                                        <Text style={styles.moreInfoLink}>Meer info ➔</Text>
                                    </TouchableOpacity>
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
    moreInfoLink: {
        marginTop: 10,
        color: '#007BFF',
        fontWeight: '600',
    },
});
