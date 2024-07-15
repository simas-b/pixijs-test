export const onRequestGet: PagesFunction = async () => {
  const joke = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      accept: "application/json",
    },
  });

  return Response.json(await joke.json());
};
