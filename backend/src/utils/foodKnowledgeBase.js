/**
 * Food Knowledge Base - Contains curated tips and advice for the chatbot
 */

const foodKnowledgeBase = {
    // Food Waste Reduction Tips
    wasteReduction: [
        {
            title: "Proper Food Storage",
            tips: [
                "Store vegetables in separate containers to prevent ethylene gas from ripening fruits",
                "Keep herbs fresh by storing them in water like flowers (basil, cilantro)",
                "Store onions and potatoes separately in cool, dark places",
                "Use glass containers for better visibility of leftovers",
                "Label containers with the date to track freshness",
                "Store leafy greens between damp paper towels to maintain crispness",
            ],
        },
        {
            title: "Smart Shopping Habits",
            tips: [
                "Plan meals before shopping to avoid impulse purchases",
                "Check your fridge/pantry before shopping",
                "Buy loose vegetables instead of pre-packaged when possible",
                "Purchase only what you can use before expiration",
                "Consider buying smaller quantities more frequently",
                "Use a shopping list and stick to it",
            ],
        },
        {
            title: "Creative Use of Scraps",
            tips: [
                "Make vegetable stock from carrot peels, onion skins, and celery ends",
                "Use stale bread for croutons, breadcrumbs, or bread pudding",
                "Blend overripe bananas into smoothies or banana bread",
                "Roast vegetable scraps with olive oil for snacks",
                "Make compost from organic waste for gardening",
            ],
        },
        {
            title: "Freezer Management",
            tips: [
                "Freeze bread before it goes stale",
                "Portion meals into freezer containers for easy reheating",
                "Freeze herbs in ice cube trays with olive oil",
                "Label frozen items with dates",
                "Use FIFO (First In, First Out) method",
            ],
        },
    ],

    // Nutrition Balancing Tips
    nutrition: [
        {
            title: "Balanced Plate Guidelines",
            tips: [
                "Fill half your plate with vegetables and fruits",
                "One quarter of your plate should be protein (beans, meat, tofu)",
                "One quarter should be whole grains or starchy vegetables",
                "Include healthy fats from nuts, seeds, or oils",
                "Aim for variety in colors - different colors mean different nutrients",
            ],
        },
        {
            title: "Protein Sources",
            tips: [
                "Plant-based: beans, lentils, chickpeas, tofu, nuts, seeds",
                "Animal-based: chicken, fish, eggs, dairy, lean beef",
                "Combine incomplete proteins (rice + beans) for complete amino acids",
                "Aim for 0.8-1g protein per kg of body weight daily",
                "Vary protein sources throughout the week",
            ],
        },
        {
            title: "Vitamin & Mineral Optimization",
            tips: [
                "Iron: Pair iron-rich foods with vitamin C for better absorption",
                "Calcium: Combine with vitamin D for better absorption",
                "B12: Ensure adequate intake if vegetarian/vegan",
                "Eat the rainbow: Red, orange, yellow, green, purple vegetables",
                "Include leafy greens daily for folate and minerals",
            ],
        },
        {
            title: "Healthy Eating Habits",
            tips: [
                "Eat slowly and mindfully to improve digestion",
                "Drink water before meals to aid satiety",
                "Include fiber from whole grains and vegetables",
                "Avoid skipping meals - eat regular, balanced meals",
                "Practice portion control using smaller plates",
            ],
        },
    ],

    // Budget Meal Planning
    budgetMealing: [
        {
            title: "Budget-Friendly Ingredients",
            tips: [
                "Dried beans and lentils: high protein, low cost, long shelf life",
                "Eggs: complete protein, versatile, affordable",
                "Rice and pasta: filling, cheap, good carbs",
                "Frozen vegetables: as nutritious as fresh, cheaper",
                "Canned fish: affordable protein, omega-3s",
                "Seasonal produce: cheaper and more flavorful",
            ],
        },
        {
            title: "Meal Prep Strategies",
            tips: [
                "Cook large batches and portion into containers",
                "Use one-pot meals to reduce cooking time and dishes",
                "Batch cook proteins at the start of the week",
                "Prepare breakfast burritos for grab-and-go meals",
                "Make soups and stews that improve with time",
            ],
        },
        {
            title: "Cost-Saving Techniques",
            tips: [
                "Buy store brands instead of name brands",
                "Purchase items in bulk",
                "Use sales and coupons strategically",
                "Shop at discount grocery stores",
                "Buy whole foods instead of processed foods",
                "Avoid shopping when hungry",
            ],
        },
        {
            title: "Weekly Budget Meal Planning",
            tips: [
                "Plan 3-4 main recipes that use overlapping ingredients",
                "Build meals around one protein per day",
                "Reuse ingredients across multiple meals",
                "Plan for 2 meals from each main dish",
                "Allocate 30-40% of budget for proteins, 20% for produce, 20% for grains",
            ],
        },
    ],

    // Leftover Transformation Ideas
    leftovers: [
        {
            category: "Rice",
            ideas: [
                "Fried rice with vegetables, protein, and soy sauce",
                "Rice pudding with milk, sugar, and cinnamon",
                "Rice and bean bowls with toppings",
                "Crispy rice cakes as snacks",
                "Add to soups for extra texture",
            ],
        },
        {
            category: "Cooked Vegetables",
            ideas: [
                "Vegetable frittata or omelet",
                "Add to soups, stews, or curries",
                "Blend into sauces or dips",
                "Stuff into wraps or tacos",
                "Mix into grain bowls",
            ],
        },
        {
            category: "Cooked Meat",
            ideas: [
                "Shred and use in tacos, burritos, or nachos",
                "Add to pasta sauces",
                "Mix into fried rice or grain bowls",
                "Use in soups or stews",
                "Chop and add to salads",
            ],
        },
        {
            category: "Bread",
            ideas: [
                "Make breadcrumbs in a food processor",
                "Create croutons for salads",
                "Make bread pudding (sweet or savory)",
                "Layer for bread salad (panzanella)",
                "Blend into smoothies",
            ],
        },
        {
            category: "Fruit",
            ideas: [
                "Blend into smoothies or beverages",
                "Make jam or compote",
                "Bake into muffins or cakes",
                "Make fruit leather",
                "Add to yogurt or oatmeal",
            ],
        },
    ],

    // Food Sharing & Community
    foodSharing: [
        {
            title: "Local Food Sharing Resources",
            tips: [
                "OLIO app: Share excess food with neighbors",
                "Too Good To Go: Buy discounted meals before closing",
                "Food banks: Donate or receive food assistance",
                "Community gardens: Share growing space and produce",
                "Buy Nothing groups: Give away food in your community",
                "Farm-to-table programs: Support local farmers",
            ],
        },
        {
            title: "Organizing Food Sharing",
            tips: [
                "Set up a neighborhood sharing fridge",
                "Organize potluck dinners with neighbors",
                "Start a community garden",
                "Create a meal-sharing group in your area",
                "Coordinate bulk buying with friends",
                "Share meal prep sessions",
            ],
        },
        {
            title: "Donation Guidelines",
            tips: [
                "Donate unopened, non-perishable items first",
                "For fresh food: donate soon after expiration of best-by date",
                "Ensure food is clean and in good condition",
                "Include ingredient lists if possible",
                "Check with local food banks about their policies",
                "Consider safety and health regulations",
            ],
        },
        {
            title: "Food Banks & Charities",
            tips: [
                "Search localharvest.org for food banks near you",
                "Contact Feeding America for local resources",
                "Check with religious organizations for assistance",
                "Volunteer at food banks to help others",
                "Advocate for food security policies",
            ],
        },
    ],

    // Environmental Impact
    environment: [
        {
            title: "Carbon Footprint of Foods",
            impact: {
                highest: "Beef (27kg CO2/kg), Lamb (20kg CO2/kg), Cheese (13kg CO2/kg)",
                medium: "Pork (12kg CO2/kg), Chicken (6kg CO2/kg), Fish (5kg CO2/kg)",
                lowest: "Vegetables (2kg CO2/kg), Grains (1kg CO2/kg), Legumes (0.9kg CO2/kg)",
            },
        },
        {
            title: "Reducing Food's Environmental Impact",
            tips: [
                "Reduce meat consumption, especially beef and lamb",
                "Choose plant-based proteins more often",
                "Buy locally-produced food to reduce transportation",
                "Choose seasonal produce over imports",
                "Buy organic to reduce pesticide use",
                "Support regenerative agriculture practices",
            ],
        },
        {
            title: "Water Usage Impact",
            tips: [
                "Beef: 20,000 liters water per kg",
                "Chicken: 4,300 liters water per kg",
                "Rice: 5,000 liters water per kg",
                "Choose crops requiring less water in dry regions",
                "Support water-efficient farming practices",
                "Avoid wasting water in food preparation",
            ],
        },
        {
            title: "Sustainable Choices",
            tips: [
                "Support certified sustainable fishing",
                "Choose cage-free or pasture-raised eggs",
                "Buy from local farmers when possible",
                "Participate in CSA (Community Supported Agriculture)",
                "Compost organic waste",
                "Reduce packaging waste by buying bulk",
            ],
        },
    ],

    // Quick Tips Database
    quickTips: {
        "how to store vegetables": "Keep in separate containers, maintain humidity, avoid ethylene-producing fruits nearby",
        "best proteins on a budget": "Eggs, beans, lentils, canned fish, affordable chicken",
        "what to do with stale bread": "Make croutons, breadcrumbs, bread pudding, or toast",
        "environmental impact of meat": "Beef has highest carbon footprint (~27kg CO2/kg). Consider reducing meat consumption",
        "how to plan meals": "Choose 3-4 recipes, plan overlapping ingredients, prep in batches",
        "ways to reduce food waste": "Plan meals, store properly, use FIFO method, get creative with leftovers",
    },
};

module.exports = foodKnowledgeBase;
