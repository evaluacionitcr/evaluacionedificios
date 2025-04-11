import { use } from "react";
import { RemodelacionForm } from "./RemodelacionForm";

interface BuildingPageProps {
  params: Promise<{ id: string }>;
}

// Server component that passes the id to the client component
export default function AddRemodelacionPage({ params }: BuildingPageProps) {
  const { id } = use(params);
  return <RemodelacionForm buildingId={id} />;
} 