export interface Ingredient {
  name: string
  quantity: number | null
  unit: string
  unit_cost?: number
  notes?: string
}

export interface IngredientGroup {
  category: string
  items: Ingredient[]
}

export interface MenuItem {
  id: string
  title: string
  category: string
  price: number
  description: string
  image_url: string
  is_available: boolean
  ingredients: Ingredient[]
  food_cost: number
  food_cost_percentage: number   // generated ở DB, chỉ đọc trên FE
  created_at: string
  updated_at: string
}

// Legacy support - map to new interface
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
  ingredients?: any[]
  food_cost?: number
}

export interface CartItem extends FoodItem {
  quantity: number
}
