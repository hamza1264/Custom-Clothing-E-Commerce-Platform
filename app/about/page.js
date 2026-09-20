"use client"
import React from 'react'
import AboutHero from '@/component/aboutSection/abouthero/aboutHero'
import WhoWeAre from '@/component/aboutSection/whoweare/whoWeAre'
import OurJourney from '@/component/aboutSection/ourjourney/ourJourney'
import AboutStats from '@/component/aboutSection/aboutstatus/aboutStatus'

function page() {
  return (
    <div>
      <AboutHero />
      <WhoWeAre />
      <OurJourney />
      <AboutStats />  
      {/* <h1>about</h1> */}
    </div>
  )
}

export default page
