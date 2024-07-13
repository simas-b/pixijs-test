export const onRequestGet: PagesFunction = async () => {
  const result = await fetch("https://icanhazdadjoke.com/", {
    headers: {
      accept: "application/json",
    },
  });
  const joke = await result.json();

  return Response.json(joke);
};
