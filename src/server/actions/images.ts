import { db } from "../db";

export async function getEvaluationImages(id: number) {
  const image = await db.query.images.findMany({
    where: (model, { eq }) => eq(model.evaluationId, id),
  });

  if (!image) {
    throw new Error("Image not found");
  }

  return image;
}
