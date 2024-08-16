/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react'

type Validator<T> = (value: T, values?: Record<string, T>) => string | null
type AsyncValidator<T> = (value: T, values?: Record<string, T>) => Promise<string | null>

/** Конфигурация поля формы */
interface FieldConfig<T> {
  /** Начальное значение поля */
  initialValue: T
  /** Синхронная функция валидации поля */
  validator?: Validator<T>
  /** Асинхронная функция валидации поля */
  asyncValidator?: AsyncValidator<T>
}

/** Конфигурация хука useForm */
interface UseFormConfig<T> {
  /** Объект, содержащий конфигурации полей формы */
  fields: Record<keyof T, FieldConfig<T[keyof T]>>
  /** Функция, вызываемая при отправке формы */
  onSubmit: (values: T) => void | Promise<void>
  /** Включает валидацию при изменении поля */
  validateOnChange?: boolean
  /** Включает валидацию при потере фокуса поля */
  validateOnBlur?: boolean
  /** Ключ для сохранения состояния формы в localStorage */
  cacheKey?: string
}

/** Состояние поля формы */
interface FormField<T> {
  /** Значение поля */
  value: T
  /** Текущая ошибка валидации поля */
  error: string | null
  /** Указывает, было ли поле тронуто */
  touched: boolean
}

/** Возвращаемое значение хука useForm */
interface UseFormReturn<T> {
  /** Объект, содержащий значения всех полей формы */
  values: T
  /** Объект, содержащий ошибки валидации всех полей формы */
  errors: Record<keyof T, string | null>
  /** Объект, содержащий информацию о том, были ли поля формы тронуты */
  touched: Record<keyof T, boolean>
  /** Указывает, происходит ли в данный момент отправка формы */
  isSubmitting: boolean
  /** Указывает, валидна ли форма */
  isValid: boolean
  /** Функция для обработки изменений в поле формы */
  handleChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Функция для обработки события потери фокуса поля формы */
  handleBlur: (field: keyof T) => () => void
  /** Функция для обработки отправки формы */
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  /** Функция для сброса формы к исходному состоянию */
  resetForm: () => void
  /** Функция для валидации конкретного поля формы */
  validateField: (field: keyof T) => Promise<void>
  /** Функция для валидации всей формы */
  validateForm: () => Promise<boolean>
}

/**
 * @name useForm
 * @description Хук для управления состоянием формы с поддержкой синхронной и асинхронной валидации полей,
 * отправки данных и сохранения состояния формы в localStorage.
 * @category Forms
 *
 * @param {UseFormConfig<T>} config Конфигурация для инициализации формы
 * @returns {UseFormReturn<T>} Объект, содержащий текущее состояние формы и функции для взаимодействия с ней
 *
 * @example
 * const { values, errors, handleChange, handleBlur, handleSubmit, resetForm } = useForm({
 *   fields: {
 *     username: {
 *       initialValue: '',
 *       validator: (value) => value ? null : 'Username is required',
 *     },
 *     email: {
 *       initialValue: '',
 *       validator: (value) => /\S+@\S+\.\S+/.test(value) ? null : 'Invalid email',
 *     },
 *   },
 *   onSubmit: (values) => console.log(values),
 * });
 *
 * @example
 * <form onSubmit={handleSubmit}>
 *   <input name="username" value={values.username} onChange={handleChange('username')} onBlur={handleBlur('username')} />
 *   {errors.username && <span>{errors.username}</span>}
 *   <input name="email" value={values.email} onChange={handleChange('email')} onBlur={handleBlur('email')} />
 *   {errors.email && <span>{errors.email}</span>}
 *   <button type="submit">Submit</button>
 * </form>
 */
