import HowHero from '@/component/howItWorkSection/howhero/HowHero'
import HowSteps from '@/component/howItWorkSection/howsteps/HowSteps'
import CustomHow from '@/component/howItWorkSection/customhow/CustomHow'
import HowCTA from '@/component/howItWorkSection/howCTA/HowCTA'
import React from 'react'

function page() {
  return (
    <div>
      <HowHero />
      <HowSteps />
      <CustomHow />
      <HowCTA />
      {/* <h1>how it work</h1> */}
    </div>
  )
}

export default page
