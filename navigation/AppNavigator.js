import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

export default function AppNavigator() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Icon name="home" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Category')}>
                <Icon name="info" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Map')}>
                <Icon name="map-pin" size={24} color="#000" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFD700',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        zIndex: 999,
    },
});
