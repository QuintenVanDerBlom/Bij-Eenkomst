import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import MapScreen from './screens/MapScreen';
import InfoScreen from "./screens/InfoScreen";
import LoginScreen from "./screens/LoginScreen";
import SubInfoScreen from "./screens/SubInfoScreen";
// import AdminScreen from "./screens/AdminScreen";
import TestMarijn from "./screens/TestMarijn";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Category" component={CategoryScreen} />
                <Stack.Screen name="InfoScreen" component={InfoScreen} />
                <Stack.Screen name="Map" component={MapScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SubInfo" component={SubInfoScreen} options={{ title: 'Meer Informatie' }} />
                {/*<Stack.Screen name="Admin" component={AdminScreen} />*/}
                <Stack.Screen name="TestMarijn" component={TestMarijn} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
