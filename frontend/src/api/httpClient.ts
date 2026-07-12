export async function handleResponse(response: Response): Promise<void> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    console.log("Erreur API:", errorBody);
    const message = errorBody?.error ?? "Une erreur inattendue est survenue.";
    throw new Error(message);
  }
}