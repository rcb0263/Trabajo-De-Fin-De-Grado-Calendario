import { useRouter } from "next/navigation";
type Props = {
  id: string,
  aula: string;
};

export const AulaBox = (params: Props) => {
    const router = useRouter()
  return (
    <div  className="asignatura-card" 
      onClick={() => {
        router.push(`/admin/aula/${params.id}`);
      }}>
      <h2 className="nombre">{params.aula}</h2>
    </div>
  );
};