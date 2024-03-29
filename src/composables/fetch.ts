import type { Note } from '~/stores/notifications'

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

// @ts-expect-error -- meta.env
export const apiUrl = import.meta.env.PROD
  ? 'https://cledioj.pythonanywhere.com/api/'
  : 'http://192.168.178.37:5000/api/'

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
  // throw new Error('not authorized')
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
    if (token) {
      o.headers = Object.assign(o.headers || {},
        { Authorization: `Bearer ${token.token.value}` })
    }
  }

  if (opts.contentType) {
    Object.assign(o.headers || {},
      { 'Content-Type': opts.contentType })
  }
  return o
}

export async function useFetch<T>(resource: string, opts: FetchOptions) {
  const isFetching = ref(false)
  const error = ref<undefined | Note>()
  const authorized = ref(false)

  const auth = () => {
    try {
      authorized.value = getToken()?.authorized.value || false
    }
    catch (err) {
      if (err instanceof Error) {
        error.value = {
          name: err.name,
          severity: 'error',
          description: err.message,
          actions: [],
          original: err,
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
        const router = useRouter()
        error.value = {
          name: 'error.notAuthorized',
          severity: 'error',
          description: 'error.noAuthDescription',
          actions: [{ name: 'Login', action: () => router.push('/auth'), close: true }],
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
          name: 'error.network',
          severity: 'error',
          description: err.message,
          original: err,
        }
      }
      return
    }

    if (!response || !response.value) {
      error.value = {
        name: 'error.network',
        severity: 'fatal',
      }
      return
    }
    if (!response.value.ok) {
      error.value = {
        name: 'error.fetchFailure',
        severity: 'error',
        original: response.value,
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
  const fetchErrors = shallowRef<Note[]>([])
  const data = shallowRef<T[]>([]) // this is only filled if no afterFetch function is provided

  const asyncError = ref<Note | undefined>()

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
          name: 'error.backgroundFetchFail',
          severity: 'error',
          actions: [],
        }
      }
    }
  }

  await execute()

  return { data, execute, fetchErrors, asyncError }
}
