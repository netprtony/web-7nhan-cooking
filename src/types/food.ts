export interface FoodItem {
    id: string
    name: string
    description: string
    price: number
    image: string
    category?: string
    isNew?: boolean
    isBestseller?: boolean
    unit?: string
}

export interface CartItem extends FoodItem {
    quantity: number
}
