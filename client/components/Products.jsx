import { useNavigate } from "react-router-dom";
import { useGetCatProductsQuery, useDeleteCatProductMutation, useCreateCartItemsInCartMutation } from "../redux/api";
import React, { useState } from "react";
import { Button, Box, Card, CardActions, CardContent, CardMedia, Typography, Grid, TextField } from "@mui/material";
import NewProductForm from "./NewProductForm";
import { useSelector, useDispatch } from "react-redux";

import { addToCart } from "../redux/cartSlice";

const Products = () => {
  const { user, token } = useSelector(state => state.auth)
  const navigate = useNavigate();

  const { data: products, isLoading, error } = useGetCatProductsQuery();
  const [deleteCatProduct] = useDeleteCatProductMutation();
  const [createCartItemsInCart] = useCreateCartItemsInCartMutation();

  const [type,setType] = useState("guest");
  const dispatch = useDispatch()

  const [searchQuery, setSearchQuery] = useState("")

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }
  if (error) {
    return <Typography>Error: {error.message}</Typography>;
  }

  return (

    <Box>
      <TextField
        // id="outlined-basic"
        variant="outlined"
        label="Search"
        placeholder="Search Products Here..."
        onChange={event => setSearchQuery(event.target.value)}
        sx={{ marginLeft: 10, marginTop: 3, padding:2}}
      />
      {user?.admin && <NewProductForm />}
      <Typography variant="h3" sx={{ marginLeft: 14 }} >Cat Products</Typography>
      {error && !products && (<p> Failed to load products from api</p>)}
      <Grid container spacing={4} sx={{ marginLeft: 10 }}>
        {products ? (
          products.slice().sort((a,b)=> a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1 )
          .filter(product => {
            if (searchQuery === '') {
              return product
            } else if (product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
              return product;
            }
          })
            .map((product) => {
              return (
                <Grid item key={product.name} >
                  <Card sx={{ maxWidth: 350, minWidth: 350, maxHeight: 450, minHeight: 450 }} >
                    <CardMedia
                      component="img"
                      alt={product.name}
                      height="250"
                      image={product.imageUrl}
                      sx={{ objectFit: "contain" }}
                    />
                    <CardContent>
                      <Typography variant="h6" sx={{ textAlign: "center", textTransform: "capitalize" }}>{product.name}</Typography>
                      <Typography sx={{ textAlign: "center" }}><b>Price:</b>${product.price}</Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                      <Button variant="contained" onClick={() => navigate("/" + product.id)}>Product Info</Button>
                      {user?.admin && <Button variant="contained" onClick={() => deleteCatProduct(product.id)}>Delete Product</Button>}
                      {user?.admin && <Button variant="contained" onClick={() => navigate("/admin", { state: product })}>Update Product</Button>}
                      {type === "guest" && <Button variant="contained" onClick={() => dispatch(addToCart({quantity, id, name, price, imageUrl }))}>Add to Cart</Button>}
                      {type === "loggedIn" && token && <Button variant="contained" onClick={() => createCartItemsInCart({ quantity: 1, productId: product.id })}>Add to Cart</Button>}
                    </CardActions>
                  </Card>
                </Grid>
              )
            })) : !error && <p>Loading...</p>}
      </Grid>
    </Box>
  )
}

export default Products;
