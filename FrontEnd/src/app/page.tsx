'use client'
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter()
  
  return (
    <div>
      <h1>Pagina pricipal, sugiero un login</h1>
      <button onClick={()=>{
        router.push(`/login/profesor`)
      }}>Iniciar Sesion Como Proesor</button>
    </div>
  );
}

export default Page;