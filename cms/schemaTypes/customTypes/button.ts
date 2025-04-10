import {defineType} from 'sanity'

export default defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  fields: [
    {
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'The text that appears on the button',
      validation: (rule) => rule.required(),
    },
    {
      name: 'url',
      title: 'URL',
      type: 'string',
      description:
        'The URL that the button links to. If specified, the button will be lead to a url',
    },
    {
      name: 'variant',
      title: 'Variant',
      type: 'string',
      description: 'The variant of the button. This will determine the style of the button',
      initialValue: 'default',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Secondary', value: 'secondary'},
          {title: 'Outline', value: 'outline'},
          {title: 'Ghost', value: 'ghost'},
        ],
      },
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      initialValue: 'external',
      description: 'The type of the URL. If external, the button will open a new tab',
      options: {
        list: [
          {
            title: 'Internal',
            value: 'internal',
          },
          {
            title: 'External',
            value: 'external',
          },
        ],
      },
    },
  ],
  preview: {
    select: {
      title: 'label',
      type: 'type',
      variant: 'variant',
    },
    prepare({title, type, variant}) {
      return {
        title: title || 'Button',
        subtitle: variant + ' - ' + type,
      }
    },
  },
})
