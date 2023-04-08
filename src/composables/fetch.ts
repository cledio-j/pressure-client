import { authStore } from '@/store'

export const apiUrl = import.meta.env.PROD
  ? 'https://cledioj.pythonanywhere.com/api/'
  : 'http://192.168.178.11:5000/api/'

export interface fetchOptions {
  auth: boolean
  method: httpMethod
  body?: string | FormData
  type?: string
}

async function getToken() {
  if (localStorage.token && new Date(localStorage.tokenExpiration) > new Date()) {
    authStore.authorized = true
    authStore.token = localStorage.token
    return localStorage.token
  }

  const fData = new FormData()
  fData.append('username', 'test')
  fData.append('password', 'test')
  const response = await fetch(`${apiUrl}auth/token`, {
    method: 'POST',
    body: fData,
  })
  const data = await response.json()
  localStorage.token = data.access_token
  return data.access_token
}

type httpMethod =
  | 'GET'
  | 'PUT'
  | 'PATCH'
  | 'UPDATE'
  | 'DELETE'
  | 'PUT'
  | 'POST'

async function buildOptions(options: fetchOptions) {
  const o: Partial<RequestInit> = {
    method: options.method,
    body: options.body,
  }
  if (options.auth) {
    const token = await getToken()
    o.headers = {
      'Content-Type': !options.type ? 'application/json' : options.type,
      'Authorization': `Bearer ${token}`,
    }
  }
  return o
}

export async function useFetch(url: string, options: fetchOptions) {
  const o = await buildOptions(options)
  return new Promise<Response | null>((resolve, reject) => {
    fetch(apiUrl + url, o)
      .then(async (response) => {
        if (!response.ok)
          return reject(response.status)

        return resolve(response)
      })
      .catch(async (error) => {
        return reject(error)
      })
  })
}

export async function login(name: string, pwd: string) {
  try {
    const response = await fetch(`${apiUrl}user/get-token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${window.btoa(`${name}:${pwd}`)}`,
      },
    })
    if (response && !response.ok) {
      if (response.status === 401) {
        authStore.authorized = false
        // handleError(notAuthorized(t, getNewToken, response));
        return
      }
    }
    const data = await response.json()
    if (data) {
      authStore.token = data.token
      localStorage.tokenExpiration = data.expires
      localStorage.token = data.token
      authStore.authorized = true
    }
    else {
      authStore.authorized = false
    }
  }
  catch (error) {
    authStore.authorized = false
    // handleError(networkError(t, () => getNewToken(name, pwd)));
  }
}
