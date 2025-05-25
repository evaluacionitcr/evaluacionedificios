// ~/server/actions/evaluaciones.ts
import { MongoClient, ObjectId } from "mongodb";

interface Evaluacion {
  _id: ObjectId;
  edificio: {
    codigo: string;
    nombre: string;
    campus: string;
    usoActual: string;
    area: number;
    descripcion: string;
  };
  codigoEdificio?: string;
  createdAt: Date;
  estado: string;
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

export async function getUltimaEvaluacionDeEdificio(){
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection<Evaluacion>(collectionName);

    const evaluaciones = await collection.find({}).toArray();

    // Agrupar por código de edificio y encontrar la última evaluación para cada uno
    const ultimasEvaluaciones: Record<string, Evaluacion> = {};
    
    for (const evaluacion of evaluaciones) {
      const codigo = evaluacion.edificio?.codigo?.toLowerCase() ?? evaluacion.codigoEdificio?.toLowerCase();
      if (!codigo) continue;

      // Si no existe una evaluación para este edificio o la actual es más reciente
      if (
        !ultimasEvaluaciones[codigo] || 
        new Date(evaluacion.createdAt) > new Date(ultimasEvaluaciones[codigo].createdAt)
      ) {
        ultimasEvaluaciones[codigo] = evaluacion;
      }
    }

    // Convertir el objeto a un array de evaluaciones
    return Object.values(ultimasEvaluaciones);
  } catch (error) {
    console.error("Error al obtener últimas evaluaciones de edificios:", error);
    return [];
  } finally {
    await client.close();
  }
}
