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

  const oneYearLater = new Date(release);
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

  if (revision.getTime() !== oneYearLater.getTime()) {
    errors.date_revision = 'La fecha de revisión debe ser exactamente un año posterior a la fecha de liberación.';
  }

  return errors;
};