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
      <h2 className="nombre">{params.nombre}</h2>
      <div className="datos">
        <h3 className="info">Grado en {params.grado}</h3>
        <h3 className="info">{params.curso}</h3>
      </div>
    </div>
  );
};