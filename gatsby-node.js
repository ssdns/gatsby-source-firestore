"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCreateNode = exports.sourceNodes = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const sourceNodes = async ({ actions: { createNode }, createContentDigest, createNodeId }, { types, databaseURL }) => {
    if (!firebase_admin_1.default.apps.length) {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.applicationDefault(),
            databaseURL,
        });
    }
    const db = firebase_admin_1.default.firestore();
    const createNodeTree = async (type, path, parent) => {
        const ref = type.query ? type.query(db.collection(path)) : db.collection(path);
        const snap = await ref.get();
        const promises = [];
        snap.forEach(doc => {
            promises.push(new Promise(async (resolve) => {
                const nodeId = createNodeId(`${path}/${doc.id}`);
                const data = type.map(doc.id, doc.data(), nodeId);
                createNode({
                    ...data,
                    id: nodeId,
                    parent,
                    children: [],
                    internal: {
                        type: type.type,
                        contentDigest: createContentDigest(data),
                    },
                });
                if (type.subCollections) {
                    await Promise.all(type.subCollections.map(type => createNodeTree(type, `${path}/${doc.id}/${type.collection}`, nodeId)));
                }
                resolve();
            }));
        });
        return Promise.all(promises);
    };
    await Promise.all(types.map(type => createNodeTree(type, type.collection, null)));
};
exports.sourceNodes = sourceNodes;
const onCreateNode = async ({ getNode, node, actions: { createParentChildLink }, }) => {
    if (node.internal.owner === "gatsby-source-firestore") {
        if (node.parent) {
            const parent = getNode(node.parent);
            if (parent) {
                createParentChildLink({ parent, child: node });
            }
        }
    }
};
exports.onCreateNode = onCreateNode;
