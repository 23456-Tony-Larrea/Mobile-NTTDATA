import axios from "axios";

interface ApiError {
  property: string;
  constraints: { [key: string]: string };
}

export const handleApiErrors = (error: unknown): { [key: string]: string } => {
  const newErrors: { [key: string]: string } = {};

  if (
    axios.isAxiosError(error) &&
    error.response &&
    error.response.data &&
    error.response.data.errors
  ) {
    const apiErrors: ApiError[] = error.response.data.errors;
    apiErrors.forEach((err: ApiError) => {
      const constraintKey = Object.keys(err.constraints)[0];
      const translatedMessage = translateErrorMessage(
        err.constraints[constraintKey]
      );
      newErrors[err.property] = translatedMessage;
    });
  } else {
    newErrors.general =
      "Ocurrió un error inesperado. Por favor, inténtelo de nuevo.";
  }

  return newErrors;
};

const translateErrorMessage = (message: string): string => {
  const translations: { [key: string]: string } = {
    "id must be longer than or equal to 3 characters":
      "El ID debe tener al menos 3 caracteres.",
    "id must be shorter than or equal to 10 characters":
      "El ID debe tener como máximo 10 caracteres.",
    "id already exists": "El ID ya existe.",
    "name must be longer than or equal to 5 characters":
      "El nombre debe tener al menos 5 caracteres.",
    "name must be shorter than or equal to 100 characters":
      "El nombre debe tener como máximo 100 caracteres.",
    "description must be longer than or equal to 10 characters":
      "La descripción debe tener al menos 10 caracteres.",
    "description must be shorter than or equal to 200 characters":
      "La descripción debe tener como máximo 200 caracteres.",
    "logo is required": "El logo es requerido.",
    "date_release must be equal or greater than today":
      "La fecha de liberación debe ser igual o mayor a la fecha actual.",
    "date_revision must be exactly one year after date_release":
      "La fecha de revisión debe ser exactamente un año posterior a la fecha de liberación.",
  };

  return translations[message] || message;
};
