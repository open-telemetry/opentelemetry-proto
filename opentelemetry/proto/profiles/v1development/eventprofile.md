# Proposal: Support Timestamped Profiling Events

**Author(s):** @felixge in collaboration with @thegreystone, @jbachorik et al.

**🚧 WORK IN PROGRESS 🚧:** This proposal is still in the early stages. I'm mostly looking for feedback from active participants in the profiling SIG before soliciting feedback from the wider community.

## Summary

The OpenTelemetry profiling format is currently designed to record aggregated summaries of events. This proposal suggests to pivot the format toward recording individual events with timestamps while retaining the ability to record aggregated profiling data as well.

This will enable the following use cases.

1. Richer analysis of On-CPU as well as Off-CPU data.
2. Powerful visualizations such as as Thread Timelines, Flame Charts, and FlameScopes.
3. Better compatibility with JFR, Go Execution Traces and Linux perf.

## Motivation

Most of the current OpenTelemetry profiling format, including the concept of aggregating stack traces, is inherited from pprof.
However, given that we have [decided](https://github.com/open-telemetry/opentelemetry-proto/issues/567#issuecomment-2286565449) that strict pprof compatibility is not a goal for the OpenTelemetry, we are now free to design a more flexible and extensible format that can be used for a wider range of profiling use cases than pprof.

One use case that recently came up is the [collection of Off-CPU profiling data for the ebpf profiler](https://github.com/open-telemetry/opentelemetry-ebpf-profiler/pull/144). The attendees of the [Sep 5](https://docs.google.com/document/d/19UqPPPlGE83N37MhS93uRlxsP1_wGxQ33Qv6CDHaEp0/edit?tab=t.0#heading=h.lenvx4xd62c6) SIG meeting agreed that aggregated profiling data is not ideal for this use case, as it increases the difficulty to reason about the collected data and to correlate it with application behavior. This is especially true when it comes to the analysis of tail latency problems caused by outliers. So instead aggregation, it is much more useful to record this data as individual events with timestamps as well as additional context such as thread id, trace id and span id. This becomes even more powerful when On-CPU samples are also recorded with timestamps, as it allows users to identify spikes and stalls of CPU activity as well as Off-CPU examplars that explain the cause of the stalls and resulting latency (or lack of throughput).

In addition to the manual analysis of such data, collecting timestamps also enables powerful visualizations such as [Thread Timelines](https://www.datadoghq.com/blog/continuous-profiler-timeline-view/), [Flame Charts](https://developer.chrome.com/docs/devtools/performance/reference#flame-chart), and [FlameScopes](https://www.brendangregg.com/blog/2018-11-08/flamescope-pattern-recognition.html). See [this document](https://docs.google.com/document/d/1285Rp1pSu6eOTInzPynCiJvDoG-r2cjqxWwTewaTncs/edit?tab=t.0#heading=h.jze26hdz58dy) or [this presentation](https://youtu.be/53UIPZfz-_U?si=x4uYpMtOCIJy8ihY) for more details.

Last but not least, first-class support for timestamps allows greater compatibility with other profiling tools such as JFR, Go Execution Traces and Linux perf that also record timestamps for profiling events.

## Design

This proposal comes with a prelimary sketch for the new format to illustrate the feasibility of supporting timestamped as well as aggregated profiling data within the same format. However, the final design will be subject to further discussion and refinement and the changes can be merged via smaller PRs if needed.

The goals for the design are to be a strict superset of pprof and a useful subset of JFR, Go Execution Traces and Linux perf. Efficiency is also a goal, but it is secondary to the goal of providing a flexible and extensible format that can be implemented by a wide range of profilers and analysis tools.

TODO: Finish describing the design from a high level.

## Examples

TODO: Add example for Go mutex and goroutine profiles.

### Aggregated CPU Profile

Below is a simple example of an aggregated CPU profile that demonstrates how the new format can operate in the same way as pprof.

```txtpb
event_types: [
    { # index 0
        name_string_index: 1 # cpu_sample
        unit_string_index: 2 # ms
        default_value:     10 # each Event.count represents 10ms of CPU time - this avoid redundant 
    }
]
strings: [
    "",           # index 0
    "cpu_sample", # index 1
    "ms"          # index 2
]

events: [
    {
        event_type_index: 0 # cpu_sample (can be omitted on the wire)
        stack_index:      1 # main;serve_request
        count:            2 # samples, i.e. 20ms of CPU time
    }
    {
        event_type_index: 0 # cpu_sample (can be omitted on the wire)
        stack_index:      2 # main;foo
        count:            1 # samples, i.e. 10ms of CPU time
    },
]

# stacks, locations, functions, mappings, etc. omitted for brevity
```

### Timestamped CPU Profile

```txtpb
event_types: [
    { # index 0
        name_string_index: 1  # cpu_sample
        unit_string_index: 2  # ms
        default_value:     10 # each event represents 10ms of CPU time
        clock_id:          0
    }
]
clocks: [
    { # index 0
        frequency :      1_000_000_000          # 1 Ghz clock, i.e. 1 cycle = 1 ns
        time_unix_nanos: 1_257_894_000_000_000_000
    }
]
attributes: [
    { # index 0
        key_index: 4          # thread.id
        value: {int_value: 1} # 1
    },
    { # index 1
        key_index: 4,         # thread.id
        value: {int_value: 2} # 2
    }
]
strings: [
    "",             # index 0
    "cpu_time",     # index 1
    "milliseconds", # index 2
    "unix_epoch",   # index 3
    "thread.id"     # index 4
]

events: [
    {
        event_type_index: 0     # cpu_sample (can be omitted on the wire)
        stack_index: 1          # main;serve_request
        time:        10_500_000 # 10.5ms since clock start
        attributes:  [0]        # thread_id: 1
    }
    {
        event_type_index: 0  # cpu_sample (can be omitted on the wire)
        stack_index: 2       # main;foo
        time:        300_000 # 0.3ms since previous event
        attributes:  [1]     # thread_id: 2
    },
    {
        event_type_index: 0    # cpu_sample (can be omitted on the wire)
        stack_index: 1         # main;serve_request
        time:        9_200_000 # 9.2ms since previous event
        attributes:  [0]       # thread_id: 1
    }
]
# stacks, locations, functions, mappings, etc. omitted for brevity
```

### Timestamped CPU Profile + Off-CPU Thread State Profile


```txtpb
event_types: [
    { # index 0
        name_string_index: 1  # "cpu_sample"
        unit_string_index: 2  # "ms"
        default_value:     10 # each event represents 10ms of CPU time
        clock_id:          0
    } 
    { # index 1
        name_string_index: 2  # "thread_state"
        clock_id:          0
    }
]
clocks: [
    { # index 0
        frequency :      1_000_000_000          # 1 Ghz clock, i.e. 1 cycle = 1 ns
        time_unix_nanos: 1_257_894_000_000_000_000
    }
]
attributes: [
    { # index 0
        key_index: 4          # thread.id
        value: {int_value: 1} # 1
    },
    { # index 1
        key_index: 4,         # thread.id
        value: {int_value: 2} # 2
    }
    { # index 2
        key_index: 5,         # thread.state
        value: {key_index: 6} # mutex
    }, # index 3
    {
        key_index: 5,         # thread.state
        value: {key_index: 7} # sleep
    }
]
strings: [
    "",             # index 0
    "cpu_sample",   # index 1
    "thread_state", # index 2
    "ms",           # index 3
    "thread.id",    # index 4
    "thread.state", # index 5
    "mutex",        # index 6
    "sleep",        # index 7
]

events: [
    {
        event_type_index: 0     # cpu_sample (can be omitted on the wire)
        stack_index: 1          # main;serve_request
        time:        10_500_000 # 10.5ms since clock start
        attributes:  [0]        # thread_id: 1
    }
    {
        event_type_index: 0     # cpu_sample (can be omitted on the wire)
        stack_index: 2          # main;foo
        time:        300_000    # 0.3ms since previous event
        attributes: [1]         # thread_id: 2
    },
    {
        event_type_index: 0     # cpu_sample (can be omitted on the wire)
        stack_index: 1          # main;serve_request
        time:        9_200_000  # 9.2ms since previous event
        attributes:  [0]        # thread_id: 1
    },
    {
        event_type_index: 1            # thread_state
        stack_index:      1            # main;serve_request;mutex_lock
        time:             300_000_000  # 300ms since previous event
        duration:         50_000_500   # 50ms
        attributes:       [0, 2]       # thread_id: 1, thread.state: mutex
    },
    {
        event_type_index: 1             # thread_state
        stack_index:      1             # main;foo;sleep
        time:             5_000_000     # 5ms since previous event
        duration:         1_000_000_500 # 1s
        attributes:       [1, 3]        # thread_id: 2, thread.state: sleep
    },
]
# stack, location, function, mapping, etc. omitted for brevity
```
### Aggregated Memory Profile

Below is an example of an aggregated memory profile like those available in Go.

```txtpb
event_types: [
    { # index 0
        name_string_index: 1 # allocations
        unit_string_index: 3 # By (bytes)
    }
    { # index 1
        name_string_index: 2 # liveheap
        unit_string_index: 3 # By (bytes)
    }
]
strings: [
    "",              # index 0
    "allocations",   # index 1
    "liveheap",      # index 2
    "By"             # index 3
]

events: [
    {
        event_type_index: 0    # allocations (can be omitted on the wire)
        stack_index:     1     # main;new_user
        count:           100   # objects allocated
        sum:             4_800 # bytes allocated
    }
    {
        event_type_index: 1   # liveheap
        stack_index:      1   # main;new_user
        count:            12  # objects alive
        sum:              576 # bytes alive
    }
    {
        event_type_index: 0      # allocations (can be omitted on the wire)
        stack_index:      2      # main;new_post
        count:            300    # objects allocated
        sum:              76_800 # bytes allocated
    }
    {
        event_type_index: 1     # liveheap
        stack_index:      2     # main;new_post
        count:            73    # objects alive
        sum:              18688 # bytes alive
    }
]

# stacks, locations, functions, mappings, etc. omitted for brevity
```

## Semantic Conventions

The following semantic conventions attributes should be added as part of this proposal:

* `thread.state`: The state of the thread, e.g. "running", "unscheduled", "sleeping", "mutex".
* `go.goroutine.id`: The id of the goroutine that the event was recorded on.
* `go.goroutine.state`: Like thread.state, but with goroutine specific wait states, e.g. "chansend".
* `go.proc.id`: The id of the go processor that the event was recorded on.

The following semantic conventions already exist and should be used where applicable:

* [`system.cpu.logical_number`](https://opentelemetry.io/docs/specs/semconv/system/system-metrics/) can be used to record which CPU an event was recorded on.
* [`thread.id`](https://opentelemetry.io/docs/specs/semconv/attributes-registry/thread/) can be used to record the id of the thread that the event was recorded on.
* [`thread.name`](https://opentelemetry.io/docs/specs/semconv/attributes-registry/thread/) can be used to record the name of the thread that the event was recorded on.