export function validateSessionDate(dateString: string): boolean {
  if (!dateString) return false;
  const selected = new Date(dateString).getTime();
  const now = Date.now();
  return selected > now;
}

export function validateSubjectLimit(subjects: any[]): boolean {
  return Array.isArray(subjects) && subjects.length <= 7;
}

export function formatRating(rating: number | string | null | undefined): string {
  if (rating === null || rating === undefined || rating === '') return '0.0';
  const num = Number(rating);
  if (isNaN(num)) return '0.0';
  return num.toFixed(1);
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}
