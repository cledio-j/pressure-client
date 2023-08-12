type HttpMethod =
  | 'GET'
  | 'PUT'
  | 'PATCH'
  | 'UPDATE'
  | 'DELETE'
  | 'PUT'
  | 'POST'

type Severity = 'info' | 'warn' | 'error' | 'fatal'

export interface FetchError {
  error: string
  severity: Severity
  description?: string
  response?: Response
}

type MaybeGetter<T> = T | (() => T)

export const apiUrl = import.meta.env.PROD
  ? 'https://cledioj.pythonanywhere.com/api/'
  : 'http://192.168.178.11:5000/api/'

export interface FetchOptions {
  auth: boolean
  method: HttpMethod
  immediate?: boolean
  contentType?: string
  body?: string
  headers?: MaybeGetter<HeadersInit>
}

function getToken() {
  const authorized = ref(false)
  if (localStorage.token && new Date(localStorage.tokenExpiration) > new Date()) {
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
    o.headers = typeof opts.headers === 'function' ? opts.headers() : opts.headers

  if (opts.auth) {
    const token = getToken()
    o.headers = Object.assign(o.headers || {},
      { Authorization: `Bearer ${token.token.value}` })
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

  const auth = () => {
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
  }
  const data = ref<null | Promise<T>>(null)

  const execute = async () => {
    const o = buildOptions(opts)
    if (opts.auth) {
      auth()
      if (!authorized.value) {
        error.value = {
          error: 'Not authorized',
          severity: 'error',
        }
        return
      }
    }

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

    data.value = response.value.json()
    isFetching.value = false
  }

  if (opts.immediate)
    await execute()

  return { authorized, isFetching, error, execute, data }
}

export async function usePaginatedFetch<T>(
  urls: string[],
  opts: FetchOptions,
  afterFetch: (a: Awaited<T>) => void | Promise<void>,
) {
  const fetchErrors = shallowRef<FetchError[]>([])
  const data = shallowRef<T[]>([]) // this is only filled if no afterFetch function is provided

  const asyncError = ref()

  const execute = async () => {
    const responses: Promise<T | null>[] = urls.map(async (url) => {
      const { data, error } = await useFetch<T>(
        url, { auth: true, method: 'GET', immediate: true },
      )
      if (error && error.value)
        fetchErrors.value.push(error.value)
      return data.value
    })
    try {
      for await (const res of responses) {
        if (!res)
          continue
        if (afterFetch)
          afterFetch(res)
        else
          data.value.push(res)
      }
    }
    catch (err) {
      if (err instanceof Error) {
        asyncError.value = {
          error: 'Failed to process responses.',
          severity: 'error',
        }
      }
    }
  }

  await execute()

  return { data, execute, fetchErrors, asyncError }
}
