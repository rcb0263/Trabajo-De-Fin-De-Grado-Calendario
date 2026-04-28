'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GrupoAsignatura, GrupoPrivilegio, GrupoPrivilegioTipo } from "@/types";
import { GetGrupoPrivilegios } from "@/lib/spi/privilegios";
import { DetallePrivilegios } from "@/componentes/DetallePrivilegios";

const Page = () => {
  const params = useParams();

  const [privilegio, setPrivilegio] = useState<GrupoPrivilegioTipo | null>(null);
  const [loading, setLoading] = useState(true);
  const [cambio, setCambio] = useState<boolean>(false)
  const curso = Number(params.curso);
  const nombre = decodeURIComponent(params.nombre as string);
  const id = decodeURIComponent(params.id as string);

  useEffect(() => {
    setLoading(true);
    GetGrupoPrivilegios({
      id,
    })
    .then((e)=>{
      setPrivilegio(e)
    })
    .finally(() => {
      setLoading(false)
      setCambio(false)
    });
  }, [curso, nombre, id, cambio]);
  if (!loading && !privilegio) return <h1>No encontrado</h1>;

  return (
    <div>
      {privilegio && <DetallePrivilegios privilegio={privilegio} tipo={'Asignatura'} nombreObjetivo={nombre}/>}
    </div>
  );
}

export default Page;