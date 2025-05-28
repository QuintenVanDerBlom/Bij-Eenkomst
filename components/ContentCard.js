import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ContentCard({ title, content }) {
    return (
        <View style={styles.card}>
            {title && <Text style={styles.title}>{title}</Text>}
            <Text style={styles.content}>{content}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginVertical: 10,
        padding: 20,
        backgroundColor: '#fefefe',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3, // voor Android
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    content: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
    },
});
