import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { GetProductsAction } from '../actions/ProductActions';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../url/types';
import { Product } from '../models/Product';

interface ItemProps {
  nombre: string;
  id: string;
  onPress: () => void;
}

const Item = ({ nombre, id, onPress }: ItemProps) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View>
      <Text style={styles.nombre}>{nombre}</Text>
      <Text style={styles.id}>ID: {id}</Text>
    </View>
    <Text style={styles.arrow}>{'>'}</Text>
  </TouchableOpacity>
);

export default function BancoApp() {
  const [data, setData] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<Product[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await GetProductsAction();
        setData(result);
        setFilteredData(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const renderItem = ({ item }: { item: Product }) => (
    <Item
      nombre={item.name}
      id={item.id}
      onPress={() => navigation.navigate('Detalles del Producto', { product: item })}
    />
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar..."
        placeholderTextColor="#999"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Formulario de Registro')}
      >
        <Text style={styles.addButtonText}>Agregar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingLeft: 10,
    margin: 10,
    borderRadius: 5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  nombre: {
    fontSize: 16,
  },
  id: {
    fontSize: 14,
    color: '#666',
  },
  arrow: {
    fontSize: 18,
    color: '#999',
  },
  addButton: {
    backgroundColor: 'yellow',
    padding: 15,
    alignItems: 'center',
    margin: 10,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});