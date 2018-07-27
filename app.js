const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const Movie = require('./modules/movie')
const User = require('./modules/user')
const _ = require('underscore')
const cookieParser = require('cookie-parser')
const session=require('express-session')


mongoose.connect('mongodb://localhost/website')
const app = express()

app.set('views', './views/includes')
app.use(bodyParser());
app.use(cookieParser())
app.use(session({
    secret: 'linxne'
}))
app.locals.moment = require('moment')
// app.use(bodyParser.urlencoded({
//     extended: false
// }));
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'jade')
app.listen(port)

app.get('/', function (req, res) {
    console.log(('user in session'))
    console.log(req.session.user)
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }

        res.render('index', {
            title: '首页',
            movies: movies
        })

        // movies: [{
        //     title: '机械战警',
        //     _id: 1,
        //     poster: 'http:r3.ykimg.com/05160000530EEB63675839160D0B79D5',
        // }, {
        //     title: '机械战警',
        //     _id: 2,
        //     poster: 'http:r3.ykimg.com/05160000530EEB63675839160D0B79D5',
        // }, {
        //     title: '机械战警',
        //     _id: 3,
        //     poster: 'http:r3.ykimg.com/05160000530EEB63675839160D0B79D5',
        // }, {
        //     title: '机械战警',
        //     _id: 4,
        //     poster: 'http:r3.ykimg.com/05160000530EEB63675839160D0B79D5',
        // }, {
        //     title: '机械战警',
        //     _id: 5,
        //     poster: 'http:r3.ykimg.com/05160000530EEB63675839160D0B79D5',
        // }, {
        //     title: '机械战警',
        //     _id: 6,
        //     poster: 'http:r3.ykimg.com/05160000530EEB63675839160D0B79D5',
        // }]
    })
})
//signup
app.post('/user/signup', function (req, res) {
    var _user = req.body.user
    console.log(_user)
    // console.log(User)
    User.find({
        name: _user.name
    }, function (user) {
        if (user) {
            // console.log('user')
            return res.redirect('/')
        } else {
            // console.log('no user')
            var user = new User(_user)

            return user.save(function (err, user) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/admin/userlist')
            })
        }
    })
})


//signin
app.post('/user/signin', function (req, res) {
    var _user = req.body.user
    var name = _user.name
    var password = _user.password
    User.findOne({
        name: name
    }, function (err, user) {
        if (err) {
            console.log(err)
        }
        if (!user) {
            return res.redirect('/')

        }
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                console.log(err)
            }
            if (isMatch) {
                // console.log('Password is matched')
                req.session.user = user

                return res.redirect('/')
            } else {
                console.log('Password is not matched')
            }
        })
    })
})

app.get('/movie/:id', function (req, res) {
    const id = req.params.id

    Movie.findById(id, function (err, movie) {
        if (err) {
            console.log(err)
        }
        res.render('detail', {
            title: '详情',
            movie: movie
        })
        // movie: {
        //     director: '何塞·帕迪利亚',
        //     country: '美国',
        //     title: '机械战警',
        //     poster: 'http:r3.ykimg.com/05160000530EEB63675839160D0B79D5',
        //     year: 2014,
        //     language: '英语',
        //     flash: 'http://player.youku.com',
        //     summary: `1.除了考虑页面编码的问题，如果有发现和页面编码不一致，肯定要改的
        //     2.如果一致，并且感觉是unicode编码的，可能是返回内容进行了gzip压缩（可以看一下返回的header头中content-encoding）,以下有俩种解决方案：`,
        // }
    })
})
app.get('/admin/list', function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err)
        }

        res.render('list', {
            title: '列表',
            movies: movies
        })
        // movies: [{
        //     _id: 1,
        //     director: '何塞·帕迪利亚',
        //     country: '美国',
        //     title: '机械战警',
        //     year: 2014,
        //     language: '英语'
        // }]
    })
})
app.get('/admin/movie', function (req, res) {
    res.render('admin', {
        title: '录入',
        movie: {
            director: '',
            country: '',
            title: '',
            poster: '',
            year: '',
            language: '',
            flash: '',
            summary: ''
        }
    })
})
app.get('/admin/update/:id', function (req, res) {
    const id = req.params.id
    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('admin', {
                title: '后台更新页',
                movie: movie
            })
        })
    }
})
app.post('/admin/movie/new', function (req, res) {
    console.log(req.body.movie)
    const id = req.body.movie._id
    const movieObj = req.body.movie
    var _movie
    if (id !== 'undefined') {
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err)
            }
            _movie = _.extend(movie, movieObj)
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err)
                }
                res.redirect('/movie/' + movie._id)
            })
        })
    } else {
        _movie = new Movie({
            director: movieObj.director,
            country: movieObj.country,
            title: movieObj.title,
            poster: movieObj.poster,
            year: movieObj.year,
            language: movieObj.language,
            flash: movieObj.flash,
            summary: movieObj.summary
        })
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err)
            }
            res.redirect('/movie/' + movie._id)
        })
    }
})

app.delete('/admin/list', function (req, res) {
    const id = req.query.id
    if (id) {
        Movie.remove({
            _id: id
        }, function (err, movie) {
            if (err) {
                console.log(err)
            } else {
                res.json({
                    success: 1
                })
            }
        })
    }
})
console.log('start' + port)