export const apiUrl = import.meta.env.PROD
  ? 'https://cledioj.pythonanywhere.com/api/'
  : 'https://192.168.178.11:5000/api/'

export async function deleteReading(id: number, token: string) {
  return fetch(`${apiUrl}reading/delete` + `?id=${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
}

export async function modifyReading(id: number, token: string, data: Reading) {
  return fetch(`${apiUrl}reading/modify` + `?id=${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
}

export async function addReading(reading: Reading, token: string) {
  const res = await fetch(`${apiUrl}reading/put`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(reading),
  })
  if (res) {
    const data = await res.json()
  }
}

export async function getFilteredReadings(token: string, from_date: string, to_date: string) {
  try {
    const response = await fetch(
      `${apiUrl
      }readings/get?${
        new URLSearchParams({ per_page: '500', from_date, to_date })}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      },
    )
  }
  catch (_error) {
    console.log(_error)
  }
}

export async function pushImage(token: string, file: Blob) {
  const formData = new FormData()
  formData.append('image', file)
  try {
    const response = await fetch(`${apiUrl}image`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response || !response.ok)
      return undefined

    const data: ImageResult = await response.json()
    return data
  }
  catch (_error) {
    console.log(_error)
  }
}
