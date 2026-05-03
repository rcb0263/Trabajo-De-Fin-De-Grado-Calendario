'use client'
import { AsignaturaDetalleCard } from "@/componentes/AsignaturaBox/AsignaturaInfo";
import { UsuarioDetalleCard } from "@/componentes/Buscadores/Usuario/UsuarioBox/UsuarioInfo";
import { useParams } from "next/navigation";


const Page = () => {
  const { id, tipo } = useParams();
  return ( 
    <>
      <UsuarioDetalleCard tipo={String(tipo)} id={String(id)} />
    </>
  );
}

export default Page;