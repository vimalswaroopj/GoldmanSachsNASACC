import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Favourites } from './src/screens/Favourites';
import { Home } from './src/screens/Home';
import { ShowImage } from './src/screens/ShowImage';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default function App() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const StackNavigation = () => (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={Home} options={{
        headerShown: false
      }}></Stack.Screen>
      <Stack.Screen name='POD' component={ShowImage}
        options={{
          headerTitle: 'Picture of the day'
        }}></Stack.Screen>
    </Stack.Navigator>

  )

  const TabNavigation = () => (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='APOD'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'APOD') {
              iconName = focused
                ? 'globe'
                : 'globe-outline';
            } else if (route.name === 'Favourites') {
              iconName = focused ? 'heart' : 'heart-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="APOD" component={StackNavigation} options={{
          headerShown: false
        }} />
        <Tab.Screen name="Favourites" component={Favourites} />
      </Tab.Navigator>
    </NavigationContainer>
  )
  return (
    <TabNavigation />
  );
}
