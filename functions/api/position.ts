export const onRequestGet: PagesFunction = async () => {
  // Random number between 1 and 4
  const randomNumber = Math.floor(Math.random() * 4);

  return Response.json({ POSITION: randomNumber });
};
