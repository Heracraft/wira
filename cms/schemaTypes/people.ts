export default {
  name: 'person',
  title: 'Person',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule: any) => rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    //   validation: (rule: any) => rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      validation: (rule: any) => rule.required(),
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
    }
  ],
  preview:{
    select:{
        title: 'name',
        subtitle: 'title',
        media: 'image'
    }
  }
}
