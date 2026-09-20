import CustomBenefits from '@/component/customStitchSection/custombenefits/CustomBenefit'
import CustomCTA from '@/component/customStitchSection/customCTA/CustomCTA'
import CustomForm from '@/component/customStitchSection/customform/CustomForm'
import CustomHero from '@/component/customStitchSection/customhero/CustomHero'
import CustomSteps from '@/component/customStitchSection/customsteps/CustomSteps'
import React from 'react'

function page() {
  return (
    <div>
      <CustomHero />
      <CustomSteps />
      <CustomForm />
      <CustomBenefits />
      <CustomCTA />
      {/* <h1>custom stitch</h1> */}
    </div>
  )
}

export default page
