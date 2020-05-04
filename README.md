# gatsby-transformer-playlists

This Gatsby plugin leverages the YouTube API to add nodes for playlist and video information.

## How does it work?

The plugin looks for pages with a `playlists` entry in their [YAML frontmatter](https://www.gatsbyjs.org/docs/mdx/markdown-syntax/#frontmatter) like this:

```yaml
playlists:
  - name: alexa
    id: PL2yQDdvlhXf8d-EXLaKIt-naTcllN5Gzt
```

and fetches the relevant playlist and video information, adding it as child nodes to the page.  The `id` of a YouTube playlist can be found [in the url](https://www.youtube.com/playlist?list=PL2yQDdvlhXf8d-EXLaKIt-naTcllN5Gzt) and the `name` is just a way to make it easier to find via GraphQL later in your build process.

## Getting started

First, you'll need an API key -- follow [these instructions](https://developers.google.com/youtube/v3/getting-started) to get one.

Next, install this plugin into your Gatsby project with `npm install --save gatsby-transformer-playlists`.

Finally, add the plugin to the `plugins` array in `gatsby-config.js` like this:

```js
plugins: [
  {
    resolve: `gatsby-transformer-playlists`,
    options: {
      apiKey: process.env.YT_KEY
    }
  }
]
```

(or whatever secure mechanism you choose for supplying the API key created above).

This work resulting in this plugin was originally inspired by [this blog post](https://swizec.com/blog/youtube-data-source-gatsbyjs/swizec/8347).