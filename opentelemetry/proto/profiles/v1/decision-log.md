# Decision #1
Spec must include an optional field for the original payload (e.g original JFR/pprof profile)

### Date
Jun 01 2023

### Context
Some formats (JFR) have advanced functinality that is too hard to generalize (e.g in JFR you can include custom events in your profiles)

### Alternatives Considered
* try to generalize it anyway, so that OTEL format is a subset of JFR
* discard such data

### Reasoning
* generalizing it is too hard, JFR allows for pretty much any kind of message
* discarding is not good, some percentage of users depend on custom JFR events

### Details
[SIG Meeting Notes from June 1 2023](https://docs.google.com/document/d/19UqPPPlGE83N37MhS93uRlxsP1_wGxQ33Qv6CDHaEp0/edit?usp=sharing)





# Decision #2
Use normalized representation of profiling data

### Date
Jun 29 2023

### Context
Profiling data is different than other signals in a way that it has heavy structures with many links between them.

### Alternatives Considered
Use denormalized represenation of profiling data

### Reasoning
Because profiling data has many heavy structures with many links between them, denormalized representation takes 10x more space compared to normalized version where each object references other objects by index

### Details
[Github Conversation](https://github.com/open-telemetry/opentelemetry-proto/pull/488#discussion_r1246163710)
[Github Conversation](https://github.com/open-telemetry/opentelemetry-proto/pull/488#pullrequestreview-1505265763)





# Decision #3
When referring to other structs use array indexes for references instead of ids

### Date
Jun 29 2023

### Context
in pprof references happen using ids, e.g {function_id=123}. this leads to confusion, as these ids almost always match array indexes. e.g "function" with id=1 will usually be in functions array at index 1.

### Alternatives Considered
Using ids instead of indexes

### Reasoning
* reduces confusion
* reduces serialized size
* improves performance since array lookup is faster than search (O(1) vs O(n)

### Details
[Github Conversation](https://github.com/open-telemetry/opentelemetry-proto/pull/488#discussion_r1248116971)





# Decision #4
Spec must include an optional Mapping struct from pprof

### Date
Jun 29 2023

### Context
pprof includes Mapping struct that describes relationships between functions and where those functions are located in the binary. This struct is rarely used in client implementations

### Alternatives Considered
Not include it to simplify spec

### Reasoning
It is useful when symbol information is supplied separately, e.g very common in linux

### Details
[SIG Meeting Notes from Jun 29 2023](https://docs.google.com/document/d/19UqPPPlGE83N37MhS93uRlxsP1_wGxQ33Qv6CDHaEp0/edit?usp=sharing)





# Decision #5
Internal references should be uint32

### Date
Jun 29 2023

### Context
there's many internal reference fields, e.g:
* location_id
* function_id
if they are > 32 bits then the payload is going to be too huge anyway

### Alternatives Considered
* use uint64


### Reasoning
* uint32 is big enough
* but it's better than uint64 because it will reduce struct size in go
* this will reduct collector memory footprint

### Details
[Github Conversation](https://github.com/open-telemetry/opentelemetry-proto/pull/488/files#r1246155907)





# Decision #6
Arrays of integers should be used instead of arrays of structs

### Date
Aug 23 2023

### Context

Samples are a collection of references to other messages plus a value. The standard way of representing those is to put each `Sample` into a separate message, and link from `Sample` to other messages. Parsing / generating such payloads creates many individual objects that runtime has to track.

An "arrays of integers" representation puts values of the same kind into separate arrays. This reduces the size of the resulting protobuf payload and the number of objects that need to be allocated to parse / generate such payload.

Here's pseudocode that illustrates the approach. Note that this example is simplified for the sake of clarity:

```
// normalized
"samples": [
  {
    "stacktrace_id": 1,
    "value": 100
  }, {
    "stacktrace_id": 2,
    "value": 200
  }
],

// arrays
"stacktrace_ids": [1, 2],
"values": [100, 200]
```

Benchmarking shows that this approach is more efficient in terms of CPU utilization, memory consumption and size of the resulting protobuf payload.

### Alternatives Considered

`normalized` represenation where we don't use arrays of integers, but arrays of structures instead


### Reasoning

* `arrays` representation is the most efficient in terms of CPU utilization, memory consumption and size of the resulting protobuf payload. It is however cognitively more complex to implement and understand.
* as presented in [Design Goals](#design-goals) section, the performance characteristics of the format are very important for the profiling signal
* the format is not intended to be used directly by the end users, but rather by the developers of profiling systems that are used to and are expected to be able to handle the complexity. It is not more complex than other existing formats

### Details

* [Benchmarking Results](https://docs.google.com/spreadsheets/d/1Q-6MlegV8xLYdz5WD5iPxQU2tsfodX1-CDV1WeGzyQ0/edit?usp=sharing)
