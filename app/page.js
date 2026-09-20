import React from 'react'
import Hero from "@/component/homeSection/hero/page"
import ShopByCategory from "@/component/homeSection/shopByCategory/page"
import Unstatshed from "@/component/homeSection/unstatched/page"

function page() {
  return (
    <div>
      {/* <h1>Home</h1> */}
      <Hero />
      <ShopByCategory />
      <Unstatshed />
    </div>
  )
}

export default page
