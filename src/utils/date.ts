export function formatDateForApi(dateString: string): string {
  if (!dateString) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;

  const parts = dateString.split('.');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateString;
}

export function formatDateMask(value: string): string {
  const digits = value.replace(/\D/g, '');
  const limitedDigits = digits.slice(0, 8);

  let formatted = '';
  for (let i = 0; i < limitedDigits.length; i++) {
    if (i === 2 || i === 4) {
      formatted += '.';
    }
    formatted += limitedDigits[i];
  }
  return formatted;
}

export function formatDateDisplay(dateString: string | number | Date | null | undefined): string {
  if (!dateString) return 'неизвестно';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatApiDateForInput(dateString: string | null | undefined): string {
  if (!dateString) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [y, m, d] = dateString.split('-');
    return `${d}.${m}.${y}`;
  }
  return dateString;
}
