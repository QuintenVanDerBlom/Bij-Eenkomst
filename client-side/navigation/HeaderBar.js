import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function HeaderBar() {
    return (
        <View style={styles.headerContainer}>
            <Image
                source={require('../assets/bee.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.headerText}>Bij eenkomst</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFD700', // Geel
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    logo: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    headerText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'black',
    },
});
