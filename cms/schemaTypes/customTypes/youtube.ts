import {defineType} from 'sanity'
import {PlayIcon} from '@sanity/icons'

export default defineType({
  name: 'youtube',
  type: 'object',
  title: 'Youtube Embed',
  icon: PlayIcon,
  description: 'Embed a youtube video',
  fields: [
    {
      name: 'url',
      title: 'url',
      type: 'url',
      description: 'Link to the Youtube video',
      validation: Rule => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title (optional)',
      type: 'string',
      description: 'Title of the video. Purely for the convenience of other editors',
    },
    {
      name:'width',
      title:'Width',
      type:'string',
      description:'Width of the video on larger screens',
      options:{
        list:[
          {title:'100%',value:'100%'},
          {title:'75%',value:'75%'},
          {title:'50%',value:'50%'},
        ],
        layout:'dropdown',
      }
    },
  ],
  preview: {
    select: {
      title: 'title',
      url: 'url',
    },
    prepare({title, url}) {
      return {
        title: title || url,
        media: PlayIcon,
      }
    },
  },
})
