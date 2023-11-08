//need to add admin privileges to updating routes

const productsRouter = require("express").Router();
const prisma = require("../db/client");

// Get all products
productsRouter.get("/", async (req, res, next) => {
    try {
        const products = await prisma.product.findMany();
        res.send(products);
    } catch (error) {
        next(error);
    }
});

// Get a product by id
productsRouter.get("/:id", async (req, res, next) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: +req.params.id },
        });


        res.send(product);
    } catch (error) {
        next(error);
    }
});

// Create a new product (need to be an admin)
productsRouter.post("/", async (req, res, next) => {
    try {
        const product = await prisma.product.create({
            data: { ...req.body },
        });
        res.status(201).send(product);
    } catch (error) {
        next(error);
    }
});

// Update a product (need to be an admin)
productsRouter.put("/:id", async (req, res, next) => {
    try {
        const product = await prisma.product.update({
            where: { id: +req.params.id },
            data: req.body,
        });


        res.send(product);
    } catch (error) {
        next(error);
    }
});

// Delete a product by id (need to be an admin)
productsRouter.delete("/:id", async (req, res, next) => {
    try {
        const product = await prisma.product.delete({
            where: { id: +req.params.id },
        });


        res.send(product);
    } catch (error) {
        next(error);
    }
});

module.exports = productsRouter;