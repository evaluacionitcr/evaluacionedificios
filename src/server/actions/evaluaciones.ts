// ~/server/actions/evaluaciones.ts
import { MongoClient, ObjectId } from "mongodb";

interface Evaluacion {
  _id: string;
  edificio: {
    codigo: string;
    nombre: string;
    campus: string;
    usoActual: string;
    area: number;
    descripcion: string;
  };
  depreciacion: {
    principal: {
      edad: number;
      vidaUtil: number;
      estadoConservacionCoef: number;
      escalaDepreciacion: number;
    };
    remodelacion: {
      edad: number;
      vidaUtil: number;
      estadoConservacionCoef: number;
      porcentaje: number;
      escalaDepreciacion: number;
    };
    puntajeDepreciacionTotal: number;
  };
  componentes: {
    id: number;
    componente: string;
    peso: number;
    existencia: string;
    necesidadIntervencion: number;
    pesoEvaluado: number;
    puntaje: number;
  }[];
  puntajeComponentes: number;
  serviciabilidad: {
    funcionalidadId: number;
    normativaId: number;
    puntajeServiciabilidad: number;
  };
  puntajeTotalEdificio: number;
  comentarios: {
    funcionalidad: string;
    normativa: string;
    componentesCriticos: string;
    mejorasRequeridas: string;
    registroFotografico: string;
  };
  createdAt: string; 
  estado: string;
  revisado: boolean;
}


const uri = process.env.MONGODB_URI ?? '';
const dbName = process.env.DB_NAME ?? "evaluacionedificiositcr";
const collectionName = process.env.COLLECTION_NAME ?? "evaluaciones";

export async function getEvaluacionesPorEdificio() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection<Evaluacion>(collectionName);

    const evaluaciones = await collection.find({}).toArray();

    // Agrupar por código de edificio
    const evaluacionesPorCodigo: Record<string, Evaluacion[]> = {};
    for (const evalDoc of evaluaciones) {
      const codigo = evalDoc.edificio?.codigo?.toLowerCase() ?? evalDoc.codigoEdificio?.toLowerCase();
      if (!codigo) continue;

      if (!evaluacionesPorCodigo[codigo]) {
        evaluacionesPorCodigo[codigo] = [];
      }
      evaluacionesPorCodigo[codigo].push(evalDoc);
    }

    return evaluacionesPorCodigo;
  } catch (error) {
    console.error("Error al obtener evaluaciones por edificio:", error);
    return {};
  } finally {
    await client.close();
  }
}

export async function getEvaluacionPorId(id: string) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection<Evaluacion>(collectionName);

    const evaluacion = await collection.findOne({ _id: new ObjectId(id) });

    return evaluacion;
  } catch (error) {
    console.error("Error al obtener evaluación por ID:", error);
    return null;
  } finally {
    await client.close();
  }
}
