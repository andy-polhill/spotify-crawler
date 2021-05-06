import gremlin from 'gremlin';

const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const Graph = gremlin.structure.Graph;

const dc = new DriverRemoteConnection('wss://spotify-artists.cluster-cesnb3gpnlci.eu-west-2.neptune.amazonaws.com:8182/gremlin',{});

console.log(dc);

const graph = new Graph();
const g = graph.traversal().withRemote(dc);

console.log(g);

const createVertex = async (vertexId, vlabel) => {
  const vertex = await g.addV(vlabel)
    .property('id', vertexId)
    .property('lastname', 'Tinkerpop') // default database cardinality
    .next();

  return vertex.value;
};

const vertex = await createVertex(1234, 'andy')
console.log(vertex);

g.V().limit(1).count().next().
  then(data => {
    console.log(data);
    dc.close();
  }).catch(error => {
    console.log('ERROR', error);
    dc.close();
  });
