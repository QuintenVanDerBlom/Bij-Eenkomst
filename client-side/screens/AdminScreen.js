import React from 'react';
import {
    ScrollView,
    View,
    StyleSheet,
    SafeAreaView,
    Text,
    TouchableOpacity, TextInput,
} from 'react-native';
import CategoryButton from '../components/CategoryCard';
import AppNavigator from '../navigation/AppNavigator';
import Searchbar from '../components/SearchBar';
import HeaderBar from '../navigation/HeaderBar';
import {useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@expo/vector-icons';

export default function AdminScreen() {
    const navigation = useNavigation();

    return (
        <>
            <SafeAreaView style={{flex: 1}}>
                <HeaderBar/>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={28} color="#444" />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.container}>

                </ScrollView>

            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({});