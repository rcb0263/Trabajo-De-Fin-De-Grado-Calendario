import { GetAsignaturaById } from "@/lib/spi/asignaturas";
import { GrupoAsignaturacomp, GrupoPrivilegioTipo, Usuario } from "@/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ListaPrivilegios } from "@/componentes/ListaPrivilegiosNombres";
import { DetallePrivilegios } from "@/componentes/DetallePrivilegios";
import { PrivilegiosUsuario } from "@/componentes/crear/FormularioCrearPrivilegios/Usuario";
import { EliminarUsuario, GetUsuario } from "@/lib/spi/usuarios";
import "./style.css"
import { GrupoAsignaturaBox } from "@/componentes/Buscadores/Asignatura/AsignaturaBox/AsignaturaInfo/GrupoAsignatura/GrupoAsignaturaBox";
type UsuarioProps = {
  id: string,
  tipo: string,
  notAdmin?: string
};



export const UsuarioDetalleCard = (params: UsuarioProps) => {
  const {id, tipo} = params
  const [usuario, setUsuario] = useState<Usuario|null>(null)
  const [cambio, setCambio] = useState(true);
  const [derecha, setDerecha] = useState<string>('')
  const [privilegio, setPrivilegio] = useState<GrupoPrivilegioTipo | null>(null);
  const [asignaturas, setAsignaturas] = useState<GrupoAsignaturacomp[]>([])
  const router = useRouter();

  
  useEffect(()=>{
    if(cambio==true){
      GetUsuario({ id, tipo }).then((e)=>{
        setUsuario(e)
    }).finally(() => {
        setCambio(false)
    });
    }
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
        <p>Usuario: {usuario.nombre}</p>
        <p>Correo: {usuario.mail}</p>
        <div className="lista-grupos-row">
          {asignaturas.map(e=>{
            return(
            <GrupoAsignaturaBox
              key={e._id}
              asignatura={e}
            />
            )
        })}
        </div>
        
        {(!params.notAdmin || params.notAdmin !=='user') && <div>
          
          <ListaPrivilegios  
            privilegios={usuario.privilegios}
            setPrivilegio={setPrivilegio}
            setDerecha={setDerecha} 
            setCambio={setCambio} 
            tipo={tipo}
          />
        </div>}
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
      tipo={'Usuario'} 
      nombreObjetivo={usuario!.nombre}
      />}
    </div>
  );
};