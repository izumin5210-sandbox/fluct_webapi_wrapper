import geolib from "geolib";

export default class {
  constructor(lat, lng, range) {
    this.lat = lat;
    this.lng = lng;
    this.range = range;
    this.coordinate = { latitude: lat, longitude: lng };
  }

  parse(json) {
    return JSON.parse(json).results.shop.map(this._extractAttrsFromShop.bind(this)).filter(this._filterByRange.bind(this));
  }

  _extractAttrsFromShop(shop) {
    return {
        name:   shop.name,
        lat:    shop.lat,
        lng:    shop.lng,
        hours:  shop.open,
        closed: shop.close,
        budget: shop.budget.name,
        categories: this._extractCategories(shop)
    };
  }

  _extractCategories(shop) {
    let categories = [shop.food.name];
    if (shop.hasOwnProperty("sub_food")) {
        categories.push(shop.sub_food.name);
    }
    return categories;
  }

  _filterByRange(shop) {
    const distance = geolib.getDistance(this.coordinate, { latitude: shop.lat, longitude: shop.lng });
    return distance <= this.range;
  }
}
