'use client'
import Image from 'next/image'
import { useProductStore } from '@/store/product-store'
import type { Product } from '@/types/product'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Pencil, Trash2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useMediaQuery } from '@/hooks/use-media-query'

interface ProductListProps {
  currentPage: number
  itemsPerPage: number
  nameFilter: string
  priceRange: [number, number]
  sortField: string
  sortDirection: 'asc' | 'desc'
  onSort: (field: string) => void
  onPageChange: (page: number) => void
  onItemsPerPageChange: (items: number) => void
  onEditStart: () => void
}

export function ProductList({
  currentPage,
  itemsPerPage,
  nameFilter,
  priceRange,
  sortField,
  sortDirection,
  onSort,
  onPageChange,
  onItemsPerPageChange,
  onEditStart
}: ProductListProps) {
  const { products, removeProduct, setEditingProduct } = useProductStore()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const filteredProducts = products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(nameFilter.toLowerCase())
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1]
    return nameMatch && priceMatch
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const fieldA = a[sortField as keyof Product]
    const fieldB = b[sortField as keyof Product]

    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA)
    } else {
      return sortDirection === 'asc' ? Number(fieldA) - Number(fieldB) : Number(fieldB) - Number(fieldA)
    }
  })

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    if (isMobile) {
      onEditStart()
    }
  }

  const handleDelete = (id: string) => {
    removeProduct(id)
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className='ml-2 h-4 w-4' />
    return sortDirection === 'asc' ? <ArrowUp className='ml-2 h-4 w-4' /> : <ArrowDown className='ml-2 h-4 w-4' />
  }

  return (
    <div className='space-y-4'>
      {isMobile ? (
        <div className='space-y-4'>
          {paginatedProducts.length === 0 ? (
            <div className='text-center py-8 text-muted-foreground'>Nenhum produto encontrado</div>
          ) : (
            paginatedProducts.map(product => (
              <Card key={product.id}>
                <CardContent className='p-4'>
                  <div className='flex items-center space-x-4'>
                    <div className='relative h-16 w-16 overflow-hidden rounded-md'>
                      <Image
                        src={product.imageUrl || '/placeholder.svg?height=64&width=64'}
                        alt={product.name}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='flex-1'>
                      <h3 className='font-medium'>{product.name}</h3>
                      <p className='text-sm text-muted-foreground'>{product.category}</p>
                      <p className='font-medium'>{formatCurrency(product.price)}</p>
                    </div>
                    <div className='flex space-x-2'>
                      <Button variant='outline' size='icon' onClick={() => handleEdit(product)}>
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button variant='outline' size='icon' onClick={() => handleDelete(product.id)}>
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[100px]'>Imagem</TableHead>
                <TableHead>
                  <button className='flex items-center' onClick={() => onSort('name')}>
                    Nome
                    <SortIcon field='name' />
                  </button>
                </TableHead>
                <TableHead>
                  <button className='flex items-center' onClick={() => onSort('category')}>
                    Categoria
                    <SortIcon field='category' />
                  </button>
                </TableHead>
                <TableHead>
                  <button className='flex items-center' onClick={() => onSort('price')}>
                    Preço
                    <SortIcon field='price' />
                  </button>
                </TableHead>
                <TableHead className='w-[150px]'>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className='h-24 text-center'>
                    Nenhum produto encontrado
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className='relative h-12 w-12 overflow-hidden rounded-md'>
                        <Image
                          src={product.imageUrl || '/placeholder.svg?height=48&width=48'}
                          alt={product.name}
                          fill
                          className='object-cover'
                        />
                      </div>
                    </TableCell>
                    <TableCell className='font-medium'>{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>
                      <div className='flex space-x-2'>
                        <Button variant='outline' size='sm' onClick={() => handleEdit(product)}>
                          <Pencil className='h-4 w-4 mr-2' />
                          Editar
                        </Button>
                        <Button variant='outline' size='sm' onClick={() => handleDelete(product.id)}>
                          <Trash2 className='h-4 w-4 mr-2' />
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm text-muted-foreground'>
            Exibindo {paginatedProducts.length} de {filteredProducts.length} produtos
          </p>
          <Select value={itemsPerPage.toString()} onValueChange={value => onItemsPerPageChange(Number(value))}>
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder='5' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='5'>5</SelectItem>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='50'>50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <span className='text-sm'>
            Página {currentPage} de {Math.max(1, totalPages)}
          </span>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
