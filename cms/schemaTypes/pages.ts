export default {
  title: 'Pages',
  name: 'page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule: any) => rule.required(),
    },
    {
      name: 'description',
      title: 'Description (SEO)',
      type: 'text',
      description: 'A short description of the page',
      validation: (rule: any) => rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (rule: any) => rule.required(),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'multimediaContent',
      description: 'The page content of the post',
      validation: (rule: any) => rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
}
