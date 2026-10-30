import React from 'react'
import Shop from '@/component/shopSection/shop/shop'

async function page({ searchParams }) {
    const params = await searchParams;
    const searchValue = params.search;
    const search = Array.isArray(searchValue) ? searchValue[0] ?? '' : searchValue ?? '';

    return (
        <div>
            <Shop searchTerm={search} />
            {/* <h1>Shop</h1> */}
        </div>
    )
}

export default page
