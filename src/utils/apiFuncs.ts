export const apiUrl = "http://localhost:5000/api/";

export async function updateReading(token: string, data: Reading) {}

export async function deleteReading(id: number, token: string) {
  const response = await fetch(apiUrl + "reading/delete" + `?id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
  return response;
}
