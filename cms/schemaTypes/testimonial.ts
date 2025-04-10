export default {
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule: any) => rule.required(),
      description: 'A short title for the testimonial',
    },
    {
      name: 'person',
      title: 'Person',
      type: 'reference',
      to: {type: 'person'},
      validation: (rule: any) => rule.required(),
      description: 'A reference to the person giving the testimonial',
    },
    {
      name: 'testimonial',
      title: 'Testimonial',
      type: 'text',
      description: 'The testimonial text',
      validation: (rule: any) => rule.required(),
    },
  ],
}
