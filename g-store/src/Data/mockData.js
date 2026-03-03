

export const CATEGORIES= [
  { id: 'fruits', name: 'Fruits', icon: 'Apple', color: 'bg-red-50 text-red-500' },
  { id: 'vegetables', name: 'Vegetables', icon: 'LeafyGreen', color: 'bg-emerald-50 text-emerald-500' },
  { id: 'dairy', name: 'Dairy & Eggs', icon: 'Milk', color: 'bg-blue-50 text-blue-500' },
  { id: 'bakery', name: 'Bakery', icon: 'Croissant', color: 'bg-amber-50 text-amber-500' },
  { id: 'beverages', name: 'Beverages', icon: 'Coffee', color: 'bg-indigo-50 text-indigo-500' },
  { id: 'snacks', name: 'Snacks', icon: 'Cookie', color: 'bg-orange-50 text-orange-500' },
  { id: 'meat', name: 'Meat', icon: 'Beef', color: 'bg-rose-50 text-rose-500' },
  { id: 'seafood', name: 'Seafood', icon: 'Fish', color: 'bg-cyan-50 text-cyan-500' },
  { id: 'frozen', name: 'Frozen Foods', icon: 'Snowflake', color: 'bg-sky-50 text-sky-500' },
  { id: 'household', name: 'Household', icon: 'Home', color: 'bg-slate-50 text-slate-500' },
];

const generateProducts = () => {
  const products = [];
  const categories = CATEGORIES.map(c => c.id);
  
  const names = {
    fruits: ['Organic Apple', 'Fresh Banana', 'Sweet Mango', 'Red Strawberries', 'Blueberries', 'Avocado', 'Pineapple', 'Grapes', 'Kiwi'],
    vegetables: ['Carrot Bunch', 'Broccoli', 'Spinach', 'Tomato Roma', 'Onion Red', 'Potato Russet', 'Bell Pepper', 'Cucumber', 'Garlic'],
    dairy: ['Whole Milk', 'Cheddar Cheese', 'Greek Yogurt', 'Free Range Eggs', 'Butter Salted', 'Heavy Cream', 'Sour Cream', 'Cottage Cheese'],
    bakery: ['Sourdough Bread', 'Whole Wheat Bread', 'Butter Croissant', 'Chocolate Muffin', 'Bagels', 'Gluten Free Bread', 'Donut Glazed'],
    beverages: ['Orange Juice', 'Coconut Water', 'Cold Brew Coffee', 'Green Tea', 'Sparkling Water', 'Energy Drink', 'Apple Cider'],
    snacks: ['Potato Chips', 'Tortilla Chips', 'Mixed Nuts', 'Granola Bars', 'Popcorn', 'Dark Chocolate', 'Gummy Bears'],
    meat: ['Chicken Breast', 'Ground Beef', 'Pork Chops', 'Bacon Smoked', 'Lamb Leg', 'Turkey Deli', 'Salami'],
    seafood: ['Salmon Fillet', 'Shrimp Frozen', 'Canned Tuna', 'Cod Fillet', 'Crab Sticks', 'Lobster Tail'],
    frozen: ['Frozen Pizza', 'Ice Cream Vanilla', 'Mixed Veggies Frozen', 'French Fries', 'Chicken Nuggets', 'Frozen Berries'],
    household: ['Paper Towels', 'Dish Soap', 'Laundry Detergent', 'Trash Bags', 'All Purpose Cleaner', 'Sponge Pack', 'Hand Sanitizer'],
  };

  categories.forEach(cat => {
    (names[cat] || []).forEach((name, idx) => {
      const price = parseFloat((Math.random() * 20 + 2).toFixed(2));
      const hasOldPrice = Math.random() > 0.5;
      const oldPrice = hasOldPrice ? parseFloat((price * 1.2).toFixed(2)) : undefined;

      products.push({
        id: `${cat}-${idx}`,
        name,
        category: cat,
        subcategory: 'General',
        price,
        oldPrice,
        discount: oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : undefined,
        rating: 4 + Math.random(),
        reviews: Math.floor(Math.random() * 500) + 10,
        image: `https://picsum.photos/seed/${cat}${idx}/600/600`,
        description: `High quality ${name} sourced from the best farms. Fresh, organic, and healthy for your daily needs.`,
        nutrition: {
          calories: '150 kcal',
          fat: '5g',
          protein: '10g',
          carbs: '20g'
        },
        ingredients: ['Natural Ingredients', 'No Preservatives', 'Organic Sources'],
        stock: Math.floor(Math.random() * 100) + 5,
        tags: [cat, 'Fresh', 'Popular']
      });
    });
  });

  return products;
};

export const ALL_PRODUCTS = generateProducts();
