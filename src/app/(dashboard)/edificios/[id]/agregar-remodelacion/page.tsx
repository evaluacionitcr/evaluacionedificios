import { RemodelacionForm } from "./RemodelacionForm";

interface BuildingPageProps {
  params: { id: string };
}

// Server component that passes the id to the client component
export default function AddRemodelacionPage({ params }: BuildingPageProps) {
  return <RemodelacionForm buildingId={params.id} />;
} 