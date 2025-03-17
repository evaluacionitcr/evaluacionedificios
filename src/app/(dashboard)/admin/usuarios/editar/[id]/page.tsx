import EditUsersView from "~/components/views/edit-users-view";

type Params = Promise<{ id: string }>;

export default async function EditarUsuarioPage(props: { params: Params }) {
  const params = await props.params;
  const _id = params.id;
  return <EditUsersView id={_id} />;
}
