import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../url/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { DeleteProductAction } from "../actions/ProductActions";

type ProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "Detalles del Producto"
>;
type ProductDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Detalles del Producto"
>;

export default function ProductDetailScreen() {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const navigation = useNavigation<ProductDetailScreenNavigationProp>();
  const { product } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async () => {
    try {
      await DeleteProductAction(product.id);
      setModalVisible(false);
      Alert.alert("Éxito", "Producto eliminado con éxito");
      navigation.goBack();
    } catch (error) {
      console.error("Error eliminando producto:", error);
      Alert.alert("Error", "Hubo un error al eliminar el producto");
    }
  };

  if (loading) {
    return (
      <SkeletonPlaceholder>
        <View style={styles.card}>
          <View style={styles.skeletonHeader} />
          <View style={styles.skeletonContent} />
          <View style={styles.skeletonContent} />
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonContent} />
          <View style={styles.skeletonContent} />
          <View style={styles.skeletonFooter} />
        </View>
      </SkeletonPlaceholder>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>ID: {product.id}</Text>
        <Text style={styles.textMuted}>Información extra</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nombre</Text>
          <Text>{product.name}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text>{product.description}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logo</Text>
          <Image
            source={{
              uri: "https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg",
            }}
            style={styles.logo}
            alt="Logo del producto"
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fecha liberación</Text>
          <Text>{product.date_release}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fecha revisión</Text>
          <Text>{product.date_revision}</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={() => navigation.navigate("Editar Producto", { product })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.buttonDestructive]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              ¿Estás seguro que quieres eliminar el producto "{product.name}"?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonOutline]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonDestructive]}
                onPress={handleDelete}
              >
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 400,
    marginHorizontal: "auto",
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    padding: 16,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  textMuted: {
    fontSize: 14,
    color: "#6c757d",
  },
  cardContent: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  logo: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonDestructive: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  skeletonHeader: {
    width: "100%",
    height: 20,
    borderRadius: 4,
    marginBottom: 16,
  },
  skeletonContent: {
    width: "100%",
    height: 20,
    borderRadius: 4,
    marginBottom: 16,
  },
  skeletonImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 16,
  },
  skeletonFooter: {
    width: "100%",
    height: 50,
    borderRadius: 4,
    marginBottom: 16,
  },
});