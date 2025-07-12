export default function EachUserPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <>
      <h1>User Page</h1>
      <p>This is the user with ID: {id}.</p>
    </>
  );
}