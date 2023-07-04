type HttpMethod =
  | 'GET'
  | 'PUT'
  | 'PATCH'
  | 'UPDATE'
  | 'DELETE'
  | 'PUT'
  | 'POST'

type Severity = 'info' | 'warn' | 'error' | 'fatal'

interface FetchError {
  error: string
  severity: Severity
  description?: string
  response?: Response
}

export const apiUrl = import.meta.env.PROD
  ? 'https://cledioj.pythonanywhere.com/api/'
  : 'https://192.168.178.11:5000/api/'

export interface FetchOptions {
  auth: boolean
  method: HttpMethod
  immediate?: boolean
  contentType?: string
  body?: string
  headers?: HeadersInit
}

function getToken() {
  const authorized = ref(false)
  if (localStorage.token && new Date(localStorage.expiration) > new Date()) {
    authorized.value = true
    return { token: ref(localStorage.token), authorized }
  }
  throw new Error('not authorized')
}

function buildOptions(opts: FetchOptions) {
  const o: Partial<RequestInit> = {
    method: opts.method,
    body: opts.body,
  }
  if (opts.headers)
    o.headers = opts.headers

  if (opts.auth) {
    const token = getToken()
    Object.assign(o.headers || {},
      { Authorization: `Bearer ${token}` })
  }

  if (opts.contentType) {
    Object.assign(o.headers || {},
      { 'Content-Type': opts.contentType })
  }
  return o
}

export async function useFetch<T>(resource: string, opts: FetchOptions) {
  const isFetching = ref(false)
  const error = ref<undefined | FetchError>()
  const authorized = ref(false)
  try {
    authorized.value = getToken().authorized.value
  }
  catch (err) {
    if (err instanceof Error) {
      error.value = {
        error: err.name,
        severity: 'error',
        description: err.message,
      }
    }
  }
  const data = ref<T | null>(null)

  const o = buildOptions(opts)

  if (opts.auth && !authorized) {
    error.value = {
      error: 'Not authorized',
      severity: 'error',
    }
  }

  const execute = async () => {
    isFetching.value = true
    const response = ref<Response | undefined>()
    try {
      response.value = await fetch(apiUrl + resource, o)
    }
    catch (err) {
      if (err instanceof Error) {
        error.value = {
          error: err.name,
          severity: 'error',
          description: err.message,
        }
      }
      return
    }

    if (!response) {
      error.value = {
        error: 'Network error',
        severity: 'fatal',
      }
      return
    }
    if (!response.value.ok) {
      error.value = {
        error: 'Failed to fetch.',
        severity: 'error',
        response: response.value,
      }
      return
    }
    data.value = await response.value.json()
    isFetching.value = false
  }

  if (opts.immediate)
    await execute()

  return { authorized, isFetching, error, execute, data }
}
