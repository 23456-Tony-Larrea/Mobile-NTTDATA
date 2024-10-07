import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { UpdateProductAction } from '../actions/ProductActions';
import { Product } from '../models/Product';
import { handleApiErrors } from '../utils/errorHandler';
import { validateDates } from '../utils/validators';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../url/types';

type EditProductFormRouteProp = RouteProp<RootStackParamList, 'Editar Producto'>;

export default function EditProductForm() {
  const route = useRoute<EditProductFormRouteProp>();
  const { product } = route.params;

  const [id, setId] = useState(product.id);
  const [name, setName] = useState(product.name);
  const [creditCard, setCreditCard] = useState('');
  const [description, setDescription] = useState(product.description);
  const [logo, setLogo] = useState(product.logo);
  const [releaseDate, setReleaseDate] = useState(product.date_release);
  const [reviewDate, setReviewDate] = useState(product.date_revision);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async () => {
    const productData: Product = {
      id,
      name,
      description,
      logo,
      date_release: releaseDate,
      date_revision: reviewDate,
    };

    const dateErrors = validateDates(releaseDate, reviewDate);
    if (Object.keys(dateErrors).length > 0) {
      setErrors(dateErrors);
      return;
    }

    try {
      const response = await UpdateProductAction(productData);
      setErrors({});
    } catch (error) {
      console.error('Error updating product:', error);
      setErrors(handleApiErrors(error));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>ID</Text>
      <TextInput
        style={styles.input}
        value={id}
        onChangeText={setId}
        placeholder="ID no válido"
        placeholderTextColor="#FF0000"
      />
      {errors.id && <Text style={styles.errorText}>{errors.id}</Text>}
      
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Nombre"
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      
      
      
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Este campo es requerido!"
        placeholderTextColor="#FF0000"
        multiline
      />
      {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      
      <Text style={styles.label}>Logo</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={logo}
        onChangeText={setLogo}
        placeholder="Este campo es requerido!"
        placeholderTextColor="#FF0000"
        multiline
      />
      {errors.logo && <Text style={styles.errorText}>{errors.logo}</Text>}
      
      <Text style={styles.label}>Fecha Liberación</Text>
      <TextInput
        style={styles.input}
        value={releaseDate}
        onChangeText={setReleaseDate}
        placeholder="Fecha Liberación"
        editable={false}
      />
      {errors.date_release && <Text style={styles.errorText}>{errors.date_release}</Text>}
      
      <Text style={styles.label}>Fecha Revisión</Text>
      <TextInput
        style={styles.input}
        value={reviewDate}
        onChangeText={setReviewDate}
        placeholder="Fecha Revisión"
        editable={false}
      />
      {errors.date_revision && <Text style={styles.errorText}>{errors.date_revision}</Text>}
      
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Actualizar</Text>
      </TouchableOpacity>
      
      {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FFEB3B',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF0000',
    marginBottom: 10,
  },
});