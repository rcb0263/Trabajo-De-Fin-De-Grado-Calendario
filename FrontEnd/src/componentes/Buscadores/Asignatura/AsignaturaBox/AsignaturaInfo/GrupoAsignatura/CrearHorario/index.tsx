

import { CrearExcepcion, CrearSesion } from "@/lib/spi/asignaturas";
import { useState } from "react"

type Props = {
  data?: {
    curso: number,
    tipo: string,
    grupo: string,
    nombre:string,
    setCambio: React.Dispatch<React.SetStateAction<boolean>>;
  }
};
const horasValidas = () => {
  const horas = [];
   for(let h= 7; h<= 22; h++){
    horas.push(h+':'+'00')
    horas.push(h+':'+'30')
   }
  return horas;
};
export const CrearHorarioComponente = ({data}:Props) =>{
  const añoActual = new Date().getFullYear();
  const [nombre, setNombre] = useState<string>(data?.nombre||'')
  const [grupo, setGrupo] = useState<string>(data?.grupo||'')
  const [curso, setCurso] = useState<number>(data?.curso||añoActual)
  const [tipo, setTipo] = useState<string>(data?.tipo||'')

  const [aula, setAula] = useState<string>('')
  const [fecha, setFecha] = useState<string>('')
  const [horaInicio, setHoraInicio] = useState<string>('')
  const [horaFin, setHoraFin] = useState<string>('')

  /*

    tipo:string,
*/
  const [error, setError]= useState<string>('');

  return(
      <div className="contenedor">
      <p >Asignatura: </p>
      <input className={error.includes('nombre')? 'input-error':''}
        name="nombre"
        value={nombre}
        onChange={e=>{
          setNombre(e.target.value)
          setError(error.replaceAll('nombre', ''))
        }}
        placeholder="nombre"/>
      <p >Grupo: </p>
      <input className={error.includes('grupo')? 'input-error':''}
        name="grupo"
        value={grupo}
        onChange={e=>{
          setGrupo(e.target.value)
          setError(error.replaceAll('grupo', ''))
        }}
        placeholder="nombre"/>      

      <p className={curso<añoActual? 'error-text':''}>Curso: </p>
      <input className={curso<añoActual? 'input-error':''}
        name="curso"
        type="number"
        min={añoActual}
        value={curso}
        onChange={(e) => {
          setCurso(Number(e.target.value))
        }}
      />
      <p>Tipo de Grupo: </p>
      <select className={error.includes('tipoUsuario')? 'input-error':''}
          name="tipo"
          value={tipo}
          onChange={e => {
            setTipo(e.target.value)
            setError(error.replaceAll('tipo', ''))
          }}
        >
          <option value="">Selecciona tipo de Usuario</option>
          <option value="Teoria">Teoria</option>
          <option value="Practica">Practica</option>
        </select>

      <p >Aula: </p>
      <input className={error.includes('aula')? 'input-error':''}
        name="aula"
        value={aula}
        onChange={e=>{
          setAula(e.target.value)
          setError(error.replaceAll('aula', ''))
        }}
        placeholder="aula"/>  

      <p>Fech Fin: </p>
      <input className={error.includes('fecha')? 'input-error':''}
        type="date"
        name="fecha"
        value={fecha}
        onChange={(e) => {

          setFecha(e.target.value)
          setError(error.replaceAll('fecha', ''))
        }}
      />
        
      <p>Inicio:</p>
        <select
        className={error.includes('horaInicio') ? 'input-error' : ''}
        value={horaInicio}
        onChange={e => {
            setHoraInicio(e.target.value);
            setError(error.replaceAll('horaInicio', ''));
        }}
        >
        <option value="">Inicio</option>

        {horasValidas().map(hora => (
            <option key={hora} value={hora}>
            {hora}
            </option>
        ))}
        </select>

      <p>Fin:</p>
        <select
        className={error.includes('horaFin') ? 'input-error' : ''}
        value={horaFin}
        onChange={e => {
            setHoraFin(e.target.value);
            setError(error.replaceAll('horaIhoraFinnicio', ''));
        }}
        >
        <option value="">Fin</option>

        {horasValidas().map(hora => (
            <option key={hora} value={hora}>
            {hora}
            </option>
        ))}
        </select>


      <button className="boton" onClick={async () => {
          try {
            await CrearExcepcion({
                nombre, 
                curso, 
                grupo, 
                tipo,
                aula, 
                fecha,
                horaInicio,
                horaFin
            });
            setError('')
            alert("OK");
            data?.setCambio(true)

          } catch (err: any) {
            const mensaje = err.response?.data?.message;

            if (Array.isArray(mensaje)) {
              alert(mensaje.join("\n"));
              setError(mensaje.join("\n"))
            } else {
              alert(mensaje || "Error desconocido");
            }
          }
      }}>Crear</button>

    </div>
  )
}