function useForm<T extends Record<string, any>>(config: UseFormConfig<T>): UseFormReturn<T> {
  const { fields, onSubmit, validateOnChange = true, validateOnBlur = true, cacheKey } = config

  // Инициализация состояния формы
  const [formState, setFormState] = useState<Record<keyof T, FormField<T[keyof T]>>>(
    Object.keys(fields).reduce(
      (acc, field) => {
        acc[field as keyof T] = {
          value: fields[field as keyof T].initialValue,
          error: null,
          touched: false,
        }

        return acc
      },
      {} as Record<keyof T, FormField<T[keyof T]>>,
    ),
  )

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Восстановление состояния формы из localStorage при наличии cacheKey
  useEffect(() => {
    if (cacheKey) {
      const cachedValues = localStorage.getItem(cacheKey)
      if (cachedValues) {
        setFormState((prev) => ({
          ...prev,
          ...JSON.parse(cachedValues),
        }))
      }
    }
  }, [cacheKey])

  // Сохранение состояния формы в localStorage при наличии cacheKey
  useEffect(() => {
    if (cacheKey) {
      localStorage.setItem(cacheKey, JSON.stringify(formState))
    }
  }, [formState, cacheKey])

  // Валидация отдельного поля формы
  const validateField = useCallback(
    async (field: keyof T): Promise<void> => {
      const { validator, asyncValidator } = fields[field]
      const value = formState[field].value

      let error: string | null = null
      if (validator) {
        error = validator(value, getValues())
      }
      if (!error && asyncValidator) {
        error = await asyncValidator(value, getValues())
      }

      setFormState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          error,
        },
      }))
    },
    [fields, formState],
  )

  // Обработка изменений поля формы
  const handleChange = useCallback(
    (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value as T[keyof T]
      setFormState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          value,
          touched: true,
          error: prev[field].error, // сохраняем ошибку пока не проверим заново
        },
      }))

      if (validateOnChange) {
        validateField(field)
      }
    },
    [validateOnChange, validateField],
  )

  // Обработка потери фокуса поля формы
  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setFormState((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          touched: true,
        },
      }))

      if (validateOnBlur) {
        validateField(field)
      }
    },
    [validateOnBlur, validateField],
  )

  // Валидация всей формы
  const validateForm = useCallback(async (): Promise<boolean> => {
    let isValid = true
    for (const field of Object.keys(fields) as Array<keyof T>) {
      await validateField(field)
      if (formState[field].error) {
        isValid = false
      }
    }

    return isValid
  }, [fields, formState, validateField])

  // Обработка отправки формы
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setIsSubmitting(true)

      const isValid = await validateForm()
      if (isValid) {
        try {
          await onSubmit(getValues())
        } catch (error) {
          console.error('Ошибка при отправке формы', error)
        }
      }

      setIsSubmitting(false)
    },
    [validateForm, onSubmit],
  )

  // Сброс формы к исходному состоянию
  const resetForm = useCallback(() => {
    setFormState(
      Object.keys(fields).reduce(
        (acc, field) => {
          acc[field as keyof T] = {
            value: fields[field as keyof T].initialValue,
            error: null,
            touched: false,
          }

          return acc
        },
        {} as Record<keyof T, FormField<T[keyof T]>>,
      ),
    )

    if (cacheKey) {
      localStorage.removeItem(cacheKey)
    }
  }, [fields, cacheKey])

  // Получение текущих значений всех полей формы
  const getValues = (): T =>
    Object.keys(formState).reduce((acc, field) => {
      acc[field as keyof T] = formState[field as keyof T].value

      return acc
    }, {} as T)

  return {
    values: getValues(),
    errors: Object.keys(formState).reduce(
      (acc, field) => {
        acc[field as keyof T] = formState[field as keyof T].error

        return acc
      },
      {} as Record<keyof T, string | null>,
    ),
    touched: Object.keys(formState).reduce(
      (acc, field) => {
        acc[field as keyof T] = formState[field as keyof T].touched

        return acc
      },
      {} as Record<keyof T, boolean>,
    ),
    isSubmitting,
    isValid: Object.keys(formState).every((field) => formState[field as keyof T].error === null),
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    validateField,
    validateForm,
  }
}

export default useForm
