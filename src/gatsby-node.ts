import admin from "firebase-admin"
import { GatsbyNode, PluginOptions, SourceNodesArgs } from "gatsby"

type Document = {
  type: string
  collection: string
  map: <T extends {}>(documentId: string, data: {}, nodeId: string) => T
  subCollections: Document[]
}

interface Options extends PluginOptions {
  types: Document[]
  databaseURL: string
}

export const sourceNodes: GatsbyNode["sourceNodes"] = async (
  { actions: { createNode }, createContentDigest, createNodeId }: SourceNodesArgs,
  { types, databaseURL }: Options
) => {
  // https://firebase.google.com/docs/admin/setup?hl=ja#initialize_the_sdk
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL,
  })
  const db = admin.firestore()

  const createNodeTree = async (type: Document, path: string, parent: string | null) => {
    const snap = await db.collection(path).get()
    const promises: Promise<void>[] = []
    snap.forEach(doc => {
      promises.push(
        new Promise(async resolve => {
          // The node’s ID. Must be globally unique.
          const nodeId = createNodeId(`${path}/${doc.id}`)
          const data = type.map(doc.id, doc.data(), nodeId)
          createNode({
            ...data,
            id: nodeId,
            parent,
            children: [],
            internal: {
              type: type.type,
              contentDigest: createContentDigest(data),
            },
          })
          if (type.subCollections) {
            await Promise.all(
              type.subCollections.map(type => createNodeTree(type, `${path}/${doc.id}/${type.collection}`, nodeId))
            )
          }
          resolve()
        })
      )
    })
    return Promise.all(promises)
  }

  return Promise.all(types.map(type => createNodeTree(type, type.collection, null)))
}

export const onCreateNode: GatsbyNode["onCreateNode"] = async ({
  getNode,
  node,
  actions: { createParentChildLink },
}) => {
  if (node.internal.owner === "gatsby-source-firestore") {
    if (node.parent) {
      const parent = getNode(node.parent)
      createParentChildLink({ parent, child: node })
    }
  }
}
