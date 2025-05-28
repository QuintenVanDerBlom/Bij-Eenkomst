import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BeeFactCard({ fact, description }) {
    return (
        <View style={styles.card}>
            <Text style={styles.factTitle}>Bijenfeitje:</Text>
            <Text style={styles.fact}>{fact}</Text>
            <Text style={styles.description}>{description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 16,
        padding: 16,
        backgroundColor: '#FFF9C4', // Light yellow
        borderRadius: 8,
    },
    factTitle: { fontWeight: 'bold', marginBottom: 8 },
    fact: { fontSize: 16, marginBottom: 8 },
    description: { color: '#666' },
});