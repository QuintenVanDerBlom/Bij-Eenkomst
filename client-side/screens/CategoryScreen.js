import React, {useContext} from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CategoryButton from '../components/CategoryCard';
import AppNavigator from '../navigation/AppNavigator';
import Searchbar from '../components/SearchBar';
import HeaderBar from '../navigation/HeaderBar';
import {DarkModeContext} from "../Contexts/DarkModeContext";

export default function CategoryScreen() {
    const { isDarkMode } = useContext(DarkModeContext);
    const styles = getStyles(isDarkMode);

    return (
        <SafeAreaView style={styles.container}>
                {/* Headerbar bovenaan */}
                <HeaderBar />
            <View style={styles.container}>

                {/* Searchbar Component */}
                <Searchbar />

                {/* Category cards */}
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <Text style={styles.subtitle}>Kies je categorie</Text>

                    <View style={styles.buttonRow}>
                        <CategoryButton />
                    </View>
                </ScrollView>

                {/* Navigatie bar */}
            </View>
            <AppNavigator />
        </SafeAreaView>
    );
}

const getStyles = (isDarkMode) => StyleSheet.create({
    container: {
        backgroundColor: isDarkMode ? '#444' : '#fff',
        flex: 1
    },
    scrollView: {
        padding: 16,
        paddingBottom: 100,
        backgroundColor: isDarkMode ? '#444' : '#fff',
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
        color: isDarkMode ? '#fff' : '#444',
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
});
