import { useRouter } from "next/navigation";
import { GrupoAsignaturacomp } from "@/types";
import "./style.css"
import { useState } from "react";

type Props = {
  asignatura: GrupoAsignaturacomp
  data?:{
    setDerecha: React.Dispatch<React.SetStateAction<string>>;
    setGrupo:  React.Dispatch<React.SetStateAction<GrupoAsignaturacomp|null>>;
    usuario: string
    derecha: string
  }
};

export const GrupoAsignaturaBox = ({asignatura, data}: Props) => {
    const router = useRouter()
  return (
    <div className="grupoAsignatura-card" 
          onClick={() => {
            {data?.usuario == 'Admin' && router.push(`/admin/asignatura/${asignatura.curso}/${encodeURIComponent(asignatura.nombre)}`);}
            {data?.usuario == 'Profesor' &&
              data?.setGrupo(asignatura) 
              data?.setDerecha('detallesGrupo')}
          }}>
      <h2 className="nombre">{asignatura.nombre}</h2>
      <h3 className="nombre">{asignatura.tipo} {asignatura.grupo}</h3>
      <div className="datos">
        <h3 className="info">Grado en {asignatura.grado}</h3>
        <h3 className="info">{asignatura.curso}</h3>
      </div>
    </div>
  );
};