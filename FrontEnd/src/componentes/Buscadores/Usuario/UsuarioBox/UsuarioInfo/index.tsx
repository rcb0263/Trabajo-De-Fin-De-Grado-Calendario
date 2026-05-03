import { GetAsignaturaById } from "@/lib/spi/asignaturas";
import { Asignatura, GrupoPrivilegioTipo, Usuario } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ListaPrivilegios } from "@/componentes/ListaPrivilegiosNombres";
import { DetallePrivilegios } from "@/componentes/DetallePrivilegios";
import { PrivilegiosUsuario } from "@/componentes/FormularioCrearPrivilegios/Usuario";
import { EliminarUsuario, GetUsuario } from "@/lib/spi/usuarios";
import { AsignaturaBox } from "@/componentes/AsignaturaBox";
import "./style.css"
type UsuarioProps = {
  id: string,
  tipo: string
};

export const UsuarioDetalleCard = (params: UsuarioProps) => {
  const {id, tipo} = params
  const [usuario, setUsuario] = useState<Usuario|null>(null)
  const [cambio, setCambio] = useState(false);
  const [derecha, setDerecha] = useState<string>('')
  const [privilegio, setPrivilegio] = useState<GrupoPrivilegioTipo | null>(null);
  const [asignaturas, setAsignaturas] = useState<Asignatura[]>([])
  const [asignaturastTemp, setAsignaturastTemp] = useState<Asignatura[]>([])
  const urlBase = `admin/usuario/${id}`
  const router = useRouter();
  useEffect(()=>{
    GetUsuario({ id, tipo }).then((e)=>{
        setUsuario(e.usuario)
    }).finally(() => {
        setCambio(false)
    });
  },[id, cambio])

useEffect(() => {
  if (!usuario?.asignaturas) return;

  const getAsignaturas = async () => {
    try {
      const results = await Promise.all(
        usuario.asignaturas.map(id =>
          GetAsignaturaById({ id })
        )
      );

      setAsignaturas(results);
    } catch (error) {
      console.error(error);
    }
  };
  getAsignaturas()
}, [usuario]);

  return (
    <div className="ContenedorObjetoYPrivilegios">
    <div className="Asignatura">
    {usuario &&
      <div className="asignatura-detalle">
        <div className="Titulo_eliminar">
          <h4>{usuario.nombre}</h4>  
          <button 
          onClick={()=>{
            EliminarUsuario({
              id,
              tipo
            })
            router.push('/admin')
          }
          }
          >Eliminar </button> 
          </div> 
        <p>Nombre: {usuario.nombre}</p>
        <p>Correo: {usuario.mail}</p>
        {asignaturas.map(e=>{
            return(
            <AsignaturaBox
              key={e._id}
              nombre={e.nombre}
              curso={e.curso}
              grado={e.grado}
            />
            )
        })}
        <div>
          
          <ListaPrivilegios  
            privilegios={usuario.privilegios}
            urlBase={urlBase}
            setDerecha={setDerecha} 
            setCambio={setCambio} 
            tipo={tipo}
          />
        </div>
      </div>
      }
    </div>
      {usuario && derecha=='crearPrivilegio' &&
        <PrivilegiosUsuario 
        data={{
          mail: usuario.mail,
          tipo,
          setCambio: setCambio
      }}/>
      }
      {derecha=='detallePrivilegios' && privilegio && 
      <DetallePrivilegios 
      privilegio={privilegio} 
      tipo={'Asignatura'} 
      nombreObjetivo={privilegio.objetivo}
      />}
    </div>
  );
};