'use client'
import { AulaDetalleCard } from "@/componentes/Buscadores/Aula/AulaBox/AulaInfo";
import { GetAula } from "@/lib/spi/aula";
import { Aula } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";


const Page = () => {
  const { id} = useParams();
  const [aula, setAula] = useState<Aula|null>(null)
  useEffect(()=>{
    GetAula({id: String(id) }).then((e)=>{
        setAula(e)
    });
  },[])
  return ( 
    <>
    {!aula && <h1>Cargando</h1>}
      {aula && <AulaDetalleCard id={String(id)} />}
    </>
  );
}

export default Page;