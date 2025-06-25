// services/LikedLocationsService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../firebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';

class LikedLocationsService {
    // Get the storage key for a specific user's favorites (keep for favorites)
    getUserFavoritesKey(userId) {
        return `@favorite_locations_${userId}`;
    }

    // DATABASE LIKES METHODS
    async isLocationLiked(userId, locationId) {
        try {
            if (!userId || !locationId) return false;

            const locationRef = doc(db, 'locations', locationId);
            const locationDoc = await getDoc(locationRef);

            if (locationDoc.exists()) {
                const data = locationDoc.data();

                // Ensure likes field exists and is an array
                if (!data.likes) {
                    // Initialize likes field as empty array
                    await updateDoc(locationRef, {
                        likes: []
                    });
                    return false;
                }

                // Check if likes is an array
                if (!Array.isArray(data.likes)) {
                    console.warn('Likes field is not an array, fixing...', data.likes);
                    // Fix the likes field by converting to array or initializing
                    await updateDoc(locationRef, {
                        likes: []
                    });
                    return false;
                }

                return data.likes.includes(userId);
            }

            return false;
        } catch (error) {
            console.error('Error checking if location is liked:', error);
            return false;
        }
    }

    async likeLocation(userId, locationId) {
        try {
            if (!userId || !locationId) return false;

            const locationRef = doc(db, 'locations', locationId);
            const locationDoc = await getDoc(locationRef);

            if (locationDoc.exists()) {
                const data = locationDoc.data();

                // Initialize or fix likes field if needed
                if (!data.likes || !Array.isArray(data.likes)) {
                    await updateDoc(locationRef, {
                        likes: [userId] // Initialize with current user
                    });
                    return true;
                }

                // Check if already liked
                if (data.likes.includes(userId)) {
                    return false; // Already liked
                }

                // Add user to likes array
                await updateDoc(locationRef, {
                    likes: arrayUnion(userId)
                });

                return true;
            } else {
                // Document doesn't exist, this shouldn't happen but handle it
                console.warn('Location document does not exist:', locationId);
                return false;
            }
        } catch (error) {
            console.error('Error liking location:', error);
            return false;
        }
    }

    async unlikeLocation(userId, locationId) {
        try {
            if (!userId || !locationId) return false;

            const locationRef = doc(db, 'locations', locationId);
            const locationDoc = await getDoc(locationRef);

            if (locationDoc.exists()) {
                const data = locationDoc.data();

                // Initialize likes field if it doesn't exist
                if (!data.likes || !Array.isArray(data.likes)) {
                    await updateDoc(locationRef, {
                        likes: []
                    });
                    return false; // Can't unlike if it wasn't liked
                }

                // Remove user from likes array
                await updateDoc(locationRef, {
                    likes: arrayRemove(userId)
                });

                return true;
            }

            return false;
        } catch (error) {
            console.error('Error unliking location:', error);
            return false;
        }
    }

    async toggleLikeLocation(userId, locationId) {
        try {
            const isLiked = await this.isLocationLiked(userId, locationId);

            if (isLiked) {
                await this.unlikeLocation(userId, locationId);
                return false; // Now unliked
            } else {
                await this.likeLocation(userId, locationId);
                return true; // Now liked
            }
        } catch (error) {
            console.error('Error toggling like status:', error);
            return false;
        }
    }

    async getLikesCount(locationId) {
        try {
            if (!locationId) return 0;

            const locationRef = doc(db, 'locations', locationId);
            const locationDoc = await getDoc(locationRef);

            if (locationDoc.exists()) {
                const data = locationDoc.data();

                // Initialize likes field if it doesn't exist
                if (!data.likes) {
                    await updateDoc(locationRef, {
                        likes: []
                    });
                    return 0;
                }

                // Ensure likes is an array before getting length
                if (Array.isArray(data.likes)) {
                    return data.likes.length;
                } else {
                    console.warn('Likes field is not an array, fixing...', data.likes);
                    // Fix the likes field
                    await updateDoc(locationRef, {
                        likes: []
                    });
                    return 0;
                }
            }

            return 0;
        } catch (error) {
            console.error('Error getting likes count:', error);
            return 0;
        }
    }

