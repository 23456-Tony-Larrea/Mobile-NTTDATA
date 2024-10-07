import { Product } from "../models/Product";

export type RootStackParamList = {
  "Lista de productos": undefined;
  "Formulario de Registro": undefined;
  "Detalles del Producto": { product: Product };
  "Editar Producto": { product: Product };
};
