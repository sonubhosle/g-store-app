import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../states/Products/Action';
import ProductCard from '../components/ProductCard';
const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  if (loading) {
    return <p>Loading</p>
  }

  if (error) {
    return <p>Products Not Found</p>
  }

  const featuredProducts = (products || []).slice(0, 10)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {featuredProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

export default Products