import React, {useContext, useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import HeaderBar from '../navigation/HeaderBar';
import AppNavigator from '../navigation/AppNavigator';
import { db } from "../firebaseConfig";
import {collection, query, where, getDoc, doc, getDocs, orderBy} from "firebase/firestore";
import {DarkModeContext} from "../Contexts/DarkModeContext";
import { useAuth } from '../auth/AuthContext';

export default function BlogScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { userData } = useAuth();

    const [posts, setPosts] = useState([]);
    const [expandedPosts, setExpandedPosts] = useState({});
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useContext(DarkModeContext);
    const styles = getStyles(isDarkMode);

    useEffect(() => {
        const loadData = async () => {
            try {
                const postsQuery = query(
                    collection(db, 'blogposts'),
                    orderBy('created_at', 'desc')
                );
                const postsSnapshot = await getDocs(postsQuery);

                const postsData = await Promise.all(
                    postsSnapshot.docs.map(async (docSnap) => {
                        const post = { id: docSnap.id, ...docSnap.data() };
                        let username = 'Unknown';

                        if (post.user_id) {
                            try {
                                const userDoc = await getDoc(doc(db, 'users', post.user_id));
                                if (userDoc.exists()) {
                                    username = userDoc.data().full_name || 'Unknown';
                                }
                            } catch (e) {
                                console.warn("Failed to fetch user:", e);
                            }
                        }
                        return { ...post, username };
                    })
                );

                setPosts(postsData);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);


    const toggleExpand = (id) => {
        setExpandedPosts(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#ffdd00" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <HeaderBar />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Blog</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {posts.map((post) => {
                    const isExpanded = expandedPosts[post.id];
                    const shouldTruncate = post.content.length > 150;
                    const displayedText = isExpanded || !shouldTruncate
                        ? post.content
                        : post.content.slice(0, 100) + '...';

                    return (
                        <View key={post.id} style={styles.postContainer}>
                            <Text style={styles.postTitle}>{post.title}</Text>
                            <Text style={styles.postAuthor}>By {post.username}</Text>

                            {post.images?.length > 0 && post.images.map((imageUrl, index) => (
                                <Image
                                    key={index}
                                    source={{ uri: imageUrl }}
                                    style={styles.postImage}
                                    resizeMode="cover"
                                />
                            ))}

                            <Text style={styles.postContent}>{displayedText}</Text>

                            {shouldTruncate && (
                                <TouchableOpacity onPress={() => toggleExpand(post.id)}>
                                    <Text style={styles.expandText}>
                                        {isExpanded ? 'Show less' : 'Read more'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}
            </ScrollView>

            {userData && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('MakeBlogPost')}
                >
                    <MaterialIcons name="add" size={28} color="#fff" />
                </TouchableOpacity>
            )}

            <AppNavigator />
        </SafeAreaView>
    );
}

export const getStyles = (isDarkMode) => StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: isDarkMode? "#333": "#fff"
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: isDarkMode? '#444' : '#ddd',
        backgroundColor: isDarkMode? '#1a1a1a' : '#fff',
    },
    backButton: {
        paddingRight: 12,
        paddingVertical: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: isDarkMode? '#fff' : '#222',
        textAlign: 'center',
    },
    content: {
        padding: 20,
        paddingBottom: 100,
        marginBottom: 50,
        flexDirection: "column",
        alignItems: 'center',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postContainer: {
        marginBottom: 20,
        width: '100%',
        backgroundColor: isDarkMode? '#2a2a2a' : '#f9f9f9',
        borderRadius: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: isDarkMode? '#fff' : '#000',
        marginTop: 10,
    },
    postContent: {
        fontSize: 14,
        color: isDarkMode? '#ccc' : '#555',
        marginTop: 4,
    },
    expandText: {
        color: isDarkMode? '#cba3de' : '#785C82',
        marginTop: 5,
        fontWeight: '600',
    },
    postAuthor: {
        fontSize: 12,
        fontStyle: 'italic',
        color: isDarkMode? '#aaa' : '#666',
        marginTop: 2,
    },
    postImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 10
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 90,
        backgroundColor: '#785C82',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
});