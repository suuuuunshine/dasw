'use strict'
const PastOrder = require('./db/Models/PastOrder.Model')
const User = require('./db/Models/User.Model')
const Cart = require('./db/Models/Cart.Model')
const Product = require('./db/Models/Product.Model')
const Category = require('./db/Models/Category.Model')
const {connect, mongoose } = require('./db/mongodb-connect')

const createToken = require('./public/assets/services/token');
const jwt = require('jwt-simple');
const moment = require('moment');

const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
const cors = require('cors');

let usercountID = 3

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));


connect()

/////////////////MIDDLEWARES///////////////

//Revisa si se tiene el content Type de manera correcta con el application/json
const requireJsonContent = () => {
    return (req, res, next) => {
        if (req.headers['content-type'] !== 'application/json') {
            res.status(400).send('Server requires application/json')
        } else {
            next()
        }
    }
}

//Revisa si el token esta autorizado
const isAuth = () => {
    return (req, res, next) =>{
        if(!req.headers.authorization){
            res.status(403).send({message: 'No tienes autorizacion'})
        }
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.decode(token, "codigodetoken")
        if(payload.exp <= moment().unix){
            res.status(401).send({message: 'El token ha caducado'})
        }
        req.user = payload.id
        req.admin = payload.admin
        next()
    }
}

////////////MENU/////////////////////////
app.get('/api/categories', (req, res) => {
    Category.find({},(err, docs) => { //DATABASE UPDATED!!!
        if (docs) {
            let product = docs;
            let limit = 6;
            let page = 1;
            let init = 0;
            let product_out;
            let windows;

            if (req.query.id) { //filtro por tipo            
                product = product.filter(p => p.id == req.query.id);
            }
            if (req.query.page) { //filtro por página
                page = req.query.page;
            }
            if (req.query.limit) {
                limit = req.query.limit;
            }

            init = limit * page - limit;
            limit = page * limit;

            windows = Math.ceil((product.length * page) / limit);

            if (limit > product.length) limit = product.length;

            product_out = { //objeto de retorno
                pagina: page,
                ventanas: windows,
                productos: []
            };

            for (init; init < limit; init++) {
                product_out.productos.push(product[init]);
            }

            res.status(200).send(product_out);
        }
        else{
            res.status(400).send({
                error: "No existen productos para mostrar", err
            })
        }
    })
});

app.get('/api/categories/:categoryId/products', function(req, res){
        Product.find({category: req.params.categoryId})
        .then((results)=>{
            return res.status(200).json(results)
        }).catch(err => {
            console.log(err)
            return res.status(400).json(err)
        })
})


app.patch('/api/categories/:id', requireJsonContent(), (req, res) => {
    Category.update({id: req.params.id}, {$set: req.body}, (err, docs) =>{
        
     if (docs) {
         let product = docs;
         res.status(200).send(product);
     }
     else{
         console.log(err);
         res.status(400).send({
             error: "Error de actualización"
         })
     }
    })
 })

 app.put('/api/categories/:id', (req, res)=>{
    Category.update({id: req.params.id}, {$set: req.body}, (err, docs) =>{
       
        if (docs) {
            let product = docs;
            res.status(200).send(product);
        }
        else{
            console.log(err);
            res.status(400).send({
                error: "Error de actualización"
            })
        }
       })
})

app.post('/api/categories', function (req, res) {
    const model = new Category(req.body)
    model.save()
    .then(result => {
        return res.status(201).json(result)
    })
    .catch(err => {
        return res.status(400).json(err)
    })
})
app.get('/api/products/:id', requireJsonContent(),(req, res) => {
   console.warn('req', req)
    Category.findOne({id: req.params.id},(err, docs) => {
        if (docs) {
            console.log("Aqui si queremos");
            let product = docs;
            res.status(200).send(product);
        }
        else{
            console.log(err);
            res.status(400).send({
                error: "No existen productos para mostrar"
            })
        }

    }) //DATABASE UPDATED!!!


});

app.post('/api/products', function (req, res ) {
    const model = new Product(req.body)
    model.save()
    .then(result => {
        console.log(result)
        return res.status(201).json(result)
    })
    .catch(err => {
        console.log(err)
        return res.status(400).json(err)
    })
})

// //Busqueda por parametro
// app.get('/api/products/:tipo', (req, res) => {
//     Product.find({product: req.body.tipo},(err, docs) => { //DATABASE UPDATED!!!
//         if (docs) {
//             let product = docs;
//             console.log(product);
//         }
//         else{
//             console.log("error", err);
//         }
//     });
// })


app.put('/api/products/:id', (req, res) => {
      Product.updateOne({id: req.params.id}, {$set: req.body}, (err, docs) => { //DATABASE UPDATED!!!
        if (docs) {
            let product = docs;
            res.status(200).send(product);
        }
        else{
            console.log(err);
            res.status(400).send({
                error: "Error de actualización"
            })
        }
    })
 
})

