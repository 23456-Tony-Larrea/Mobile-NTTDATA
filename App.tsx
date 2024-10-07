import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HolaMundo1Screen from './src/views/BancoApp';
import HolaMundo2Screen from './src/views/RegistrationForm';
import { RootStackParamList } from './src/url/types';
import ProductDetailScreen from './src/views/ProductDetailScreen';
import EditProductForm from './src/views/EditProductForm';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Lista de productos" component={HolaMundo1Screen} />
        <Stack.Screen name="Formulario de Registro" component={HolaMundo2Screen} />
        <Stack.Screen name="Detalles del Producto" component={ ProductDetailScreen} />
        <Stack.Screen name="Editar Producto" component={EditProductForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}