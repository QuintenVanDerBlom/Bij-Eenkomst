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

export default function BlogScreen() {

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <HeaderBar />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Blog</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>


            </ScrollView>

            <AppNavigator />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
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
        textAlign: 'center'
    },
    content: {
        padding: 20,
        flexDirection: "column",
        alignItems: 'center',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
