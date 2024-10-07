import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { CreateProductAction } from '../actions/ProductActions';
import { Product } from '../models/Product';
import { handleApiErrors } from '../utils/errorHandler';
import { validateDates } from '../utils/validators';

export default function RegistrationForm() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [creditCard, setCreditCard] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [releaseDate, setReleaseDate] = useState('2025-01-01');
  const [reviewDate, setReviewDate] = useState('2025-01-01');
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
      const response = await CreateProductAction(productData);
      setErrors({});
    } catch (error) {
      console.error('Error creating product:', error);
      setErrors(handleApiErrors(error));
    }
  };

  const handleReset = () => {
    
    setId('');
    setName('');
    setCreditCard('');
    setDescription('');
    setLogo('');
    setReleaseDate('2025-01-01');
    setReviewDate('2025-01-01');
    setErrors({});
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
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>Reiniciar</Text>
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
  resetButton: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButtonText: {
    color: '#000000',
    fontSize: 16,
  },
  errorText: {
    color: '#FF0000',
    marginBottom: 10,
  },
});