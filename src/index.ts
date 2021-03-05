import {
    StorageMemory,
    ValidatorEs4,
    generateAuthorKeypair,
    isErr,
} from 'earthstar';
import {
    EdgeContent,
    GraphQuery,
    findEdges,
    writeEdge,
} from 'earthstar-graph-db'

let main = async () => {
    let workspace = '+test.ajfoiajojf';
    let author = generateAuthorKeypair('test');
    if (isErr(author)) { return; }
    let storage = new StorageMemory([ValidatorEs4], workspace);

    let inputEdge: EdgeContent = {
        source: author.address,
        kind: 'LIKED',
        dest: '/blog/posts/1.md',
        owner: author.address,  // who can edit this edge in the future
        data: '<3',  // optional data about this edge, like what emoji to show for the like
    }
    console.log('saving edge:', inputEdge);
    await writeEdge(storage, author, inputEdge);

    console.log();
    console.log('querying for edges');
    let graphQuery: GraphQuery = {
        kind: 'LIKED',
        dest: '/blog/posts/1.md',
    }
    console.log('query', graphQuery);
    let edgeDocs = findEdges(storage, graphQuery);
    if (isErr(edgeDocs)) { return; }

    for (let doc of edgeDocs) {
        console.log();
        console.log('found edge doc:', doc);
        let returnedEdge: EdgeContent = JSON.parse(doc.content);
        console.log('actual edge:', returnedEdge);
    }

    console.log();
    storage.close();
}

main();
