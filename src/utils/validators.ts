// src/utils/validators.ts
export const validateDates = (releaseDate: string, revisionDate: string): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};
  
    const release = new Date(releaseDate);
    const revision = new Date(revisionDate);
  
    if (isNaN(release.getTime())) {
      errors.date_release = 'La fecha de liberación no es válida.';
    }
  
    if (isNaN(revision.getTime())) {
      errors.date_revision = 'La fecha de revisión no es válida.';
    }
  
    if (release >= revision) {
      errors.date_revision = 'La fecha de revisión debe ser posterior a la fecha de liberación.';
    }
  
    return errors;
  };