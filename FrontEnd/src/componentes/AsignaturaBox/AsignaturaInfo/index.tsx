import { GetAsignatura } from "@/lib/spi/asignaturas";
import { Asignatura, GrupoAsignatura, GrupoPrivilegio } from "@/types";
import { useEffect, useState } from "react";
import "./style.css"
import { useRouter } from "next/navigation";
import { ListaPrivilegios } from "@/componentes/GruposPrivilegios";
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
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>("");

  const urlBase = `/admin/asignatura/${params.curso}/${params.nombre}`
  const router = useRouter();
  useEffect(()=>{
      setLoading(true)
      GetAsignatura({ curso: params.curso, nombre: params.nombre }).then((e)=>{
          setAsignatura(e)
      }).finally(() => setLoading(false));
  },[params.curso, params.nombre])

  const handleDelete = () => {
    if (!selected) return;
    //ToDo
    setSelected("");
  };
  return (
    <>
        {loading && <h1>Cargando...</h1>}
        {asignatura &&
          <div className="asignatura-detalle">
            <h4>{asignatura.nombre}</h4>
            <p>Curso: {asignatura.curso}</p>
            <p>Año: {asignatura.año}º</p>
            <p>Grado: {asignatura.grado}</p>
            <p>Semestre: {asignatura.semestre}</p>
            <div className="seccion-grupos">

              <GrupoLista titulo={'Grupos de Teoría:'} grupos={asignatura.teoria} urlBase={urlBase+'/teoria'}/>

              <GrupoLista titulo={'Grupos de Prácticas:'} grupos={asignatura.practicas} urlBase={urlBase+'/practica'}/>
              

               <ListaPrivilegios privilegios={asignatura.privilegios} urlBase={urlBase}/>
            </div>
          </div>
        }
    </>
  );
};


type Props = {
  titulo: string;
  grupos: GrupoAsignatura[];
  urlBase: string;
};

export const GrupoLista = ({ titulo, grupos, urlBase }: Props) => {
  const router = useRouter();

  return (
      <div className="lista-grupos-row">

        <strong>{titulo}:</strong>

        {grupos.length > 0 ? (
          grupos.map((g, index) => (
            <div
              key={`${g}-${index}`}
              className="grupo-chip"
              onClick={() => router.push(`${urlBase}/${g.grupo}`)}
            >
              <h3>Grupo: {g.grupo}</h3>
              <h4>Profesores: {g.profesores.length}</h4>
              <h4>Alumnos: {g.alumnos.length}</h4>
            </div>
          ))
        ) : (
          <p>Vacío</p>
        )}

      </div>

  );
};