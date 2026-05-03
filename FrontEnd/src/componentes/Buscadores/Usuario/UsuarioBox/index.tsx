import { useRouter } from "next/navigation";
type Props = {
  id: string,
  nombre: string;
  mail: string;
  asignaturas: string[];
  tipoUsuario: string
};

export const UsuarioBox = (params: Props) => {
    const router = useRouter()
  return (
    <div className="asignatura-card" 
          onClick={() => {
            router.push(`/admin/usuario/${params.tipoUsuario}/${params.id}`);
          }}>
      <h2 className="nombre">{params.nombre}</h2>
      <h2 className="nombre">{params.mail}</h2>
      <h3 className="info">Asignaturas{'('+ params.asignaturas.length+')'}</h3>
    </div>
  );
};