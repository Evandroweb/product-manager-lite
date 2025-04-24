'use client'

import { render } from '@testing-library/react'
import ProductManagement from '@/components/product-management'
import { describe, expect, it, jest } from '@jest/globals'

jest.mock('@/hooks/use-media-query', () => ({
  useMediaQuery: () => false
}))

jest.mock('@/store/product-store', () => ({
  useProductStore: () => ({
    products: [
      {
        id: '1',
        name: 'Smartphone Galaxy S23',
        category: 'Eletrônicos',
        price: 4999.99,
        description: 'Smartphone Samsung Galaxy S23 com 256GB de armazenamento e 8GB de RAM.',
        imageUrl: 'https://placehold.co/400x400/png'
      },
      {
        id: '2',
        name: 'Notebook Dell Inspiron',
        category: 'Computadores',
        price: 3599.9,
        description: 'Notebook Dell Inspiron com processador Intel Core i5, 8GB de RAM e SSD de 256GB.',
        imageUrl: 'https://placehold.co/400x400/png'
      }
    ],
    editingProduct: null,
    addProduct: jest.fn(),
    updateProduct: jest.fn(),
    removeProduct: jest.fn(),
    setEditingProduct: jest.fn()
  })
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const imgProps = { ...props }
    if (imgProps.fill === true) {
      imgProps.fill = 'true'
    }
    return <img {...imgProps} alt={props.alt || ''} />
  }
}))

jest.mock('@/components/ui/slider', () => ({
  Slider: ({ defaultValue, value, onValueChange }: any) => (
    <div data-testid='mock-slider' data-value={JSON.stringify(value || defaultValue)}>
      <button onClick={() => onValueChange && onValueChange([0, 500])}>Change Value</button>
    </div>
  )
}))

describe('ProductManagement', () => {
  it('should render correctly', () => {
    const { container } = render(<ProductManagement />)
    expect(container).toMatchSnapshot()
  })
})
