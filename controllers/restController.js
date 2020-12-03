const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''

    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }

    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then(result => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit) //findAndCountAll中可利用count取得資料筆數
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(r => ({  // findAndCountAll中可利用rows取得資料
        ...r.dataValues,  //利用展開運算子複製物件並展開其內容
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.Category.name
      }))

      Category.findAll({ raw: true }).then(categories => {
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId,
          totalPage,
          prev,
          next,
          page
        })
      })
    })
  },

  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      // console.log(restaurant.Comments[0].User)
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    })
  },

  getFeeds: (req, res) => {
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],  //such as ASC, DESC, NULLS FIRST, etc
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
    ])
      .then(([restaurants, comments]) => {
        return res.render('feeds', {
          restaurants,
          comments
        })
      })
  },

  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: [Comment, Category] })
      .then(restaurant => {
        const NumberOfComments = restaurant.Comments.length
        return res.render('dashboard', { restaurant: restaurant.toJSON(), NumberOfComments })
      })
  }
}

module.exports = restController