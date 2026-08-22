const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')

// Load credentials
const env = fs.readFileSync('.env.local', 'utf8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim()
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim()
const supabase = createClient(url, key)

const COMMON_INGREDIENTS = [
  { name: 'Thịt bò', unit: 'kg', price: 250000 },
  { name: 'Thịt heo', unit: 'kg', price: 120000 },
  { name: 'Gà ta', unit: 'kg', price: 150000 },
  { name: 'Hải sản tổng hợp', unit: 'kg', price: 300000 },
  { name: 'Rau củ', unit: 'kg', price: 35000 },
  { name: 'Gạo ST25', unit: 'kg', price: 25000 },
  { name: 'Gia vị tổng hợp', unit: 'g', price: 200 },
  { name: 'Nước sốt độc quyền', unit: 'ml', price: 500 },
]

async function seedFoodCost() {
  console.log('Fetching all menu items...')
  const { data: items, error: fetchErr } = await supabase.from('menu_items').select('*')
  if (fetchErr) {
    console.error('Fetch error:', fetchErr)
    return
  }
  
  console.log(`Found ${items.length} items. Updating ingredients and food cost...`)

  for (const item of items) {
    // Generate 3-4 random ingredients for each item based on its price to ensure a realistic food cost
    // Target food cost percentage is roughly 25-35% of the selling price
    const targetFoodCost = item.price * (0.25 + Math.random() * 0.1) // 25% - 35%
    
    let currentCost = 0
    const ingredients = []
    
    // Pick 3 random ingredients
    const shuffled = [...COMMON_INGREDIENTS].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 3)
    
    for (let i = 0; i < selected.length; i++) {
      const ing = selected[i]
      // Allocate a portion of the target cost
      const costAllocation = i === selected.length - 1 
        ? targetFoodCost - currentCost // Rest of the cost for the last ingredient
        : targetFoodCost * (0.3 + Math.random() * 0.2)
        
      const quantity = +(costAllocation / ing.price).toFixed(2)
      
      ingredients.push({
        name: ing.name,
        unit: ing.unit,
        unit_cost: ing.price,
        quantity: Math.max(0.1, quantity)
      })
      currentCost += (quantity * ing.price)
    }

    const { error: updateErr } = await supabase
      .from('menu_items')
      .update({
        ingredients: ingredients,
        // The trigger trg_calc_food_cost on DB will auto-calculate food_cost if it is working,
        // but just to be safe if they haven't applied the trigger correctly, we also send it:
        food_cost: Math.round(currentCost)
      })
      .eq('id', item.id)

    if (updateErr) {
      console.error(`Error updating item ${item.title}:`, updateErr)
    } else {
      console.log(`Updated "${item.title}" - Food Cost: ${Math.round(currentCost)} VND`)
    }
  }
  console.log('Finished updating all menu items!')
}

seedFoodCost()
