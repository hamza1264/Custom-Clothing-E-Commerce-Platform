import React from 'react'
import Shop from '@/component/shopSection/shop/shop'

async function page({ searchParams }) {
    const params = await searchParams;
    const searchValue = params.search;
    const search = Array.isArray(searchValue) ? searchValue[0] ?? '' : searchValue ?? '';
    const categoryValue = params.category;
    const category = Array.isArray(categoryValue)
        ? categoryValue[0] ?? ''
        : categoryValue ?? '';

    return (
        <div>
            <Shop
              key={`${search}:${category}`}
              searchTerm={search}
              categoryTerm={category}
            />
            {/* <h1>Shop</h1> */}
        </div>
    )
}

export default page
