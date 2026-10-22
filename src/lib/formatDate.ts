export function formatIndonesianDate(dateString: string): string {
  try {
    const parts = dateString.split('T')[0].split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthNum = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);

      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];

      const monthName = months[monthNum - 1] || '';
      return `${day} ${monthName} ${year}`;
    }
    return dateString;
  } catch {
    return dateString;
  }
}

export function formatFullIndonesianDate(dateString: string): string {
  try {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const d = new Date(dateString);
    const dayName = days[d.getDay()] || 'Sabtu';
    const formatted = formatIndonesianDate(dateString);
    return `${dayName}, ${formatted}`;
  } catch {
    return dateString;
  }
}
