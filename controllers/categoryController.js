const db = require('../models')
const Category = db.Category

module.exports = {
  getCategories: (req, res) => {
    return Category.findAll({ raw: true }).then(categories => {
      if (req.params.id) {
        return Category.findByPk(req.params.id).then(category => {
          return res.render('admin/categories', { categories, category: category.toJSON() })
        })
      }
      return res.render('admin/categories', { categories })
    })
  }

}