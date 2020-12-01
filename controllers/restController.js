const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({ include: Category }).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r.dataValues,  //利用展開運算子複製物件並展開其內容
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.Category.name
      }))
      return res.render('restaurants', {
        restaurants: data
      })
    })
  }
}

module.exports = restController