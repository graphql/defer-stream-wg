# Defer Solution Criteria

This document sketches out the potential goals that a proposed solution might
attempt to fulfill.

Criteria have been given a "score" according to their relative importance in
solving the problem laid out in this RFC while adhering to the GraphQL Spec
Guiding Principles. The scores are:

- **Critical** - The WG has determined that these are the most critical
  criteria. Any solution that does not meet this criteria will not be
  considered.
- **Major** - The WG would strongly prefer that the accepted solution meets this
  criteria.
- **Minor** - A nice-to-have

## 🎯 A. Clients must be able to determine when all fields under a deferred fragment have been delivered.

_Score: **Critical**_

Product developers are expected to put all fields that should be deferred
together in the same deferred fragment. Clients must be able to determine both
when a given grouping of fields have been delivered, so it can notify the
associated product code.

## 🎯 B. Execution Deduplication

_Score: **Critical**_

If a field is in both a deferred and non-deferred part of the operation, or in
two ore separately deferred parts of an operation, the GraphQL server must not
execute this field more than once.

## 🎯 C. Final reconcilable object

_Score: **Critical**_

Clients must be able to apply all subsequent responses to the initial result to
create a fully reconciled version of the GraphQL response. For each path in the
fully reconciled response, there must be only one value.

## 🎯 D. Minimize result amplification

_Score: **Major**_

If we deliver full selection sets for each unique defer, the amount of data we
deliver could be many times higher than if the `@defer` is ignored - not just
the redundant data from the selection sets but the path data used to identify it
in the payload. A situation like this issue can be replicated without
defer/stream by having many aliased copies of `friends` in the query, but this
is arguably easier to guard against.

See:
https://github.com/robrichard/defer-stream-wg/discussions/52#discussioncomment-3820950

## 🎯 E. Payloads must be actionable (no greedy delivery)

_Score: **Minor**_

Servers should not send payloads to the client that are not actionable. An
example of this is if the server sends some of the fields from a deferred
fragment, while other fields are not yet ready. This data is not actionable to
the client because it must wait for the entire fragment to be completed before
it can notify the product code that the deferred fragment is ready (see
`Criteria A`).

## 🎯 F. Fragment consistency

_Score: **Major**_

All fields queried in a fragment must be delivered together. The "typename hack"
(an unique alias on the `__typename` field) is a method to determine if a
GraphQL fragment has been fulfilled.

Example:

```graphql
{
  me {
    id
    avatarUrl
  }
  ...Stats @defer
}

fragment Stats on Query {
  Footer: __typename
  me {
    friends {
      totalCount
    }
  }
}
```

Clients must be able to use the presence of `"Footer": "Query"` to determine
that the entire `Stats` fragment has been delivered.

## 🎯 G. Fields can be deferred independently

_Score: **Major**_

Product developers should be able to defer fields independently, either by
placing them in separate deferred fragments or via another method. These
independently deferred fields should be delivered when they are ready, without
being blocked by the execution of one another. Solutions that merge deferred
fragments with the same path or label will pass this criteria as they still
provide a mechanism to allow fields to be independently deferred.

## 🎯 H. Server should be able to inline individual @defer/@stream directives

_Score: **Major**_

A server should be able to inline a given defer directive, i.e. treat it the
same as if it's `if` argument was set to `false`. Possible reasons for this
include, but are not limited to

- Not degrading server performance
- a server determining it would lead to better client performance if the
  deferred data was inlined
- the deferred fields are proxied to a different GraphQL server that does not
  support defer

## 🎯 I. Server can start executing deferred fields before initial result is completed

_Score: **Minor**_

A server should be able to start executing deferred fields without waiting until
the entire initial result is complete. If a server is required to wait, it could
stretch out the execution time of a single operation by many times the amount of
time spent on a similar operation without defers.

## 🎯 J. Patching should be cheap (no deep merges)

_Score: **Minor**_

It should be simple for a client to apply incremental results without requiring
many deep object merges.

## 🎯 K. Error bubbling

_Score: **Minor**_

Since it is not possible to travel back in time to null out previously sent
results, error bubbling should work in an intuitive way

## 🎯 L. Clients do not need to add fields to identify resolved data

_Score: **Minor**_

Clients should not be required to add fields like `__typename` to deferred
fragments able to understand when this fragment has been delivered. Metadata
like `path` and `label` should uniquely identify which defer the delivered data
is associated with.

## 🎯 M. Deduplicate fields

_Score: **Minor**_

The same fields should not be delivered to the client multiple times,
unnecessarily increasing the data transferred.

## 🎯 N. Thrashing should be minimized

_Score: **Minor**_

Incremental results should be able to be batched, and clients should be able to
apply all of the batched updates before triggering a re-render.

## 🎯 O. Possible incremental payload shapes should be predictable

_Score: **Minor**_

Predicable payload shapes are beneficial for statically typed clients

## 🎯 P. Full fragment returned in each payload

_Score: **Minor**_

A close representation of the fragment response should be returned in payloads,
allowing clients to render directly from the incremental responses without
building on prior results.
