import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { UpdateProductAction, verifyIdExists } from '../actions/ProductActions';
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
  const [description, setDescription] = useState(product.description);
  const [logo, setLogo] = useState(product.logo);
  const [releaseDate, setReleaseDate] = useState(new Date(product.date_release));
  const [reviewDate, setReviewDate] = useState(new Date(product.date_revision));
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showReleaseDatePicker, setShowReleaseDatePicker] = useState(false);
  const [showReviewDatePicker, setShowReviewDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setId(product.id);
        setName(product.name);
        setDescription(product.description);
        setLogo(product.logo);
        setReleaseDate(new Date(product.date_release));
        setReviewDate(new Date(product.date_revision));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [product]);

  const handleSubmit = async () => {
    const idExists = await verifyIdExists(id);
    if (idExists && id !== product.id) {
      setErrors({ id: 'ID no válido, ya existe el ID' });
      return;
    }

    const releaseDateString = releaseDate.toISOString().split('T')[0];
    const reviewDateString = reviewDate.toISOString().split('T')[0];

    const productData: Product = {
      id,
      name,
      description,
      logo,
      date_release: releaseDateString,
      date_revision: reviewDateString,
    };

    const dateErrors = validateDates(releaseDateString, reviewDateString);
    if (Object.keys(dateErrors).length > 0) {
      setErrors(dateErrors);
      return;
    }

    try {
      const response = await UpdateProductAction(productData);
      setErrors({});
      Alert.alert("Éxito", "Producto actualizado con éxito");
    } catch (error) {
      console.error('Error updating product:', error);
      setErrors(handleApiErrors(error));
      Alert.alert("Error", "Hubo un error al actualizar el producto");
    }
  };

  if (loading) {
    return (
      <SkeletonPlaceholder>
        <View style={styles.container}>
          <View style={styles.skeletonInput} />
          <View style={styles.skeletonInput} />
          <View style={styles.skeletonTextArea} />
          <View style={styles.skeletonTextArea} />
          <View style={styles.skeletonDateText} />
          <View style={styles.skeletonDateText} />
          <View style={styles.skeletonButton} />
        </View>
      </SkeletonPlaceholder>
    );
  }

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
      <TouchableOpacity onPress={() => setShowReleaseDatePicker(true)}>
        <Text style={styles.dateText}>{releaseDate.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showReleaseDatePicker && (
        <DateTimePicker
          value={releaseDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowReleaseDatePicker(Platform.OS === 'ios');
            if (selectedDate) {
              setReleaseDate(selectedDate);
              setReviewDate(new Date(selectedDate.getFullYear() + 1, selectedDate.getMonth(), selectedDate.getDate()));
            }
          }}
        />
      )}
      {errors.date_release && <Text style={styles.errorText}>{errors.date_release}</Text>}
      
      <Text style={styles.label}>Fecha Revisión</Text>
      <TouchableOpacity onPress={() => setShowReviewDatePicker(true)}>
        <Text style={styles.dateText}>{reviewDate.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>
      {showReviewDatePicker && (
        <DateTimePicker
          value={reviewDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowReviewDatePicker(Platform.OS === 'ios');
            if (selectedDate) {
              setReviewDate(selectedDate);
            }
          }}
        />
      )}
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
  dateText: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: '#000000',
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
  skeletonInput: {
    width: '100%',
    height: 40,
    borderRadius: 5,
    marginBottom: 15,
  },
  skeletonTextArea: {
    width: '100%',
    height: 100,
    borderRadius: 5,
    marginBottom: 15,
  },
  skeletonDateText: {
    width: '100%',
    height: 40,
    borderRadius: 5,
    marginBottom: 15,
  },
  skeletonButton: {
    width: '100%',
    height: 50,
    borderRadius: 5,
    marginBottom: 15,
  },
});