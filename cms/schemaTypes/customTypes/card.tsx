import {defineType} from 'sanity'

export default defineType({
  name: 'card',
  title: 'Card',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    },

    {
      name: 'subtitle',
      title: 'Subtitle (optional)',
      type: 'string',
    },
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Vertical', value: 'vertical'},
          {title: 'Horizontal', value: 'horizontal'},
        ],
      },
      validation: (rule) => rule.required(),
    },
    {
      name: 'direction',
      title: 'Direction',
      type: 'string',
      options: {
        list: [
          {title: 'Right to Left', value: 'left'},
          {title: 'Left to Right', value: 'right'},
        ],
      },
      hidden: ({parent}) => parent?.layout !== 'horizontal',
      initialValue: 'right',
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
        },
      ],
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    },
    {
      name: 'actionButtons',
      title: 'Action Buttons',
      type: 'array',
      of: [
        {
          type: 'button',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      layout: 'layout',
      direction: 'direction',
      imageUrl: 'image.asset.url',
    },
    prepare({title, subtitle, layout, direction,imageUrl}) {
      return {
        title: title || 'Card',
        subtitle: subtitle || layout + ' - ' + direction,
        media: <img src={imageUrl} alt={title} />,
      }
    },
  },
})
