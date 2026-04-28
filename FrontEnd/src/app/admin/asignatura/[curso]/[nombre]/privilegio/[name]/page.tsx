'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GrupoAsignatura } from "@/types";
import { GetGrupoAsignatura } from "@/lib/spi/asignaturas";
import { GrupoDetalle } from "@/componentes/AsignaturaBox/AsignaturaInfo/GrupoAsignatura";

const Page = () => {
  const params = useParams();

  const [grupoData, setGrupoData] = useState<GrupoAsignatura | null>(null);
  const [loading, setLoading] = useState(true);
  const [cambio, setCambio] = useState<boolean>(false)
  const curso = Number(params.curso);
  const nombre = decodeURIComponent(params.nombre as string);
  const tipo = (params.tipo as string).toLowerCase() === "teoria" ? "Teoria" : "Practica";
  const grupo = params.grupo as string;
  const privilegio = params.privilegio as string;

  useEffect(() => {
    setLoading(true);
    GetGrupoAsignatura({
        curso,
        nombre,
        tipo,
        grupo
    })
    .then((e)=>{
      setGrupoData(e)
    })
    .finally(() => {
      setLoading(false)
      setCambio(false)
    });
  }, [curso, nombre, tipo, grupo, cambio]);
  if (!loading && !grupoData) return <h1>No encontrado</h1>;

  return (
    <div>
      {grupoData &&
        <GrupoDetalle 
        grupoData={grupoData} 
        curso={curso} 
        nombre={nombre} 
        tipo={tipo} 
        grupo={grupo}
        cambio={cambio}
        setCambio={setCambio}
        />
      }
    </div>
  );
}

export default Page;