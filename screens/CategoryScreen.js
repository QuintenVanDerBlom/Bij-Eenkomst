import React from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    SafeAreaView,
    Text,
    TouchableOpacity,
} from 'react-native';
import FruitButton from '../components/FruitButton';
import AppNavigator from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function CategoryScreen({ username = 'Marijn', content = 'Geen info beschikbaar' }) {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.container}>

                {/* Terugknop linksboven */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={28} color="#444" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.subtitle}>Kies je categorie</Text>

                <View style={styles.buttonRow}>
                    <FruitButton />
                </View>
            </ScrollView>

            <AppNavigator />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        paddingBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 8,
        color: '#444',
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
});
