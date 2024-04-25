export enum LocalStorageKey {
  TOKEN,
  UPK_ID,
  UDM_ID,
  DEGASSER_ID,
  UDCH_ID,
  USER_NAME,
  OPERATIONS_SECONDS_VISIBLE,
  IP,
  NOTIFICATIONS,
  USER_SELECTED_PAGES_MELT_PASSPORT,
  CLOSED,
  USER_NEW_YEAR_GAME,
}

const convertKey = (key: LocalStorageKey): string => (LocalStorageKey[key] as string).toLowerCase()

export const getLocalStorageString = (key: LocalStorageKey): string | null => {
  const result = localStorage.getItem(convertKey(key))

  return result || result === '' ? result : null
}

export const setLocalStorageString = (key: LocalStorageKey, value: string): void => {
  localStorage.setItem(convertKey(key), value)
}

export const getLocalStorageBoolean = (key: LocalStorageKey): boolean => {
  return Boolean(getLocalStorageString(key))
}
