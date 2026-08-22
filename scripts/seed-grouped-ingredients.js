const fs = require('fs')
const { createClient } = require('@supabase/supabase-js')

// Load credentials
const env = fs.readFileSync('.env.local', 'utf8')
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim()
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim()
const supabase = createClient(url, key)

const GROUPED_INGREDIENTS = [
  {
    "category": "Thịt và xương",
    "items": [
      {
        "name": "Xương ống bò",
        "quantity": 1.5,
        "unit": "kg",
        "notes": "Rửa sạch, chần sơ nước sôi"
      },
      {
        "name": "Thịt thăn bò (dùng ăn tái)",
        "quantity": 300,
        "unit": "g",
        "notes": "Thái lát mỏng"
      },
      {
        "name": "Nạm bò",
        "quantity": 400,
        "unit": "g",
        "notes": "Luộc chín tới, thái lát"
      }
    ]
  },
  {
    "category": "Gia vị tạo hương",
    "items": [
      {
        "name": "Hoa hồi (tai vị)",
        "quantity": 3,
        "unit": "cái",
        "notes": "Rang thơm"
      },
      {
        "name": "Thảo quả",
        "quantity": 1,
        "unit": "quả",
        "notes": "Nướng đập dập"
      },
      {
        "name": "Quế thanh",
        "quantity": 5,
        "unit": "g",
        "notes": "Rang thơm"
      },
      {
        "name": "Gừng tươi",
        "quantity": 50,
        "unit": "g",
        "notes": "Nướng cháy vỏ, cạo sạch, đập dập"
      },
      {
        "name": "Hành khô",
        "quantity": 4,
        "unit": "củ",
        "notes": "Nướng thơm"
      }
    ]
  },
  {
    "category": "Gia vị nêm nếm",
    "items": [
      {
        "name": "Nước mắm truyền thống",
        "quantity": 3,
        "unit": "muỗng canh",
        "notes": "Thêm vào cuối cùng khi nước dùng đã sôi"
      },
      {
        "name": "Muối hạt",
        "quantity": 1.5,
        "unit": "muỗng canh",
        "notes": ""
      },
      {
        "name": "Đường phèn",
        "quantity": 20,
        "unit": "g",
        "notes": ""
      }
    ]
  },
  {
    "category": "Ăn kèm & Rau thơm",
    "items": [
      {
        "name": "Bánh phở tươi",
        "quantity": 500,
        "unit": "g",
        "notes": "Chần sơ trước khi cho vào tô"
      },
      {
        "name": "Hành lá",
        "quantity": 50,
        "unit": "g",
        "notes": "Thái nhỏ, chẻ phần đầu hành"
      },
      {
        "name": "Ngò gai (mùi tàu)",
        "quantity": 30,
        "unit": "g",
        "notes": "Thái nhỏ"
      },
      {
        "name": "Chanh, ớt tươi, tương đen, tương ớt",
        "quantity": null,
        "unit": "tùy khẩu vị",
        "notes": "Dùng kèm"
      }
    ]
  }
]

async function seedGroupedFoodCost() {
  console.log('Fetching all menu items...')
  const { data: items, error: fetchErr } = await supabase.from('menu_items').select('*')
  if (fetchErr) {
    console.error('Fetch error:', fetchErr)
    return
  }
  
  console.log(`Updating ${items.length} items with the grouped ingredients JSON...`)

  for (const item of items) {
    const { error: updateErr } = await supabase
      .from('menu_items')
      .update({
        ingredients: GROUPED_INGREDIENTS,
        food_cost: item.price * 0.35 // fixed fake food cost
      })
      .eq('id', item.id)

    if (updateErr) {
      console.error(`Error updating item ${item.title}:`, updateErr)
    } else {
      console.log(`Updated "${item.title}"`)
    }
  }
  console.log('Finished updating all menu items!')
}

seedGroupedFoodCost()
