import React from 'react'
import imagePath from '../../../assets/Rectangles.svg'
import Squares from '../../../assets/Squares.svg'
import Plaid from '../../../assets/Plaid.svg'
import Lines from '../../../assets/Lines.svg'
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
    image: <img className='w-[499px] h-[342px]' src='./image 131.jpg' alt='description-image' />,
    backgroundImage: `url(${imagePath})`,
  },
  {
    title: 'One topic equals one neat spot for all files and info related to that case.P.S. Courtesy of DUN.',
    backgroundColor: '#CBB9CF',
    image: <img className='w-[499px] h-[342px]' src='./image 132.jpg' alt='description-image' />,
    backgroundImage: `url(${Squares})`,
  },
  {
    title: 'Every task is tied to a card, making it a breeze to dive into the details',
    backgroundColor: '#F5CBBC',
    image: <img className='w-[499px] h-[342px]' src='./image 133.jpg' alt='description-image' />,
    backgroundImage: `url(${Lines})`,
  },
  {
    title: 'Enjoy a clear and simple interface with DUN. No fuss, just straightforward ease!',
    backgroundColor: '#FFF5D2',
    image: <img className='w-[499px] h-[342px]' src='./image 134.jpg' alt='description-image' />,
    backgroundImage: `url(${Plaid})`,
  },
]


function Section2() {
  return (
    <>
      <div>
        <div className='grid w-full'>
          {FEATURES.map((item, index) => (
            <FeatureCard key={'feature-' + index} index={index} {...item} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Section2
