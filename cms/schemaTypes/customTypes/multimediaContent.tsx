import {defineType, defineArrayMember} from 'sanity'

import {AlignCenter, ALargeSmall} from 'lucide-react'

import {TextAlignCenter, MutedText} from './customMarkRenderers'

export default defineType({
  name: 'multimediaContent',
  title: 'Multimedia Content Body',
  type: 'array',
  // description:"Combine paragraphs, images, buttons, and more to create visually engaging content.",
  of: [
    defineArrayMember({
      type: 'block',
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Code', value: 'code'},
          {
            title: 'Center',
            value: 'center',
            icon: <AlignCenter style={{width:"1em", height:"1em"}}/>,
            component: (props) => TextAlignCenter(props),
          },
          {
            title:"Muted",
            value:"muted",
            icon:<ALargeSmall style={{width:"1em", height:"1em", opacity:".5"}}/>,
            component: (props) => MutedText(props),
          }
        ],
      },
    }),
    defineArrayMember({
      type: 'button',
    }),
    defineArrayMember({
      type: 'card',
    }),
    defineArrayMember({
      type: 'youtube',
    }),
    {
      type: 'image',
      options: {
        hotspot: true,
      },
    },
  ],
})
