import { useCallback, useEffect, useSyncExternalStore } from 'react'

/** Тип действия для установки состояния, который может быть либо новым значением, либо функцией, принимающей предыдущее состояние и возвращающей новое значение */
type SetStateAction<T> = T | ((prevState: T) => T)

/**
 * Получает значение из localStorage по заданному ключу.
 * @param key - Ключ для получения значения из localStorage.
 * @returns Значение, сохраненное в localStorage, или null, если значения нет или произошла ошибка.
 */
function getLocalStorageItem(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch (e) {
    console.warn(e)

    return null
  }
}

/**
 * Устанавливает значение в localStorage по заданному ключу.
 * @param key - Ключ для сохранения значения в localStorage.
 * @param value - Значение для сохранения.
 */
function setLocalStorageItem(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn(e)
  }
}

/**
 * Удаляет значение из localStorage по заданному ключу.
 * @param key - Ключ для удаления значения из localStorage.
 */
function removeLocalStorageItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (e) {
    console.warn(e)
  }
}

/**
 * Подписывается на события изменения localStorage.
 * @param callback - Функция, которая будет вызываться при изменении localStorage.
 * @returns Функция для отписки от событий.
 */
function useLocalStorageSubscribe(callback: () => void): () => void {
  window.addEventListener('storage', callback)

  return () => window.removeEventListener('storage', callback)
}

/**
 * Возвращает фиктивное значение для серверного снапшота, так как localStorage недоступен на сервере.
 * @returns null
 */
function getLocalStorageServerSnapshot(): null {
  return null
}

/**
 * Хук для управления состоянием с использованием localStorage.
 * @param key - Ключ для хранения значения в localStorage.
 * @param initialValue - Начальное значение, используемое, если в localStorage нет значения по заданному ключу.
 * @returns Массив, содержащий текущее значение и функцию для его обновления.
 */
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: SetStateAction<T>) => void] {
  const getSnapshot = () => getLocalStorageItem(key)

  const store = useSyncExternalStore(useLocalStorageSubscribe, getSnapshot, getLocalStorageServerSnapshot)

  const setState = useCallback(
    (value: SetStateAction<T>) => {
      try {
        const nextState =
          typeof value === 'function' ? (value as (prevState: T) => T)(JSON.parse(store ?? 'null')) : value

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key)
        } else {
          setLocalStorageItem(key, nextState)
        }
      } catch (e) {
        console.warn(e)
      }
    },
    [key, store],
  )

  useEffect(() => {
    if (getLocalStorageItem(key) === null && typeof initialValue !== 'undefined') {
      setLocalStorageItem(key, initialValue)
    }
  }, [key, initialValue])

  const storedValue = store ? JSON.parse(store) : initialValue

  return [storedValue, setState]
}

export default useLocalStorage
