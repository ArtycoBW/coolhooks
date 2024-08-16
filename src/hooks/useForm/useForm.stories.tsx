// src/hooks/useForm/useForm.stories.tsx

import { Meta, StoryFn } from '@storybook/react'
import useForm from '../useForm/useForm'
import React from 'react'
import classes from './index.module.scss'

interface FormValues {
  username: string
  email: string
  password: string
}

const Demo = () => {
  const form = useForm<FormValues>({
    fields: {
      username: {
        initialValue: '',
        validator: (value) => (value.trim() ? null : 'Username is required'),
      },
      email: {
        initialValue: '',
        validator: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'Invalid email address'),
      },
      password: {
        initialValue: '',
        asyncValidator: async (value) => {
          return value.length >= 6 ? null : 'Password must be at least 6 characters long'
        },
      },
    },
    onSubmit: async (values) => {
      console.log('Form submitted:', values)
    },
    validateOnChange: true,
    validateOnBlur: true,
    cacheKey: 'example-form',
  })

  return (
    <form onSubmit={form.handleSubmit} className={classes.form}>
      <div className={classes.fields}>
        <>
          <label>
            Username:
            <input
              name="username"
              value={form.values.username}
              onChange={form.handleChange('username')}
              onBlur={form.handleBlur('username')}
            />
          </label>
          {form.errors.username && <div style={{ color: '#029cfd' }}>{form.errors.username}</div>}
        </>

        <>
          <label>
            Email:
            <input
              name="email"
              value={form.values.email}
              onChange={form.handleChange('email')}
              onBlur={form.handleBlur('email')}
            />
          </label>
          {form.errors.email && <div style={{ color: '#029cfd' }}>{form.errors.email}</div>}
        </>

        <>
          <label>
            Password:
            <input
              name="password"
              type="password"
              value={form.values.password}
              onChange={form.handleChange('password')}
              onBlur={form.handleBlur('password')}
            />
          </label>
          {form.errors.password && <div style={{ color: '#029cfd' }}>{form.errors.password}</div>}
        </>

        <div className={classes.buttons}>
          <button type="submit" disabled={form.isSubmitting}>
            Submit
          </button>

          <button type="button" onClick={form.resetForm}>
            Reset
          </button>
        </div>
      </div>
    </form>
  )
}

export default {
  title: 'Хуки/useForm',
  component: Demo,
} as Meta

const Template: StoryFn = () => <Demo />

export const Default = Template.bind({})
