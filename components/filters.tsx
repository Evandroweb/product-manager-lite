'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

interface FiltersProps {
  nameFilter: string
  setNameFilter: (value: string) => void
  priceRange: [number, number]
  setPriceRange: (value: [number, number]) => void
  maxPrice: number
}

export function Filters({ nameFilter, setNameFilter, priceRange, setPriceRange, maxPrice }: FiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='name-filter'>Nome</Label>
          <Input
            id='name-filter'
            placeholder='Filtrar por nome'
            value={nameFilter}
            onChange={e => setNameFilter(e.target.value)}
          />
        </div>
        <div className='space-y-2'>
          <div className='flex justify-between'>
            <Label>Faixa de Preço</Label>
            <span className='text-sm text-muted-foreground'>
              {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
            </span>
          </div>
          <Slider
            defaultValue={[0, maxPrice]}
            min={0}
            max={maxPrice}
            step={maxPrice / 100}
            value={[priceRange[0], priceRange[1]]}
            onValueChange={value => setPriceRange([value[0], value[1]])}
          />
        </div>
      </CardContent>
    </Card>
  )
}
