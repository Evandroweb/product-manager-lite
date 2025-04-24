'use client'

import { useState, useEffect } from 'react'
import { ProductList } from '@/components/product-list'
import { ProductForm } from '@/components/product-form'
import { Filters } from '@/components/filters'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useProductStore } from '@/store/product-store'

export default function ProductManagement() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [nameFilter, setNameFilter] = useState('')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [maxPrice, setMaxPrice] = useState(5000)
  const [sortField, setSortField] = useState<string>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [activeTab, setActiveTab] = useState('list')
  const { products, editingProduct } = useProductStore()

  useEffect(() => {
    if (products.length > 0) {
      const highestPrice = Math.max(...products.map(product => product.price))
      const roundedMax = Math.ceil(highestPrice / 1000) * 1000
      setMaxPrice(roundedMax)

      if (priceRange[1] < roundedMax) {
        setPriceRange([priceRange[0], roundedMax])
      }
    }
  }, [products, priceRange])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items)
    setCurrentPage(1)
  }

  const handleEditStart = () => {
    if (isMobile) {
      setActiveTab('form')
    }
  }

  const handleFormSubmitSuccess = () => {
    if (isMobile) {
      setActiveTab('list')
    }
  }

  return (
    <div className='space-y-6'>
      {isMobile ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='list'>Listagem</TabsTrigger>
            <TabsTrigger value='form'>{editingProduct ? 'Editar Produto' : 'Cadastrar'}</TabsTrigger>
          </TabsList>
          <TabsContent value='list' className='space-y-4'>
            <Filters
              nameFilter={nameFilter}
              setNameFilter={setNameFilter}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={maxPrice}
            />
            <ProductList
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              nameFilter={nameFilter}
              priceRange={priceRange}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              onEditStart={handleEditStart}
            />
          </TabsContent>
          <TabsContent value='form'>
            <ProductForm onFormSubmitSuccess={handleFormSubmitSuccess} />
          </TabsContent>
        </Tabs>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <div className='lg:col-span-2 space-y-4'>
            <Filters
              nameFilter={nameFilter}
              setNameFilter={setNameFilter}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              maxPrice={maxPrice}
            />
            <ProductList
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              nameFilter={nameFilter}
              priceRange={priceRange}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              onEditStart={handleEditStart}
            />
          </div>
          <div className='lg:col-span-1'>
            <ProductForm onFormSubmitSuccess={handleFormSubmitSuccess} />
          </div>
        </div>
      )}
    </div>
  )
}
