
const express = require('express')
const { readFile, writeFile } = require('./utils')
const app = express()

app.use(express.json())



app.get('/products', async (req, res) => {
    const products = await readFile('products.json', true)
    res.json(products)
})

app.post('/products', async (req, res) => {
    if (
        !req.body.name ||
        typeof req.body.price !== 'number' ||
        req.body.price < 0 ||
        !Number.isInteger(req.body.quantity) ||
        req.body.quantity < 0
    ) {
        return res.status(400).json({
            error: true,
            message: 'Name, price and quantity are required'
        })
    }

    const products = await readFile('products.json', true)
    const lastId = products[products.length - 1]?.id || 0

    const newProduct = {
        id: lastId + 1,
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity
    }

    products.push(newProduct)
    await writeFile('products.json', products)

    res.status(201).json(newProduct)
})

app.get('/products/:id', async (req, res) => {
    const id = Number(req.params.id)
    const products = await readFile('products.json', true)

    const product = products.find((product) => product.id === id)

    if (!product) {
        return res.status(404).json({
            error: true,
            message: 'product not found'
        })
    }

    res.json(product)
})

app.delete('/products/:id', async (req, res) => {
    const id = Number(req.params.id)
    const products = await readFile('products.json', true)

    const index = products.findIndex((product) => product.id === id)

    if (index === -1) {
        return res.status(400).json({
            error: true,
            message: 'product not exists'
        })
    }

    const deletedProduct = products.splice(index, 1)

    await writeFile('products.json', products)

    res.json(deletedProduct[0])
})



app.put('/products/:id', async (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            error: true,
            message: 'Request body is missing. Send JSON data.'
        })
    }

    const id = Number(req.params.id)
    const { name, price, quantity } = req.body

    const products = await readFile('products.json', true)
    const index = products.findIndex((product) => product.id === id)

    if (index === -1) {
        return res.status(404).json({
            error: true,
            message: 'Product not found'
        })
    }

    if (
        typeof name !== 'string' ||
        !name.trim() ||
        typeof price !== 'number' ||
        price < 0 ||
        !Number.isInteger(quantity) ||
        quantity < 0
    ) {
        return res.status(400).json({
            error: true,
            message: 'Valid name, price and quantity are required'
        })
    }

    products[index] = {
        ...products[index],
        name: name.trim(),
        price,
        quantity
    }

    await writeFile('products.json', products)

    res.json(products[index])
})



app.listen(3000, () => {
    console.log('server running on http://localhost:3000')
})
