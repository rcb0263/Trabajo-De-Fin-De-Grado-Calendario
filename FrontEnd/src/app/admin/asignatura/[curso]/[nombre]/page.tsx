'use client'
import { AsignaturaDetalleCard } from "@/componentes/AsignaturaBox/AsignaturaInfo";
import { useParams } from "next/navigation";


const Page = () => {
  const { curso, nombre } = useParams();
  const name = decodeURIComponent(nombre as string);

  return ( 
    <>
      <AsignaturaDetalleCard curso={Number(curso)} nombre={String(name)} />
    </>
  );
}

export default Page;