import { DeleteAsignatura, DeleteGrupoAsignatura, GetAsignatura } from "@/lib/spi/asignaturas";
import { Asignatura, GrupoAsignatura, GrupoPrivilegio, GrupoPrivilegioTipo } from "@/types";
import { SetStateAction, useEffect, useState } from "react";
import "./style.css"
import { useRouter } from "next/navigation";
import { ListaPrivilegios } from "@/componentes/ListaPrivilegiosNombres";
import { DetallePrivilegios } from "@/componentes/DetallePrivilegios";
import { PrivilegiosAsignatura } from "@/componentes/FormularioCrearPrivilegios/Asignatura";
type AsignaturaProps = {
  curso: number;
  nombre: string
};


type AsignaturaDetalle = Asignatura & {
  teoria: GrupoAsignatura[];
  practicas: GrupoAsignatura[];
  privilegios: GrupoPrivilegio[];
};
export const AsignaturaDetalleCard = (params: AsignaturaProps) => {
  const [asignatura, setAsignatura] = useState<AsignaturaDetalle|null>(null)
  const [privilegio, setPrivilegio] = useState<GrupoPrivilegioTipo | null>(null);
  const [crearPrivilegio, setCrearPrivilegio] = useState<boolean>(false)
  const [cambio, setCambio] = useState(false);
  const {curso, nombre} = params
  const urlBase = `/admin/asignatura/${curso}/${nombre}`
  const router = useRouter();
  useEffect(()=>{
    GetAsignatura({ curso: curso, nombre: nombre }).then((e)=>{
        setAsignatura(e)
    }).finally(() => {
              setCambio(false)
    });
  },[curso, nombre, cambio])

  return (
    <div className="ContenedorObjetoYPrivilegios">
    <div className="Asignatura">
    {asignatura &&
      <div className="asignatura-detalle">
        <div className="Titulo_eliminar">
          <h4>{asignatura.nombre}</h4>  
          <button 
          onClick={()=>{
            DeleteAsignatura({
              nombre,
              curso
            }),
            router.push('/admin')
          }
          }
          >Eliminar </button> 
          </div> 
        <p>Curso: {asignatura.curso}</p>
        <p>Año: {asignatura.año}º</p>
        <p>Grado: {asignatura.grado}</p>
        <p>Semestre: {asignatura.semestre}</p>
        <div>

          <GrupoLista 
            titulo={'Grupos de Teoría'} 
            grupos={asignatura.teoria} 
            urlBase={urlBase} 
            tipo={'/teoria'} 
            curso={curso} 
            nombre={nombre}
            setCambio={setCambio}
            />

          <GrupoLista 
          titulo={'Grupos de Prácticas'}
          grupos={asignatura.practicas}
          urlBase={urlBase}
          tipo={'/practica'}
          curso={curso}
          nombre={nombre} 
          setCambio={setCambio}                
            />
          
            <ListaPrivilegios  
            privilegios={asignatura.privilegios} 
            urlBase={urlBase} setPrivilegios={setPrivilegio} 
            setCrearPrivilegios={setCrearPrivilegio} 
            crearPrivilegio={crearPrivilegio}/>
        </div>
      </div>
      }
    </div>
      {asignatura && crearPrivilegio && 
        <PrivilegiosAsignatura 
        data={{
          nombreAsignatura:asignatura.nombre, 
          curso,
          setCrearPrivilegios: setCrearPrivilegio,
          crearPrivilegio
      }}/>
      }
      {!crearPrivilegio && privilegio && 
      <DetallePrivilegios 
      privilegio={privilegio} 
      tipo={'Asignatura'} 
      nombreObjetivo={nombre}
      />}
    </div>
  );
};


type Props = {
  titulo: string;
  grupos: GrupoAsignatura[];
  urlBase: string;
  tipo: string;
  curso: number;
  nombre: string
  setCambio: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GrupoLista = ({ titulo, grupos, urlBase, tipo, curso, nombre, setCambio }: Props) => {
  const router = useRouter();
  

  return (
    <div className="lista-grupos-row lista">
      <div className="titulo-row">
      <h4>{titulo}:</h4>
        <button className="row-button" onClick={()=>router.push(`/admin/crear/creargrupoasignatura`)}>Añadir</button>
      </div>
      <div >
      {grupos.length > 0 ? (
          grupos.map((g, index) => (
            <div
              key={`${g}-${index}`}
              className="usuario-row"
             
            >
              <div >
                <h3>Grupo: {g.grupo}</h3>
                <h4>Profesores: {g.profesores.length}</h4>
                <h4>Alumnos: {g.alumnos.length}</h4>
              </div>
              <button className="row-button"  onClick={() => router.push(`${urlBase}/${tipo}/${g.grupo}`)}>Deatalle</button>
              <button className="row-button"  onClick={() => {
                DeleteGrupoAsignatura({
                  nombre: nombre,
                  curso: curso,
                  grupo: g.grupo,
                  tipo: g.tipo
                })
                setCambio(true)
              }
              }>Eliminar</button>
            </div>
          ))
        ) : (
          <button>Crear</button>
        )}
    </div>
      </div>

  );
};