module.exports = {
  personAdded: {
    subscribe: (parent, args, { pubsub }) =>
      pubsub.asyncIterator(['PERSON_ADDED']),
  },
  stocksUpdated: {
    subscribe: (parent, args, { pubsub }) =>
      pubsub.asyncIterator(['STOCKS_UPDATED']),
  },
}
