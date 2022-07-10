const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  res.render('./articles/show', { article: article })
})

router.post('/', async (req,res) => {   // when we submit a form its gona call this router.post which will tkae it to / after the article

  let article = new Article({  // weve created a new article and passed in our all of our new articles
      title: req.body.title,
      description: req.body.description, // takes whatever we pass in the form 
      markdown: req.body.markdown

  })

  try{ 
 article =  await article.save()
 res.redirect(`/articles/${article.slug}`) // redirecting to the article id page if it saves properly
  } catch (e) {
      console.log(e)
  res.render('articles/new', {article: article})
  }
})

router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router