import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
import { Error } from '../Error'
import { Width } from '../Width'

export interface FileFieldProps {
  name: string
  label?: string
  required?: boolean
  width?: number
  errors: Partial<FieldErrorsImpl>
  register: UseFormRegister<FieldValues>
  accept?: string
}

export const File: React.FC<FileFieldProps> = ({
  name,
  label,
  required,
  width,
  errors,
  register,
  accept = '.pdf,.png,.jpg,.jpeg',
}) => {
  return (
    <Width width={width}>
      <Label htmlFor={name}>
        {label}
        {required && (
          <span className="required">
            * <span className="sr-only">(required)</span>
          </span>
        )}
      </Label>
      <Input id={name} type="file" accept={accept} {...register(name, { required })} />
      {errors[name] && <Error name={name} />}
    </Width>
  )
}
