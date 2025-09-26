import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LoadingSpinner, { FullPageLoader } from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Analyzing..." />)
    expect(screen.getByText('Analyzing...')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { container } = render(<LoadingSpinner size="lg" />)
    expect(container.querySelector('.w-12.h-12')).toBeInTheDocument()
  })

  it('renders without text when text is null', () => {
    render(<LoadingSpinner text={null} />)
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })
})

describe('FullPageLoader', () => {
  it('renders full page loader', () => {
    render(<FullPageLoader />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom text', () => {
    render(<FullPageLoader text="Processing..." />)
    expect(screen.getByText('Processing...')).toBeInTheDocument()
  })
})
