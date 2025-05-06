// ~/server/actions/evaluaciones.ts
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.DB_NAME || "evaluacionedificiositcr";
const collectionName = process.env.COLLECTION_NAME || "evaluaciones";

export async function getEvaluacionesPorEdificio() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const evaluaciones = await collection.find({}).toArray();

    // Agrupar por código de edificio
    const evaluacionesPorCodigo: Record<string, any[]> = {};
    for (const evalDoc of evaluaciones) {
      const codigo = evalDoc.codigoEdificio?.toLowerCase(); // aseguramos minúsculas
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
      const collection = db.collection(collectionName);
  
      const evaluacion = await collection.findOne({ _id: new ObjectId(id) });
  
      return evaluacion;
    } catch (error) {
      console.error("Error al obtener evaluación por ID:", error);
      return null;
    } finally {
      await client.close();
    }
  }
