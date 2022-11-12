//for prod
// export const apiUrl = "https://cledioj.pythonanywhere.com/api/";

import { dataStore, errorStore } from "../store";
import { networkError } from "./errors";

//for dev
export const apiUrl = "http://localhost:5000/api/";

export async function updateReading(token: string, data: Reading) {}

export async function deleteReading(id: number, token: string) {
  return fetch(apiUrl + "reading/delete" + `?id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });
}

export async function modifyReading(id: number, token: string, data: Reading) {
  return fetch(apiUrl + "reading/modify" + `?id=${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  });
}

export async function addReading(reading: Reading, token: string) {
  const res = await fetch(apiUrl + "reading/put", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(reading),
  });
  if (res) {
    const data = await res.json();
  }
}
