'use client'
import { useParams } from "next/navigation";


const Page = async () => {
  const { curso, nombre } = useParams();
  const name = decodeURIComponent(nombre as string);

  return ( 
    <>
      <p>{curso}</p>
      <p>{name}</p>
    </>
  );
}

export default Page;