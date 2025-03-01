import React from 'react'
import { useGetAllProductsQuery } from '../Redux/Service'

const Products = () => {
    const { data } = useGetAllProductsQuery()
    console.log(data);
    return (
        <div>Products</div>
    )
}

export default Products