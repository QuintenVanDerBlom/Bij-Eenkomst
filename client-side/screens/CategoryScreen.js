import React from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    Text,
    TouchableOpacity, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoryButton from '../components/CategoryCard';
import AppNavigator from '../navigation/AppNavigator';
import Searchbar from '../components/SearchBar';
import HeaderBar from '../navigation/HeaderBar';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function CategoryScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Headerbar bovenaan */}
            <HeaderBar />

            {/* Searchbar Component */}
            <Searchbar />

            {/* Category cards */}
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.subtitle}>Kies je categorie</Text>

                <View style={styles.buttonRow}>
                    <CategoryButton />
                </View>
            </ScrollView>

            {/* Navigatie bar */}
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
        paddingTop: 10,
        paddingLeft: 10,
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
