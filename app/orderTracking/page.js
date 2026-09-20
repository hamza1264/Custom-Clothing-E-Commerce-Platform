import OrderStatus from '@/component/orderTrackingSection/orderstatus/OrderStatus'
import TrackForm from '@/component/orderTrackingSection/trackform/TrackForm'
import TrackHelp from '@/component/orderTrackingSection/trackhelp/TrackHelp'
import TrackHero from '@/component/orderTrackingSection/trackhero/TrackHero'
import React from 'react'

function page() {
  return (
    <div>
      <TrackHero />
      <TrackForm />
      <OrderStatus />
      <TrackHelp />
      {/* <h1>order tracking</h1> */}
    </div>
  )
}

export default page
