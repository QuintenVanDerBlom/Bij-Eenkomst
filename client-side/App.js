import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import MapScreen from './screens/MapScreen';
import InfoScreen from "./screens/InfoScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import { AuthProvider } from './auth/AuthContext';
import SubInfoScreen from "./screens/SubInfoScreen";
import LocationsListScreen from "./screens/LocationsListScreen";
import LocationDetailScreen from "./screens/LocationDetailScreen";
import ProfileScreen from "./screens/ProfileScreen";
// import AdminScreen from "./screens/AdminScreen";
import TestMarijn from "./screens/TestMarijn";
import BlogScreen from "./screens/BlogScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Category" component={CategoryScreen} />
                    <Stack.Screen name="InfoScreen" component={InfoScreen} />
                    <Stack.Screen name="Map" component={MapScreen} />
                    <Stack.Screen name={"Blog"} component={BlogScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                    <Stack.Screen name="SubInfo" component={SubInfoScreen} options={{ title: 'Meer Informatie' }} />
                    <Stack.Screen name="LocationsList" component={LocationsListScreen} />
                    <Stack.Screen name="LocationDetail" component={LocationDetailScreen} />
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                    {/*<Stack.Screen name="Admin" component={AdminScreen} />*/}
                    <Stack.Screen name="TestMarijn" component={TestMarijn} />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
}
