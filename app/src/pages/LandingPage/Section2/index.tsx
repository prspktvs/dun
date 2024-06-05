import React from 'react'
import Rectangles from '/assets/landing/rectangles.svg'
import Squares from '/assets/landing/squares.svg'
import Plaid from '/assets/landing/plaid.svg'
import Lines from '/assets/landing/lines.svg'
import FeatureCard from './FeatureCard'

interface IFeatureCard {
  title: string
  backgroundColor: string
  image: React.ReactNode
  backgroundImage: string
}

const FEATURES: IFeatureCard[] = [
  {
    title: 'DUN gives each project its own space. Easy and efficient!',
    backgroundColor: '#C5D4D2',
    image: <img className='sm:w-[499px] w-10/12 ' src='./assets/landing/landing-image-1.jpg' alt='description-image' />,
    backgroundImage: `url(${Rectangles})`,
  },
  {
    title:
      'One topic equals one neat spot for all files and info related to that case.P.S. Courtesy of DUN.',
    backgroundColor: '#CBB9CF',
    image: <img className='sm:w-[499px] w-10/12 ' src='./assets/landing/landing-image-2.jpg' alt='description-image' />,
    backgroundImage: `url(${Squares})`,
  },
  {
    title: 'Every task is tied to a card, making it a breeze to dive into the details',
    backgroundColor: '#F5CBBC',
    image: <img className='sm:w-[499px] w-10/12 ' src='./assets/landing/landing-image-3.jpg' alt='description-image' />,
    backgroundImage: `url(${Lines})`,
  },
  {
    title: 'Enjoy a clear and simple interface with DUN. No fuss, just straightforward ease!',
    backgroundColor: '#FFF5D2',
    image: <img className='sm:w-[499px] w-10/12  ' src='./assets/landing/landing-image-4.jpg' alt='description-image' />,
    backgroundImage: `url(${Plaid})`,
  },
]

function Section2() {
  return (
    <>
      <div>
        <div className='sm:grid sm:w-full'>
          {FEATURES.map((item, index) => (
            <FeatureCard key={'feature-' + index} index={index} {...item} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Section2
