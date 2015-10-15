export default function(json) {
  return JSON.parse(json).results.shop.map(extractAttrsFromShop);
}

function extractAttrsFromShop(shop) {
  return {
    name:   shop.name,
    lat:    shop.lat,
    lng:    shop.lng,
    hours:  shop.open,
    closed: shop.close,
    budget: shop.budget.name,
    categories: extractCategories(shop)
  };
}

function extractCategories(shop) {
  let categories = [shop.food.name];
  if (shop.hasOwnProperty("sub_food")) {
    categories.push(shop.sub_food.name);
  }
  return categories;
}
