export const getFechaNumerica = () => {
  const hoy = new Date();

  const dia = hoy.getDate();        // 1 - 31
  const mes = hoy.getMonth() + 1;   // 1 - 12 (IMPORTANTE +1)
  const año = hoy.getFullYear();    // yyyy

  return { dia, mes, año };
};
export const getDiaSemana = (dia: number, mes: number, año: number) => {
  const fecha = new Date(año, mes - 1, dia); // mes empieza en 0

  const dias = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

  return dias[fecha.getDay()];
};