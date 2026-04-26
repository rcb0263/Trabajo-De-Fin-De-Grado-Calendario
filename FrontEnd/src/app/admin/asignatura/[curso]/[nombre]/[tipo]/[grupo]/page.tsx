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

  const curso = Number(params.curso);
  const nombre = decodeURIComponent(params.nombre as string);
  const tipo = (params.tipo as string).toLowerCase() === "teoria" ? "Teoria" : "Practica";
  const grupo = params.grupo as string;

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
    .finally(() => setLoading(false));
  }, [curso, nombre, tipo, grupo]);

  if (loading) return <h1>Cargando...</h1>;
  if (!grupoData) return <h1>No encontrado</h1>;

  return (
    <GrupoDetalle grupoData={grupoData} curso={curso} nombre={nombre}/>
  );
}

export default Page;