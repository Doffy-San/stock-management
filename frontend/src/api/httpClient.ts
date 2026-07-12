export async function handleResponse(response: Response): Promise<void> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.error ?? "An unexpected error occurred.";
    throw new Error(message);
  }
}