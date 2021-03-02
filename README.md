# gatsby-source-firestore
Supports incremental build

## install
```
yarn add https://github.com/ssdns/gatsby-source-firestore#1.0.0
```

provide ```GOOGLE_APPLICATION_CREDENTIALS``` environment variables
(https://cloud.google.com/docs/authentication/production#auth-cloud-implicit-nodejs)
(https://firebase.google.com/docs/admin/setup#initialize_the_sdk)


```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-firestore",
      options: {
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        types: [
          {
            type: "Author",
            collection: "authors",
            map: (documentId, data, _nodeId) => ({
              ...data,
              documentId,
            }),
            subCollections: [
              {
                type: "Book",
                collection: "books",
                // gatsby node’s ID must be globally unique. avoid using firestore documentId as id
                map: (documentId, data, _nodeId) => (
                  const createdAt = data.createdAt.toDate()
                  return {
                    ...data,
                    documentId,
                    createdAt,
                  }
                },
              },
            ],
          },
        ],
      },
    },
  ],
}
```

## GraphQL query example
```graphql
{
  allAuthor {
    edges {
      node {
        id
        documentId
        childrenBook {
          id
          documentId
          createdAt
        }
      }
    }
  }
}
```
