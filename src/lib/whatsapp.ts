/**
 * Build a wa.me link with an optional pre-filled message.
 * Phone should be in international format without + (e.g. "525512345678").
 */
export function buildWhatsAppLink(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const base = `https://wa.me/${cleaned}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/**
 * Format a booking-confirmation message in Spanish (MX market).
 */
export function formatBookingConfirmation(params: {
  clientName: string;
  serviceName: string;
  barberName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}): string {
  const { clientName, serviceName, barberName, date, time } = params;
  const nice = new Date(date + 'T12:00:00').toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return [
    `Hola, soy ${clientName}.`,
    '',
    `Acabo de reservar una cita:`,
    `• Servicio: ${serviceName}`,
    `• Barbero: ${barberName}`,
    `• Fecha: ${nice}`,
    `• Hora: ${time}`,
    '',
    '¿Pueden confirmarme por aquí? Gracias.',
  ].join('\n');
}
