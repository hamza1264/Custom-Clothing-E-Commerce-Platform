import React from 'react'
import ContactHero from '@/component/contactSection/contacthero/contactHero'
import ContactForm from '@/component/contactSection/contactform/contactForm'
import ContactSupport from '@/component/contactSection/contactsupport/contactSupport'
import ContactFooter from '@/component/contactSection/contactfooter/contactFooter'
import ProductCard from '@/component/productcard/productCard'

function page() {
  return (
    <div>
      <ContactHero />
      <ContactForm />
      <ContactSupport />
      <ContactFooter />
      {/* <h1>contect</h1> */}
    </div>
  )
}

export default page
