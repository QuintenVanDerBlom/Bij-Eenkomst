import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import AppNavigator from '../navigation/AppNavigator'; // pas pad aan naar jouw navigator

export default function InfoScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { fruit, locationId } = route.params;

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Header met terugknop */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={28} color="#444" />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.container}>
                <Text style={styles.title}>Locatie voor: {fruit}</Text>
                <Text style={styles.subtitle}>Locatie ID: {locationId}</Text>
                {/* Hier kun je meer info ophalen uit een database bijvoorbeeld */}
            </View>

            {/* Navigator onderaan */}
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
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 18,
        marginTop: 10,
    },
});
