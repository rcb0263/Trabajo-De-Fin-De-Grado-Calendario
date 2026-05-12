'use client'
import { useState } from "react";
import { crearAula } from "@/lib/spi/aula";

const Page = () => {

  const [nombre, setNombre] = useState<string>('')
  const [error, setError] = useState<string>('')

  return (
    <>
      <h1>Crear Aula</h1>

      <div className="contenedor">
        <p className={error.includes('nombre') ? 'error-text' : ''}>
          Nombre del aula:
        </p>

        <input
          className={error.includes('nombre') ? 'input-error' : ''}
          name="nombre"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          placeholder="PRBA000"
        />

        <button
          className="boton"
          onClick={async () => {
            try {
              await crearAula({ nombre });
              setNombre('');
              setError('');
            } catch (err: any) {
              const mensaje = err.response?.data?.message;
              setError(mensaje || "Error desconocido");
            }
          }}
        >
          Crear
        </button>

      </div>
    </>
  );
}

export default Page;