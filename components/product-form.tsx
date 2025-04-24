'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useProductStore } from '@/store/product-store'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ProductFormProps {
  onFormSubmitSuccess?: () => void
}

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'O nome deve ter pelo menos 3 caracteres.'
  }),
  category: z.string().min(2, {
    message: 'A categoria deve ter pelo menos 2 caracteres.'
  }),
  price: z.coerce.number().positive({
    message: 'O preço deve ser um número positivo.'
  }),
  description: z.string().min(10, {
    message: 'A descrição deve ter pelo menos 10 caracteres.'
  }),
  imageUrl: z.string().url({
    message: 'Informe uma URL válida para a imagem.'
  })
})

export function ProductForm({ onFormSubmitSuccess }: ProductFormProps) {
  const { addProduct, editingProduct, updateProduct, setEditingProduct } = useProductStore()
  const [priceDisplay, setPriceDisplay] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      description: '',
      imageUrl: ''
    }
  })

  useEffect(() => {
    if (editingProduct) {
      form.reset({
        name: editingProduct.name,
        category: editingProduct.category,
        price: editingProduct.price,
        description: editingProduct.description,
        imageUrl: editingProduct.imageUrl
      })

      setPriceDisplay(formatPriceForDisplay(editingProduct.price))
    } else {
      setPriceDisplay('')
    }
  }, [editingProduct, form])

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    const withoutCommas = inputValue.replace(/,/g, '')

    const filteredValue = withoutCommas.replace(/[^\d]/g, '')

    let formattedValue = ''
    if (filteredValue.length > 0) {
      const cents = filteredValue.slice(-2).padStart(2, '0')
      const reais = filteredValue.slice(0, -2) || '0'

      formattedValue = Number(reais).toLocaleString('pt-BR') + ',' + cents
    }

    setPriceDisplay(formattedValue)

    const numericValue = formattedValue ? Number(formattedValue.replace(/\./g, '').replace(',', '.')) : 0
    form.setValue('price', numericValue)
  }

  const formatPriceForDisplay = (price: number): string => {
    const cents = Math.round(price * 100)

    const reaisPart = Math.floor(cents / 100)
    const centsPart = cents % 100

    return reaisPart.toLocaleString('pt-BR') + ',' + centsPart.toString().padStart(2, '0')
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (editingProduct) {
      updateProduct({
        ...values,
        id: editingProduct.id
      })
      setEditingProduct(null)

      if (onFormSubmitSuccess) {
        onFormSubmitSuccess()
      }
    } else {
      addProduct({
        ...values,
        id: crypto.randomUUID()
      })
    }

    form.reset({
      name: '',
      category: '',
      price: 0,
      description: '',
      imageUrl: ''
    })
    setPriceDisplay('')
  }

  function handleCancel() {
    setEditingProduct(null)
    form.reset({
      name: '',
      category: '',
      price: 0,
      description: '',
      imageUrl: ''
    })
    setPriceDisplay('')

    if (onFormSubmitSuccess) {
      onFormSubmitSuccess()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder='Nome do produto' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <Input placeholder='Categoria do produto' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field: { onChange, ...restField } }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input placeholder='0,00' value={priceDisplay} onChange={handlePriceChange} {...restField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Descrição do produto' className='resize-none' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='imageUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem</FormLabel>
                  <FormControl>
                    <Input placeholder='https://exemplo.com/imagem.jpg' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-end space-x-2'>
              {editingProduct && (
                <Button type='button' variant='outline' onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
              <Button type='submit'>{editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
