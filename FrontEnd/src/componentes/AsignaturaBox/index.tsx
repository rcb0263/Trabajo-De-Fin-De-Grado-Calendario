import { useRouter } from "next/navigation";
import "./style.css"
type Props = {
  nombre: string;
  curso: number;
  grado: string;
};

export const AsignaturaBox = (params: Props) => {
    const router = useRouter()
  return (
    <div className="asignatura-card" 
          onClick={() => {
            router.push(`/admin/asignatura/${params.curso}/${encodeURIComponent(params.nombre)}`);
          }}>
      <p className="nombre">{params.nombre}</p>
      <p className="info">Grado en {params.grado}</p>
    </div>
  );
};