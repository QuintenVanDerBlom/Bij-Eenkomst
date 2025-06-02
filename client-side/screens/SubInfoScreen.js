import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderBar from '../navigation/HeaderBar';
import AppNavigator from '../navigation/AppNavigator';

export default function SubDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { titel, beschrijving, extraDetails } = route.params;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* HeaderBar met logo + gele rand */}
            <HeaderBar />

            {/* Eigen header met terugknop en titel */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={28} color="#444" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{titel}</Text>
            </View>

            {/* Scrollbare content */}
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>Beschrijving:</Text>
                <Text style={styles.text}>{beschrijving}</Text>

                <Text style={styles.label}>Extra informatie:</Text>
                <Text style={styles.text}>{extraDetails}</Text>
            </ScrollView>

            {/* Navigatiebalk onderaan */}
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
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        color: '#444',
    },
    text: {
        fontSize: 15,
        lineHeight: 22,
        color: '#333',
        marginTop: 4,
    },
});
