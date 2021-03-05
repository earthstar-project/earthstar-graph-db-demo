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
    // set up our earthstar storage
    let workspace = '+test.ajfoiajojf';
    let author = generateAuthorKeypair('test');
    if (isErr(author)) { return; }
    let storage = new StorageMemory([ValidatorEs4], workspace);

    // save an edge
    let inputEdge: EdgeContent = {
        source: author.address,  // source is any string
        kind: 'LIKED',  // the kind of relationship represented by this edge
        dest: '/blog/posts/1.md',  // dest is any string
        owner: author.address,  // who can edit this edge in the future? or "common" for anyone
        data: '<3',  // optional data about this edge, like what emoji to show for the like
    }
    console.log('saving edge:', inputEdge);
    await writeEdge(storage, author, inputEdge);

    // make a query to find that edge again
    console.log();
    console.log('querying for edges');
    let graphQuery: GraphQuery = {
        // specify the properties you want to query for
        kind: 'LIKED',
        dest: '/blog/posts/1.md',
    }
    console.log('query', graphQuery);

    // actually do the query
    let edgeDocs = findEdges(storage, graphQuery);
    if (isErr(edgeDocs)) { return; }

    for (let doc of edgeDocs) {
        console.log();
        // show the earthstar document holding the edge
        console.log('found edge doc:', doc);
        // Grab the actual edge out of the document conten contentt.
        // This will match the one we originally wrote.
        let returnedEdge: EdgeContent = JSON.parse(doc.content);
        console.log('actual edge:', returnedEdge);
    }

    // We have to close the storage when we are done with it.
    storage.close();
    console.log();
}

main();
