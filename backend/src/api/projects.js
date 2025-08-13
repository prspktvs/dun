import { searchDocuments } from '../utils/typesense.js'

// Search projects by matching topics (cards) content. Returns unique projects with highlight snippets.
export const searchProjects = async (req, res) => {
  try {
    const { q } = req.query

    if (!q || String(q).trim().length === 0) {
      return res.json([])
    }

    const userId = req?.user?.user_id

    const results = await searchDocuments({
      q,
      query_by: 'title,content,author',
      // Search across all documents, but only those the user can access
      filter_by: `(author_id:=${userId} || user_ids:=${userId} || public:=true)`,
      highlight_fields: 'title,content',
      highlight_full_fields: 'content',
      highlight_affix_num_tokens: 4,
      highlight_start_tag: '<mark>',
      highlight_end_tag: '</mark>',
      per_page: 100,
    })

    // Group by project_id and pick first highlight per project
    const projectsMap = {}
    for (const hit of results?.hits || []) {
      const projectId = hit?.document?.project_id
      if (!projectId) continue
      if (!projectsMap[projectId]) {
        const titleSnippet = hit.highlights?.find((h) => h.field === 'title')?.snippet
        const contentSnippet = hit.highlights?.find((h) => h.field === 'content')?.snippet
        projectsMap[projectId] = {
          project_id: projectId,
          highlights: {
            title: titleSnippet || null,
            content: contentSnippet || null,
          },
        }
      }
    }

    const response = Object.values(projectsMap)
    return res.json(response)
  } catch (error) {
    console.error('searchProjects error', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

export default {}
