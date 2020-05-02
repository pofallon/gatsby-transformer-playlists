const PlaylistSummary = require('youtube-playlist-summary')

var ps

exports.onPreInit = (_, pluginOptions) => {
  if (pluginOptions.apiKey) {
    ps = new PlaylistSummary({ GOOGLE_API_KEY: pluginOptions.apiKey })
  } else {
    throw new Error('YouTube API key required')
  }
}

exports.onCreateNode = async ({ node, actions, createNodeId, createContentDigest }) => {
  const { createNode, createParentChildLink } = actions

  const makeNode = ({obj = {}, id, type, parent, children = []}) => {
    const thisNode = {
      ...obj,
      id,
      children,
      parent,
      internal: {
        contentDigest: createContentDigest(obj),
        type,
      },
    }
    createNode(thisNode)
    return id
  }

  const makeVideoNodes = (videos, parent) => {
    return videos.map(v => {
      const obj = {
        title: v.title,
        description: v.description,
        date: v.publishedAt,
        url: v.videoUrl,
      }
      return makeNode({ obj, id: v.videoId, type: 'playlistVideo', parent })
    })
  }

  if (node.frontmatter && node.frontmatter.playlists) {

    const playlists = node.frontmatter.playlists
    const playlistCollectionNodeId = createNodeId(`${node.id}-playlists`)

    const playlistNodeIds = await Promise.all(playlists.map(async (playlist) => {
      
      const results = await ps.getPlaylistItems(playlist.id)
      const videoNodeIds = makeVideoNodes(results.items, playlist.id)
      return makeNode({
        obj: { title: results.playlistTitle, name: playlist.name },
        id: playlist.id,
        type: 'playlist',
        children: videoNodeIds,
        parent: playlistCollectionNodeId
      })

    }))

    makeNode({ type: 'playlistCollection', id: playlistCollectionNodeId, children: playlistNodeIds })
    createParentChildLink({ parent: node, child: { id: playlistCollectionNodeId } })
  }
}