    // FAVORITE LOCATIONS METHODS (AsyncStorage)
    async getFavoriteLocations(userId) {
        try {
            if (!userId) return [];

            const key = this.getUserFavoritesKey(userId);
            const favoriteLocations = await AsyncStorage.getItem(key);

            return favoriteLocations ? JSON.parse(favoriteLocations) : [];
        } catch (error) {
            console.error('Error getting favorite locations:', error);
            return [];
        }
    }

    async isLocationFavorited(userId, locationId) {
        try {
            const favoriteLocations = await this.getFavoriteLocations(userId);

            // Ensure favoriteLocations is an array
            if (!Array.isArray(favoriteLocations)) {
                return false;
            }

            return favoriteLocations.includes(locationId);
        } catch (error) {
            console.error('Error checking if location is favorited:', error);
            return false;
        }
    }

    async favoriteLocation(userId, locationId) {
        try {
            if (!userId || !locationId) return false;

            const favoriteLocations = await this.getFavoriteLocations(userId);

            // Ensure it's an array
            const favArray = Array.isArray(favoriteLocations) ? favoriteLocations : [];

            if (!favArray.includes(locationId)) {
                favArray.push(locationId);
                const key = this.getUserFavoritesKey(userId);
                await AsyncStorage.setItem(key, JSON.stringify(favArray));
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error favoriting location:', error);
            return false;
        }
    }

    async unfavoriteLocation(userId, locationId) {
        try {
            if (!userId || !locationId) return false;

            const favoriteLocations = await this.getFavoriteLocations(userId);

            // Ensure it's an array
            const favArray = Array.isArray(favoriteLocations) ? favoriteLocations : [];

            const updatedFavoriteLocations = favArray.filter(id => id !== locationId);

            if (updatedFavoriteLocations.length !== favArray.length) {
                const key = this.getUserFavoritesKey(userId);
                await AsyncStorage.setItem(key, JSON.stringify(updatedFavoriteLocations));
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error unfavoriting location:', error);
            return false;
        }
    }

    async toggleFavoriteLocation(userId, locationId) {
        try {
            const isFavorited = await this.isLocationFavorited(userId, locationId);

            if (isFavorited) {
                await this.unfavoriteLocation(userId, locationId);
                return false;
            } else {
                await this.favoriteLocation(userId, locationId);
                return true;
            }
        } catch (error) {
            console.error('Error toggling favorite status:', error);
            return false;
        }
    }

    // UTILITY METHODS
    async initializeLikesField(locationId) {
        try {
            if (!locationId) return false;

            const locationRef = doc(db, 'locations', locationId);
            await updateDoc(locationRef, {
                likes: []
            });

            return true;
        } catch (error) {
            console.error('Error initializing likes field:', error);
            return false;
        }
    }

    // Fix all locations that don't have proper likes field
    async fixAllLocationsLikesField() {
        try {
            const { collection, getDocs } = await import('firebase/firestore');
            const querySnapshot = await getDocs(collection(db, 'locations'));

            let fixedCount = 0;

            for (const docSnapshot of querySnapshot.docs) {
                const data = docSnapshot.data();

                // If likes field doesn't exist or isn't an array, fix it
                if (!data.likes || !Array.isArray(data.likes)) {
                    await updateDoc(doc(db, 'locations', docSnapshot.id), {
                        likes: []
                    });
                    fixedCount++;
                    console.log(`Fixed likes field for document: ${docSnapshot.id}`);
                }
            }

            console.log(`Fixed ${fixedCount} location documents`);
            return fixedCount;
        } catch (error) {
            console.error('Error fixing all locations likes field:', error);
            return 0;
        }
    }

    // CLEANUP METHODS
    async clearUserFavoriteLocations(userId) {
        try {
            if (!userId) return;

            const key = this.getUserFavoritesKey(userId);
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('Error clearing favorite locations:', error);
        }
    }
}

export default new LikedLocationsService();
