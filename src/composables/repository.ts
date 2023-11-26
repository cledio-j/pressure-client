import { useDataStore } from '~/stores/data'
import type { Repository } from '~/types'

function sync(preferred: Repository, secondary: Repository) {
  const current = useDataStore().data
  const secondaryData = secondary.getData()
}

export function useRepository() {
  const { settings } = useSettings()
  let repository: Repository
  if (settings.data.preferred === 'server')
    repository = useServerData()
  else if (settings.data.preferred === 'local')
    repository = useLocalData()
  else
    repository = useServerData()

  const sync = () => {
    const toSync: Repository[] = []
  }

  return { repository, sync }
}
