import { useRouter } from "next/navigation";
import { GrupoAsignaturacomp } from "@/types";
import "./style.css"

type Props = {
  asignatura: GrupoAsignaturacomp
};

export const GrupoAsignaturaBox = ({asignatura}: Props) => {

    const router = useRouter()
  return (
    <div className="grupoAsignatura-card" 
          onClick={() => {
            router.push(`/admin/asignatura/${asignatura.curso}/${encodeURIComponent(asignatura.nombre)}`);
          }}>
      <h2 className="nombre">{asignatura.nombre}</h2>
      <h3 className="nombre">{asignatura.tipo} {asignatura.grupo}</h3>
      <div className="datos">
        <h3 className="info">Grado en {asignatura.grado}</h3>
        <h3 className="info">{asignatura.curso}</h3>
      </div>
    </div>
  );
};