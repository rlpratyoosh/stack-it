export default function EachQuestion( { params }: { params: { id: string } }) {
  const { id } = params;
  return (
    <>
      <h1>Question Page</h1>
      <p>This is the question {id}.</p>
    </>
  );
}