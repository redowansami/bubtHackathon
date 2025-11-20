export const DIETARY_PREFERENCES = [
    'vegetarian',
    'vegan',
    'non-vegetarian',
    'pescatarian',
    'gluten-free',
    'keto',
    'no-preference',
];

export const FOOD_CATEGORIES = [
    'Vegetable',
    'Fruit',
    'Dairy',
    'Grain',
    'Protein',
    'Snack',
    'Beverage',
    'Other',
];

export const DIETARY_PREFERENCES_LABELS = {
    vegetarian: 'Vegetarian',
    vegan: 'Vegan',
    'non-vegetarian': 'Non-Vegetarian',
    pescatarian: 'Pescatarian',
    'gluten-free': 'Gluten-Free',
    keto: 'Keto',
    'no-preference': 'No Preference',
};

export const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

export const getInitials = (fullName) => {
    if (!fullName) return '?';
    return fullName
        .split(' ')
        .map((name) => name.charAt(0).toUpperCase())
        .join('')
        .slice(0, 2);
};
