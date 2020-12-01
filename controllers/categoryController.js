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
  },

  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_msg', "name didn't exist")
      return res.redirect('back')
    }

    return Category.create({
      name: req.body.name
    }).then(category => {
      req.flash('success_msg', 'Category has been successfully added')
      res.redirect('/admin/categories')
    })
  }

}