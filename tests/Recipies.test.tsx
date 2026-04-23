import React from 'react'
import { StrictMode } from 'react'
import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { setRecipies, addRecipie, deleteRecipie } from '@/redux/features/recipieSlice'
import Recipies from '@/components/Recipies'
import ShowRecipie from '@/components/ShowRecipie'
import AddRecipieForm from '@/components/AddRecipieForm'
import Navbar from '@/components/Navbar'
import ModifyRecipieForm from '@/components/ModifyRecipieForm'
import { WhichOpen, Units } from '@/components/enums'

afterEach(cleanup)

interface MockRecipe {
    _id: string
    name: string
    ingredients: Array<{ name: string; value: number; type: string }>
    instructions: string[]
    image: string
    servings: number
    cals: number
}

describe('Recipe Application', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        global.fetch = vi.fn().mockImplementation((url) => {
            if (url === '/api/conversion') {
                return Promise.resolve({
                    json: () => Promise.resolve([
                        { name: 'flour', unit: 'g', to: 'cups', factor: 0.24 },
                        { name: 'water', unit: 'g', to: 'ml', factor: 1 },
                        { name: 'sugar', unit: 'g', to: 'oz', factor: 0.035 }
                    ])
                })
            } else if (url === '/api/recipie') {
                return Promise.resolve({
                    json: () => Promise.resolve([{
                        _id: '1',
                        name: 'Test Recipe',
                        ingredients: [{ name: 'Flour', value: 1, type: 'cups' }],
                        instructions: ['Mix everything'],
                        image: '',
                        servings: 4,
                        cals: 200
                    }])
                })
            }
            return Promise.resolve({
                json: () => Promise.resolve([])
            })
        })
    })

    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>
            <StrictMode>
                <div>{children}</div>
            </StrictMode>
        </Provider>
    )

    describe('Recipe List', () => {
        it('renders recipe list', async () => {
            render(<Wrapper>
                <Navbar />
                <Recipies />
            </Wrapper>)
            await waitFor(() => {
                expect(screen.getByText('Test Recipe')).toBeInTheDocument()
            })
            const menuButton = screen.getByRole('button')
            fireEvent.click(menuButton)
            const addButton = screen.getByRole('button', { name: /add recipie/i })
            expect(addButton).toBeInTheDocument()
        })

        it('opens add modal', async () => {
            render(<Wrapper>
                <Navbar />
                <Recipies />
            </Wrapper>)
            await waitFor(() => {
                expect(screen.getByText('Test Recipe')).toBeInTheDocument()
            })
            const menuButton = screen.getByRole('button')
            fireEvent.click(menuButton)
            const addButton = screen.getByRole('button', { name: /add recipie/i })
            fireEvent.click(addButton)
            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument()
            })
        })
    })

    describe('Add Recipe Form', () => {
     it('renders form fields', () => {
            render(<Wrapper><AddRecipieForm conversions={[
                { _id: '1', name: 'flour', unit: Units.g, toGrams: 0.24 },
                { _id: '2', name: 'water', unit: Units.g, toGrams: 1 },
                { _id: '3', name: 'sugar', unit: Units.g, toGrams: 0.035 }
            ]} /></Wrapper>)
            expect(screen.getAllByLabelText(/name/i)[0]).toBeInTheDocument()
            expect(screen.getAllByLabelText(/servings/i)[0]).toBeInTheDocument()
            expect(screen.getAllByLabelText(/calories/i)[0]).toBeInTheDocument()
            const ingredientText = screen.getByText(/ingredient/i)
            expect(ingredientText).toBeInTheDocument()
        })

   it('validates required fields', async () => {
            render(<Wrapper>
                <Navbar />
                <AddRecipieForm conversions={[
                    { _id: '1', name: 'flour', unit: Units.g, toGrams: 0.24 }
                ]} />
            </Wrapper>)
            const nameInput = screen.getAllByLabelText(/name/i)[0]
            fireEvent.change(nameInput, { target: { value: '' } })
            fireEvent.blur(nameInput)
            await waitFor(() => {
                expect(nameInput).toHaveAttribute('aria-invalid', 'true')
            })
        })

        it('renders unit dropdowns', () => {
            render(<Wrapper><AddRecipieForm conversions={[
                { _id: '1', name: 'flour', unit: Units.g, toGrams: 0.24 },
                { _id: '2', name: 'water', unit: Units.g, toGrams: 1 },
                { _id: '3', name: 'sugar', unit: Units.g, toGrams: 0.035 }
            ]} /></Wrapper>)
            const selectTrigger = screen.getByRole('combobox')
            fireEvent.click(selectTrigger)
            const gOption = screen.getAllByRole('option', { name: /g/i })
            expect(gOption[0]).toBeInTheDocument()
            expect(gOption[1]).toBeInTheDocument()
            const cupOption = screen.getAllByRole('option', { name: /cup/i })
            expect(cupOption[0]).toBeInTheDocument()
            const tbspOption = screen.getAllByRole('option', { name: /tbsp/i })
            expect(tbspOption[0]).toBeInTheDocument()
            const tspOption = screen.getAllByRole('option', { name: /tsp/i })
            expect(tspOption[0]).toBeInTheDocument()
        })
    })

    describe('Modify Recipe Form', () => {
        const mockRecipe: MockRecipe = {
            _id: '1',
            name: 'Chocolate Chip Cookies',
            ingredients: [{ name: 'Flour', value: 2, type: 'cups' }],
            instructions: ['Mix ingredients'],
            image: 'cookies.jpg',
            servings: 24,
            cals: 150
        }

        it('displays recipe data', () => {
            render(<Wrapper><ModifyRecipieForm recipie={mockRecipe} conversions={[]} setModMode={() => {}} setRecipie={() => {}} /></Wrapper>)
            const nameInput = screen.getAllByPlaceholderText('')[0]
            expect(nameInput).toHaveValue('Chocolate Chip Cookies')
            const servingsInput = screen.getAllByLabelText(/servings/i)[0]
            expect(servingsInput).toHaveValue(24)
            const calsInput = screen.getAllByLabelText(/calories/i)[0]
            expect(calsInput).toHaveValue(150)
        })
    })

    describe('Show Recipe', () => {
        const mockRecipe: MockRecipe = {
            _id: '1',
            name: 'Chocolate Chip Cookies',
            ingredients: [{ name: 'Flour', value: 2, type: 'cups' }],
            instructions: ['Mix ingredients'],
            image: 'cookies.jpg',
            servings: 24,
            cals: 150
        }

        it('displays recipe image', () => {
            render(<Wrapper><ShowRecipie recipie={mockRecipe} conversions={[]} /></Wrapper>)
            expect(screen.getByAltText('cookies.jpg')).toBeInTheDocument()
        })

        it('displays batch size selector', () => {
            render(<Wrapper><ShowRecipie recipie={mockRecipe} conversions={[]} /></Wrapper>)
            expect(screen.getByText('Batch size:')).toBeInTheDocument()
        })

        it('displays servings', () => {
            render(<Wrapper><ShowRecipie recipie={mockRecipe} conversions={[]} /></Wrapper>)
            expect(screen.getByText('Servings: 24')).toBeInTheDocument()
        })

        it('displays ingredients', () => {
            render(<Wrapper><ShowRecipie recipie={mockRecipe} conversions={[]} /></Wrapper>)
            expect(screen.getByText('Flour - 2 cups')).toBeInTheDocument()
        })

        it('displays instructions', () => {
            render(<Wrapper><ShowRecipie recipie={mockRecipe} conversions={[]} /></Wrapper>)
            expect(screen.getByText('1: Mix ingredients')).toBeInTheDocument()
        })

        it('opens modify dialog', () => {
            render(<Wrapper><ShowRecipie recipie={mockRecipe} conversions={[]} /></Wrapper>)
            const modifyBtn = screen.getByRole('button', { name: /modify/i })
            fireEvent.click(modifyBtn)
            const nameInput = screen.getAllByPlaceholderText('')[0]
            expect(nameInput).toHaveValue('Chocolate Chip Cookies')
        })

        it('opens delete dialog', () => {
            render(<Wrapper><ShowRecipie recipie={mockRecipe} conversions={[]} /></Wrapper>)
            const deleteBtn = screen.getByRole('button', { name: /delete recipe/i })
            fireEvent.click(deleteBtn)
            expect(screen.getByText('Delete Recipe')).toBeInTheDocument()
        })

        it('closes delete dialog on cancel', () => {
            render(<Wrapper><ShowRecipie recipie={mockRecipe} conversions={[]} /></Wrapper>)
            const deleteBtn = screen.getByRole('button', { name: /delete recipe/i })
            fireEvent.click(deleteBtn)
            const cancelButton = screen.getByRole('button', { name: /cancel/i })
            fireEvent.click(cancelButton)
            expect(screen.queryByText('Delete Recipe')).not.toBeInTheDocument()
        })

        it('calls delete API on confirm', async () => {
            const fetchSpy = vi.spyOn(global, 'fetch')
            
            render(<Wrapper><ShowRecipie recipie={mockRecipe} conversions={[]} /></Wrapper>)
            
            const deleteBtn = screen.getByRole('button', { name: /delete recipe/i })
            fireEvent.click(deleteBtn)
            
            const confirmBtn = screen.getByRole('button', { name: /delete/i })
            fireEvent.click(confirmBtn)
            
            await waitFor(() => {
                expect(fetchSpy).toHaveBeenCalledWith('/api/recipie', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: expect.any(String)
                })
            })
        })
    })
})