app.patch('/api/products/:id', (req, res) => {
    Product.updateOne({id: req.params.id}, {$set: req.body}, (err, docs) => { //DATABASE UPDATED!!!
      if (docs) {
          let product = docs;
          res.status(200).send(product);
      }
      else{
          console.log(err);
          res.status(400).send({
              error: "Error de actualización"
          })
      }
  })

})


// CONSULTAR PEDIDOS (ADMIN)

app.get('/api/pedidos', (req, res) => {
    PastOrder.find({})
    .populate('products user')
    .then((results)=>{
        return res.status(200).json(results)
    }).catch(err => {
        console.log(err)
        return res.status(400).json(err)
    })
})

////////////////CANASTA/////////////////////

app.get('/api/pedidos', (req, res) => {
    let pedido = productos.pedido; //database En nueva version debe buscar por ID de usuario
    if (pedido) {
        res.status(200).send(pedido)
    } else {
        res.status(400).send({
            error: "Canasta vacía"
        })
    }
})

// CREAR NUEVO PEDIDO
app.post('/api/pedidos', (req, res) => {
    const model = new PastOrder(req.body)
    model.save()
    .then((results)=>{
        return res.status(200).json(results)
    }).catch(err => {
        console.log(err)
        return res.status(400).json(err)
    })
})


app.delete('/api/pedidos/:id', (req, res) => {
    let ToDelete = productos.pedido.find(p => p.id == req.params.id); ///database En versiones nuevas debe buscar por ID usuario
    if (ToDelete) {
        for (let i = 0; i < productos.pedido.length; i++) {
            if (productos.pedido[i] == ToDelete) {
                let p = productos.pedido.splice(i, 1);
            }
        }
        // fs.writeFileSync('', JSON.stringify(productos.pedido));
        res.status(200).send("Borrado")
    } else {
        res.status(400).send({
            error: "No existe ese producto"
        })
    }
})




// TODO 
// FUNCION PARA ACTUALIZAR CARRITO
app.put('/api/cart/:userId', function (req, res) {
    const cart = Cart.findOne({
        user_id: req.params.userId
    })
})


/* CARRITO CON POPULATE QUE SÍ SIRVE */

app.get("/api/cart/:userId", function (req, res) {
    
    const userId = req.params.userId
    
    Cart.find({user_id: userId})
        .populate('productos')
        .then((results) => {
            return res.status(200).json(results)
        })
        .catch(err => {
            console.log(err)
            return res.status(400).json(err)
        })

        
})

//crear carrito nuevo
app.post('/api/cart', function (req, res, next) {
    const body = req.body
    const model = new Cart({
        user_id: body.user_id,
        productos: body.productos,
        total: body.total
    })

    model.save().then((result) => {
        console.log(result)
    })
})


//TRAER PEDIDO POR ID DE USUARIO
app.get('/api/pedidos/:id', (req, res) => {
    PastOrder.find({})
    .populate('products user')
    .then((results)=>{
        return res.status(200).json(results)
    }).catch(err => {
        console.log(err)
        return res.status(400).json(err)
    })
})

////////////////LOGIN - REGISTRO////////////

//Post de creacion de usuario
app.post("/api/register", requireJsonContent(), (req, res) => {
    const user = new User({
        id: usercountID,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        correo: req.body.correo,
        password: req.body.password,
        telefono: `null`,
        descripcion: `null`,
        imagen: `null`,
        admin: '0'
    })
    usercountID++
    console.log(user);
    user.save((err)=>{
        if(err) res.status(500).send({message: `Error al crear usuario: ${err}`})

        return res.status(200).send({token: createToken(user)})
    })
})



//GET LOGIN USUARIO
app.post("/api/login", requireJsonContent(), (req, res) =>{
    let user = req.body;
    User.findOne({correo: user.correo, password: user.password}, (err, docs) =>{
        if(docs){
            let token = createToken(user)

            return res.status(200).send({
                message: 'Tienes acceso',
                token: `${token}`, 
                admin: `${docs.admin}`, 
                user: {
                nombre: `${docs.nombre}`,
                apellido: `${docs.apellido}`,
                correo: `${docs.correo}`,
                telefono: `${docs.telefono}`,
                imagen: `${docs.imagen}`,
                descripcion: `${docs.descripcion}`,
                id: `${docs._id}`,
                _id: `${docs._id}`
                },
                id: `${docs.id}`
            })
        }
        else {
            return res.status(400).send('Error finding user', err)
        }
    })
})

// ACTUALIZAR USUARIO

app.patch("/api/users", requireJsonContent(), (req, res) =>{
    const id = req.body._id
    User.updateOne({_id: id}, req.body) .then((results) => {
        return res.status(200).json(results)
    }) .catch(err => {
        console.log(err)
        return res.status(400).json(err)
    })
})

app.get('/api/users/:id', (req, res) => {
    User.findOne({_id: req.params.id})    
    .then((results)=>{
        return res.status(200).json(results)
    }).catch(err => {
        console.log(err)
        return res.status(400).json(err)
    })
})


app.listen(port, () => console.log(`ejecutando server en puerto: ${port}`))