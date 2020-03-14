// Code generated by protoc-gen-go. DO NOT EDIT.
// source: opentelemetry/proto/trace/v1/trace.proto

package v1

import (
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	v11 "github.com/open-telemetry/opentelemetry-proto/gen/go/common/v1"
	v1 "github.com/open-telemetry/opentelemetry-proto/gen/go/resource/v1"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion3 // please upgrade the proto package

// SpanKind is the type of span. Can be used to specify additional relationships between spans
// in addition to a parent/child relationship.
type Span_SpanKind int32

const (
	// Unspecified. Do NOT use as default.
	// Implementations MAY assume SpanKind to be INTERNAL when receiving UNSPECIFIED.
	Span_SPAN_KIND_UNSPECIFIED Span_SpanKind = 0
	// Indicates that the span represents an internal operation within an application,
	// as opposed to an operations happening at the boundaries. Default value.
	Span_INTERNAL Span_SpanKind = 1
	// Indicates that the span covers server-side handling of an RPC or other
	// remote network request.
	Span_SERVER Span_SpanKind = 2
	// Indicates that the span describes a request to some remote service.
	Span_CLIENT Span_SpanKind = 3
	// Indicates that the span describes a producer sending a message to a broker.
	// Unlike CLIENT and SERVER, there is often no direct critical path latency relationship
	// between producer and consumer spans. A PRODUCER span ends when the message was accepted
	// by the broker while the logical processing of the message might span a much longer time.
	Span_PRODUCER Span_SpanKind = 4
	// Indicates that the span describes consumer receiving a message from a broker.
	// Like the PRODUCER kind, there is often no direct critical path latency relationship
	// between producer and consumer spans.
	Span_CONSUMER Span_SpanKind = 5
)

var Span_SpanKind_name = map[int32]string{
	0: "SPAN_KIND_UNSPECIFIED",
	1: "INTERNAL",
	2: "SERVER",
	3: "CLIENT",
	4: "PRODUCER",
	5: "CONSUMER",
}

var Span_SpanKind_value = map[string]int32{
	"SPAN_KIND_UNSPECIFIED": 0,
	"INTERNAL":              1,
	"SERVER":                2,
	"CLIENT":                3,
	"PRODUCER":              4,
	"CONSUMER":              5,
}

func (x Span_SpanKind) String() string {
	return proto.EnumName(Span_SpanKind_name, int32(x))
}

func (Span_SpanKind) EnumDescriptor() ([]byte, []int) {
	return fileDescriptor_5c407ac9c675a601, []int{2, 0}
}

// StatusCode mirrors the codes defined at
// https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/api-tracing.md#statuscanonicalcode
type Status_StatusCode int32

const (
	Status_Ok                 Status_StatusCode = 0
	Status_Cancelled          Status_StatusCode = 1
	Status_UnknownError       Status_StatusCode = 2
	Status_InvalidArgument    Status_StatusCode = 3
	Status_DeadlineExceeded   Status_StatusCode = 4
	Status_NotFound           Status_StatusCode = 5
	Status_AlreadyExists      Status_StatusCode = 6
	Status_PermissionDenied   Status_StatusCode = 7
	Status_ResourceExhausted  Status_StatusCode = 8
	Status_FailedPrecondition Status_StatusCode = 9
	Status_Aborted            Status_StatusCode = 10
	Status_OutOfRange         Status_StatusCode = 11
	Status_Unimplemented      Status_StatusCode = 12
	Status_InternalError      Status_StatusCode = 13
	Status_Unavailable        Status_StatusCode = 14
	Status_DataLoss           Status_StatusCode = 15
	Status_Unauthenticated    Status_StatusCode = 16
)

var Status_StatusCode_name = map[int32]string{
	0:  "Ok",
	1:  "Cancelled",
	2:  "UnknownError",
	3:  "InvalidArgument",
	4:  "DeadlineExceeded",
	5:  "NotFound",
	6:  "AlreadyExists",
	7:  "PermissionDenied",
	8:  "ResourceExhausted",
	9:  "FailedPrecondition",
	10: "Aborted",
	11: "OutOfRange",
	12: "Unimplemented",
	13: "InternalError",
	14: "Unavailable",
	15: "DataLoss",
	16: "Unauthenticated",
}

var Status_StatusCode_value = map[string]int32{
	"Ok":                 0,
	"Cancelled":          1,
	"UnknownError":       2,
	"InvalidArgument":    3,
	"DeadlineExceeded":   4,
	"NotFound":           5,
	"AlreadyExists":      6,
	"PermissionDenied":   7,
	"ResourceExhausted":  8,
	"FailedPrecondition": 9,
	"Aborted":            10,
	"OutOfRange":         11,
	"Unimplemented":      12,
	"InternalError":      13,
	"Unavailable":        14,
	"DataLoss":           15,
	"Unauthenticated":    16,
}

func (x Status_StatusCode) String() string {
	return proto.EnumName(Status_StatusCode_name, int32(x))
}

func (Status_StatusCode) EnumDescriptor() ([]byte, []int) {
	return fileDescriptor_5c407ac9c675a601, []int{3, 0}
}

// A collection of InstrumentationLibrarySpans from a Resource.
type ResourceSpans struct {
	// The resource for the spans in this message.
	// If this field is not set then no resource info is known.
	Resource *v1.Resource `protobuf:"bytes,1,opt,name=resource,proto3" json:"resource,omitempty"`
	// A list of InstrumentationLibrarySpans that originate from a resource.
	InstrumentationLibrarySpans []*InstrumentationLibrarySpans `protobuf:"bytes,2,rep,name=instrumentation_library_spans,json=instrumentationLibrarySpans,proto3" json:"instrumentation_library_spans,omitempty"`
	XXX_NoUnkeyedLiteral        struct{}                       `json:"-"`
	XXX_unrecognized            []byte                         `json:"-"`
	XXX_sizecache               int32                          `json:"-"`
}

func (m *ResourceSpans) Reset()         { *m = ResourceSpans{} }
func (m *ResourceSpans) String() string { return proto.CompactTextString(m) }
func (*ResourceSpans) ProtoMessage()    {}
func (*ResourceSpans) Descriptor() ([]byte, []int) {
	return fileDescriptor_5c407ac9c675a601, []int{0}
}

func (m *ResourceSpans) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_ResourceSpans.Unmarshal(m, b)
}
func (m *ResourceSpans) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_ResourceSpans.Marshal(b, m, deterministic)
}
func (m *ResourceSpans) XXX_Merge(src proto.Message) {
	xxx_messageInfo_ResourceSpans.Merge(m, src)
}
func (m *ResourceSpans) XXX_Size() int {
	return xxx_messageInfo_ResourceSpans.Size(m)
}
func (m *ResourceSpans) XXX_DiscardUnknown() {
	xxx_messageInfo_ResourceSpans.DiscardUnknown(m)
}

var xxx_messageInfo_ResourceSpans proto.InternalMessageInfo

func (m *ResourceSpans) GetResource() *v1.Resource {
	if m != nil {
		return m.Resource
	}
	return nil
}

func (m *ResourceSpans) GetInstrumentationLibrarySpans() []*InstrumentationLibrarySpans {
	if m != nil {
		return m.InstrumentationLibrarySpans
	}
	return nil
}

// A collection of Spans produced by an InstrumentationLibrary.
type InstrumentationLibrarySpans struct {
	// The instrumentation library information for the spans in this message.
	// If this field is not set then no library info is known.
	InstrumentationLibrary *v11.InstrumentationLibrary `protobuf:"bytes,1,opt,name=instrumentation_library,json=instrumentationLibrary,proto3" json:"instrumentation_library,omitempty"`
	// A list of Spans that originate from an instrumentation library.
	Spans                []*Span  `protobuf:"bytes,2,rep,name=spans,proto3" json:"spans,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *InstrumentationLibrarySpans) Reset()         { *m = InstrumentationLibrarySpans{} }
func (m *InstrumentationLibrarySpans) String() string { return proto.CompactTextString(m) }
func (*InstrumentationLibrarySpans) ProtoMessage()    {}
func (*InstrumentationLibrarySpans) Descriptor() ([]byte, []int) {
	return fileDescriptor_5c407ac9c675a601, []int{1}
}

func (m *InstrumentationLibrarySpans) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_InstrumentationLibrarySpans.Unmarshal(m, b)
}
func (m *InstrumentationLibrarySpans) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_InstrumentationLibrarySpans.Marshal(b, m, deterministic)
}
func (m *InstrumentationLibrarySpans) XXX_Merge(src proto.Message) {
	xxx_messageInfo_InstrumentationLibrarySpans.Merge(m, src)
}
func (m *InstrumentationLibrarySpans) XXX_Size() int {
	return xxx_messageInfo_InstrumentationLibrarySpans.Size(m)
}
func (m *InstrumentationLibrarySpans) XXX_DiscardUnknown() {
	xxx_messageInfo_InstrumentationLibrarySpans.DiscardUnknown(m)
}

var xxx_messageInfo_InstrumentationLibrarySpans proto.InternalMessageInfo

func (m *InstrumentationLibrarySpans) GetInstrumentationLibrary() *v11.InstrumentationLibrary {
	if m != nil {
		return m.InstrumentationLibrary
	}
	return nil
}

func (m *InstrumentationLibrarySpans) GetSpans() []*Span {
	if m != nil {
		return m.Spans
	}
	return nil
}

// Span represents a single operation within a trace. Spans can be
// nested to form a trace tree. Spans may also be linked to other spans
// from the same or different trace and form graphs. Often, a trace
// contains a root span that describes the end-to-end latency, and one
// or more subspans for its sub-operations. A trace can also contain
// multiple root spans, or none at all. Spans do not need to be
// contiguous - there may be gaps or overlaps between spans in a trace.
//
// The next available field id is 17.
type Span struct {
	// A unique identifier for a trace. All spans from the same trace share
	// the same `trace_id`. The ID is a 16-byte array. An ID with all zeroes
	// is considered invalid.
	//
	// This field is semantically required. Receiver should generate new
	// random trace_id if empty or invalid trace_id was received.
	//
	// This field is required.
	TraceId []byte `protobuf:"bytes,1,opt,name=trace_id,json=traceId,proto3" json:"trace_id,omitempty"`
	// A unique identifier for a span within a trace, assigned when the span
	// is created. The ID is an 8-byte array. An ID with all zeroes is considered
	// invalid.
	//
	// This field is semantically required. Receiver should generate new
	// random span_id if empty or invalid span_id was received.
	//
	// This field is required.
	SpanId []byte `protobuf:"bytes,2,opt,name=span_id,json=spanId,proto3" json:"span_id,omitempty"`
	// trace_state conveys information about request position in multiple distributed tracing graphs.
	// It is a trace_state in w3c-trace-context format: https://www.w3.org/TR/trace-context/#tracestate-header
	// See also https://github.com/w3c/distributed-tracing for more details about this field.
	TraceState string `protobuf:"bytes,3,opt,name=trace_state,json=traceState,proto3" json:"trace_state,omitempty"`
	// The `span_id` of this span's parent span. If this is a root span, then this
	// field must be empty. The ID is an 8-byte array.
	ParentSpanId []byte `protobuf:"bytes,4,opt,name=parent_span_id,json=parentSpanId,proto3" json:"parent_span_id,omitempty"`
	// A description of the span's operation.
	//
	// For example, the name can be a qualified method name or a file name
	// and a line number where the operation is called. A best practice is to use
	// the same display name at the same call point in an application.
	// This makes it easier to correlate spans in different traces.
	//
	// This field is semantically required to be set to non-empty string.
	// When null or empty string received - receiver may use string "name"
	// as a replacement. There might be smarted algorithms implemented by
	// receiver to fix the empty span name.
	//
	// This field is required.
	Name string `protobuf:"bytes,5,opt,name=name,proto3" json:"name,omitempty"`
	// Distinguishes between spans generated in a particular context. For example,
	// two spans with the same name may be distinguished using `CLIENT` (caller)
	// and `SERVER` (callee) to identify queueing latency associated with the span.
	Kind Span_SpanKind `protobuf:"varint,6,opt,name=kind,proto3,enum=opentelemetry.proto.trace.v1.Span_SpanKind" json:"kind,omitempty"`
	// start_time_unixnano is the start time of the span. On the client side, this is the time
	// kept by the local machine where the span execution starts. On the server side, this
	// is the time when the server's application handler starts running.
	// Value is UNIX Epoch time in nanoseconds since 00:00:00 UTC on 1 January 1970.
	//
	// This field is semantically required and it is expected that end_time >= start_time.
	StartTimeUnixnano uint64 `protobuf:"fixed64,7,opt,name=start_time_unixnano,json=startTimeUnixnano,proto3" json:"start_time_unixnano,omitempty"`
	// end_time_unixnano is the end time of the span. On the client side, this is the time
	// kept by the local machine where the span execution ends. On the server side, this
	// is the time when the server application handler stops running.
	// Value is UNIX Epoch time in nanoseconds since 00:00:00 UTC on 1 January 1970.
	//
	// This field is semantically required and it is expected that end_time >= start_time.
	EndTimeUnixnano uint64 `protobuf:"fixed64,8,opt,name=end_time_unixnano,json=endTimeUnixnano,proto3" json:"end_time_unixnano,omitempty"`
	// attributes is a collection of key/value pairs. The value can be a string,
	// an integer, a double or the Boolean values `true` or `false`. Note, global attributes
	// like server name can be set using the resource API. Examples of attributes:
	//
	//     "/http/user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36"
	//     "/http/server_latency": 300
	//     "abc.com/myattribute": true
	//     "abc.com/score": 10.239
	Attributes []*v11.AttributeKeyValue `protobuf:"bytes,9,rep,name=attributes,proto3" json:"attributes,omitempty"`
	// dropped_attributes_count is the number of attributes that were discarded. Attributes
	// can be discarded because their keys are too long or because there are too many
	// attributes. If this value is 0, then no attributes were dropped.
	DroppedAttributesCount uint32 `protobuf:"varint,10,opt,name=dropped_attributes_count,json=droppedAttributesCount,proto3" json:"dropped_attributes_count,omitempty"`
	// events is a collection of Event items.
	Events []*Span_Event `protobuf:"bytes,11,rep,name=events,proto3" json:"events,omitempty"`
	// dropped_events_count is the number of dropped events. If the value is 0, then no
	// events were dropped.
	DroppedEventsCount uint32 `protobuf:"varint,12,opt,name=dropped_events_count,json=droppedEventsCount,proto3" json:"dropped_events_count,omitempty"`
	// links is a collection of Links, which are references from this span to a span
	// in the same or different trace.
	Links []*Span_Link `protobuf:"bytes,13,rep,name=links,proto3" json:"links,omitempty"`
	// dropped_links_count is the number of dropped links after the maximum size was
	// enforced. If this value is 0, then no links were dropped.
	DroppedLinksCount uint32 `protobuf:"varint,14,opt,name=dropped_links_count,json=droppedLinksCount,proto3" json:"dropped_links_count,omitempty"`
	// An optional final status for this span. Semantically when Status
	// wasn't set it is means span ended without errors and assume
	// Status.Ok (code = 0).
	Status               *Status  `protobuf:"bytes,15,opt,name=status,proto3" json:"status,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Span) Reset()         { *m = Span{} }
func (m *Span) String() string { return proto.CompactTextString(m) }
func (*Span) ProtoMessage()    {}
func (*Span) Descriptor() ([]byte, []int) {
	return fileDescriptor_5c407ac9c675a601, []int{2}
}

func (m *Span) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Span.Unmarshal(m, b)
}
func (m *Span) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Span.Marshal(b, m, deterministic)
}
func (m *Span) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Span.Merge(m, src)
}
func (m *Span) XXX_Size() int {
	return xxx_messageInfo_Span.Size(m)
}
func (m *Span) XXX_DiscardUnknown() {
	xxx_messageInfo_Span.DiscardUnknown(m)
}

var xxx_messageInfo_Span proto.InternalMessageInfo

func (m *Span) GetTraceId() []byte {
	if m != nil {
		return m.TraceId
	}
	return nil
}

func (m *Span) GetSpanId() []byte {
	if m != nil {
		return m.SpanId
	}
	return nil
}

func (m *Span) GetTraceState() string {
	if m != nil {
		return m.TraceState
	}
	return ""
}

func (m *Span) GetParentSpanId() []byte {
	if m != nil {
		return m.ParentSpanId
	}
	return nil
}

func (m *Span) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *Span) GetKind() Span_SpanKind {
	if m != nil {
		return m.Kind
	}
	return Span_SPAN_KIND_UNSPECIFIED
}

func (m *Span) GetStartTimeUnixnano() uint64 {
	if m != nil {
		return m.StartTimeUnixnano
	}
	return 0
}

func (m *Span) GetEndTimeUnixnano() uint64 {
	if m != nil {
		return m.EndTimeUnixnano
	}
	return 0
}

func (m *Span) GetAttributes() []*v11.AttributeKeyValue {
	if m != nil {
		return m.Attributes
	}
	return nil
}

func (m *Span) GetDroppedAttributesCount() uint32 {
	if m != nil {
		return m.DroppedAttributesCount
	}
	return 0
}

func (m *Span) GetEvents() []*Span_Event {
	if m != nil {
		return m.Events
	}
	return nil
}

func (m *Span) GetDroppedEventsCount() uint32 {
	if m != nil {
		return m.DroppedEventsCount
	}
	return 0
}

func (m *Span) GetLinks() []*Span_Link {
	if m != nil {
		return m.Links
	}
	return nil
}

func (m *Span) GetDroppedLinksCount() uint32 {
	if m != nil {
		return m.DroppedLinksCount
	}
	return 0
}

func (m *Span) GetStatus() *Status {
	if m != nil {
		return m.Status
	}
	return nil
}

// Event is a time-stamped annotation of the span, consisting of user-supplied
// text description and key-value pairs.
type Span_Event struct {
	// time_unixnano is the time the event occurred.
	TimeUnixnano uint64 `protobuf:"fixed64,1,opt,name=time_unixnano,json=timeUnixnano,proto3" json:"time_unixnano,omitempty"`
	// name of the event.
	// This field is semantically required to be set to non-empty string.
	Name string `protobuf:"bytes,2,opt,name=name,proto3" json:"name,omitempty"`
	// attributes is a collection of attribute key/value pairs on the event.
	Attributes []*v11.AttributeKeyValue `protobuf:"bytes,3,rep,name=attributes,proto3" json:"attributes,omitempty"`
	// dropped_attributes_count is the number of dropped attributes. If the value is 0,
	// then no attributes were dropped.
	DroppedAttributesCount uint32   `protobuf:"varint,4,opt,name=dropped_attributes_count,json=droppedAttributesCount,proto3" json:"dropped_attributes_count,omitempty"`
	XXX_NoUnkeyedLiteral   struct{} `json:"-"`
	XXX_unrecognized       []byte   `json:"-"`
	XXX_sizecache          int32    `json:"-"`
}

func (m *Span_Event) Reset()         { *m = Span_Event{} }
func (m *Span_Event) String() string { return proto.CompactTextString(m) }
func (*Span_Event) ProtoMessage()    {}
func (*Span_Event) Descriptor() ([]byte, []int) {
	return fileDescriptor_5c407ac9c675a601, []int{2, 0}
}

func (m *Span_Event) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Span_Event.Unmarshal(m, b)
}
func (m *Span_Event) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Span_Event.Marshal(b, m, deterministic)
}
func (m *Span_Event) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Span_Event.Merge(m, src)
}
func (m *Span_Event) XXX_Size() int {
	return xxx_messageInfo_Span_Event.Size(m)
}
func (m *Span_Event) XXX_DiscardUnknown() {
	xxx_messageInfo_Span_Event.DiscardUnknown(m)
}

var xxx_messageInfo_Span_Event proto.InternalMessageInfo

func (m *Span_Event) GetTimeUnixnano() uint64 {
	if m != nil {
		return m.TimeUnixnano
	}
	return 0
}

func (m *Span_Event) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *Span_Event) GetAttributes() []*v11.AttributeKeyValue {
	if m != nil {
		return m.Attributes
	}
	return nil
}

func (m *Span_Event) GetDroppedAttributesCount() uint32 {
	if m != nil {
		return m.DroppedAttributesCount
	}
	return 0
}

// A pointer from the current span to another span in the same trace or in a
// different trace. For example, this can be used in batching operations,
// where a single batch handler processes multiple requests from different
// traces or when the handler receives a request from a different project.
type Span_Link struct {
	// A unique identifier of a trace that this linked span is part of. The ID is a
	// 16-byte array.
	TraceId []byte `protobuf:"bytes,1,opt,name=trace_id,json=traceId,proto3" json:"trace_id,omitempty"`
	// A unique identifier for the linked span. The ID is an 8-byte array.
	SpanId []byte `protobuf:"bytes,2,opt,name=span_id,json=spanId,proto3" json:"span_id,omitempty"`
	// The trace_state associated with the link.
	TraceState string `protobuf:"bytes,3,opt,name=trace_state,json=traceState,proto3" json:"trace_state,omitempty"`
	// attributes is a collection of attribute key/value pairs on the link.
	Attributes []*v11.AttributeKeyValue `protobuf:"bytes,4,rep,name=attributes,proto3" json:"attributes,omitempty"`
	// dropped_attributes_count is the number of dropped attributes. If the value is 0,
	// then no attributes were dropped.
	DroppedAttributesCount uint32   `protobuf:"varint,5,opt,name=dropped_attributes_count,json=droppedAttributesCount,proto3" json:"dropped_attributes_count,omitempty"`
	XXX_NoUnkeyedLiteral   struct{} `json:"-"`
	XXX_unrecognized       []byte   `json:"-"`
	XXX_sizecache          int32    `json:"-"`
}

func (m *Span_Link) Reset()         { *m = Span_Link{} }
func (m *Span_Link) String() string { return proto.CompactTextString(m) }
func (*Span_Link) ProtoMessage()    {}
func (*Span_Link) Descriptor() ([]byte, []int) {
	return fileDescriptor_5c407ac9c675a601, []int{2, 1}
}

func (m *Span_Link) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Span_Link.Unmarshal(m, b)
}
func (m *Span_Link) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Span_Link.Marshal(b, m, deterministic)
}
func (m *Span_Link) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Span_Link.Merge(m, src)
}
func (m *Span_Link) XXX_Size() int {
	return xxx_messageInfo_Span_Link.Size(m)
}
func (m *Span_Link) XXX_DiscardUnknown() {
	xxx_messageInfo_Span_Link.DiscardUnknown(m)
}

var xxx_messageInfo_Span_Link proto.InternalMessageInfo

func (m *Span_Link) GetTraceId() []byte {
	if m != nil {
		return m.TraceId
	}
	return nil
}

func (m *Span_Link) GetSpanId() []byte {
	if m != nil {
		return m.SpanId
	}
	return nil
}

func (m *Span_Link) GetTraceState() string {
	if m != nil {
		return m.TraceState
	}
	return ""
}

func (m *Span_Link) GetAttributes() []*v11.AttributeKeyValue {
	if m != nil {
		return m.Attributes
	}
	return nil
}

func (m *Span_Link) GetDroppedAttributesCount() uint32 {
	if m != nil {
		return m.DroppedAttributesCount
	}
	return 0
}

// The Status type defines a logical error model that is suitable for different
// programming environments, including REST APIs and RPC APIs.
type Status struct {
	// The status code. This is optional field. It is safe to assume 0 (OK)
	// when not set.
	Code Status_StatusCode `protobuf:"varint,1,opt,name=code,proto3,enum=opentelemetry.proto.trace.v1.Status_StatusCode" json:"code,omitempty"`
	// A developer-facing human readable error message.
	Message              string   `protobuf:"bytes,2,opt,name=message,proto3" json:"message,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Status) Reset()         { *m = Status{} }
func (m *Status) String() string { return proto.CompactTextString(m) }
func (*Status) ProtoMessage()    {}
func (*Status) Descriptor() ([]byte, []int) {
	return fileDescriptor_5c407ac9c675a601, []int{3}
}

func (m *Status) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Status.Unmarshal(m, b)
}
func (m *Status) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Status.Marshal(b, m, deterministic)
}
func (m *Status) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Status.Merge(m, src)
}
func (m *Status) XXX_Size() int {
	return xxx_messageInfo_Status.Size(m)
}
func (m *Status) XXX_DiscardUnknown() {
	xxx_messageInfo_Status.DiscardUnknown(m)
}

var xxx_messageInfo_Status proto.InternalMessageInfo

func (m *Status) GetCode() Status_StatusCode {
	if m != nil {
		return m.Code
	}
	return Status_Ok
}

func (m *Status) GetMessage() string {
	if m != nil {
		return m.Message
	}
	return ""
}

func init() {
	proto.RegisterEnum("opentelemetry.proto.trace.v1.Span_SpanKind", Span_SpanKind_name, Span_SpanKind_value)
	proto.RegisterEnum("opentelemetry.proto.trace.v1.Status_StatusCode", Status_StatusCode_name, Status_StatusCode_value)
	proto.RegisterType((*ResourceSpans)(nil), "opentelemetry.proto.trace.v1.ResourceSpans")
	proto.RegisterType((*InstrumentationLibrarySpans)(nil), "opentelemetry.proto.trace.v1.InstrumentationLibrarySpans")
	proto.RegisterType((*Span)(nil), "opentelemetry.proto.trace.v1.Span")
	proto.RegisterType((*Span_Event)(nil), "opentelemetry.proto.trace.v1.Span.Event")
	proto.RegisterType((*Span_Link)(nil), "opentelemetry.proto.trace.v1.Span.Link")
	proto.RegisterType((*Status)(nil), "opentelemetry.proto.trace.v1.Status")
}

func init() {
	proto.RegisterFile("opentelemetry/proto/trace/v1/trace.proto", fileDescriptor_5c407ac9c675a601)
}

var fileDescriptor_5c407ac9c675a601 = []byte{
	// 1003 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xb4, 0x56, 0xcd, 0x6e, 0x1b, 0x37,
	0x10, 0xce, 0xea, 0xdf, 0xa3, 0x1f, 0xaf, 0x99, 0xbf, 0x8d, 0xd3, 0x22, 0x82, 0x1a, 0xa0, 0x6a,
	0x8a, 0x48, 0xb1, 0x8b, 0x02, 0x29, 0xd0, 0xa0, 0x55, 0xa4, 0x35, 0x20, 0xd8, 0x95, 0x05, 0xca,
	0xca, 0xa1, 0x17, 0x81, 0x12, 0x59, 0x99, 0xf0, 0x8a, 0x14, 0xb8, 0x5c, 0xd5, 0x3e, 0xf4, 0xd0,
	0xa7, 0xe9, 0x53, 0xf4, 0xdc, 0x4b, 0xaf, 0x7d, 0x86, 0xbe, 0x46, 0x41, 0xee, 0xae, 0x6d, 0x15,
	0xb6, 0xec, 0x8b, 0x2f, 0x36, 0x39, 0xf3, 0xfd, 0xcc, 0x70, 0xb8, 0xda, 0x85, 0xa6, 0x5c, 0x32,
	0xa1, 0x59, 0xc0, 0x16, 0x4c, 0xab, 0x8b, 0xf6, 0x52, 0x49, 0x2d, 0xdb, 0x5a, 0x91, 0x19, 0x6b,
	0xaf, 0xf6, 0xe2, 0x45, 0xcb, 0x06, 0xd1, 0x67, 0x6b, 0xc8, 0x38, 0xd8, 0x8a, 0x01, 0xab, 0xbd,
	0xdd, 0x37, 0x37, 0xe9, 0xcc, 0xe4, 0x62, 0x21, 0x85, 0x11, 0x8a, 0x57, 0x31, 0x69, 0xb7, 0x75,
	0x13, 0x56, 0xb1, 0x50, 0x46, 0x2a, 0xb6, 0x4d, 0xd7, 0x31, 0xbe, 0xf1, 0x8f, 0x03, 0x55, 0x9c,
	0x84, 0x46, 0x4b, 0x22, 0x42, 0xe4, 0x43, 0x29, 0xc5, 0x78, 0x4e, 0xdd, 0x69, 0x96, 0xf7, 0xbf,
	0x6a, 0xdd, 0x54, 0xde, 0xa5, 0xd0, 0x6a, 0xaf, 0x95, 0x2a, 0xe0, 0x4b, 0x2a, 0xfa, 0x0d, 0x3e,
	0xe7, 0x22, 0xd4, 0x2a, 0x5a, 0x30, 0xa1, 0x89, 0xe6, 0x52, 0x4c, 0x02, 0x3e, 0x55, 0x44, 0x5d,
	0x4c, 0x42, 0xe3, 0xe3, 0x65, 0xea, 0xd9, 0x66, 0x79, 0xff, 0xbb, 0xd6, 0xa6, 0xd6, 0x5b, 0xfd,
	0x75, 0x89, 0xa3, 0x58, 0xc1, 0x16, 0x8a, 0x5f, 0xf2, 0xdb, 0x93, 0x8d, 0xbf, 0x1c, 0x78, 0xb9,
	0x81, 0x8c, 0x04, 0x3c, 0xbf, 0xa5, 0xbc, 0xa4, 0xe9, 0x6f, 0x6f, 0x2c, 0x2c, 0x39, 0xeb, 0x5b,
	0x2b, 0xc3, 0xcf, 0x6e, 0x2e, 0x0a, 0xbd, 0x87, 0xfc, 0xf5, 0xb6, 0x1b, 0x9b, 0xdb, 0x36, 0x35,
	0xe2, 0x98, 0xd0, 0xf8, 0x1d, 0x20, 0x67, 0xf6, 0xe8, 0x05, 0x94, 0x2c, 0x60, 0xc2, 0xa9, 0xad,
	0xb1, 0x82, 0x8b, 0x76, 0xdf, 0xa7, 0xe8, 0x39, 0x14, 0x0d, 0xd8, 0x64, 0x32, 0x36, 0x53, 0x30,
	0xdb, 0x3e, 0x45, 0xaf, 0xa0, 0x1c, 0x73, 0x42, 0x4d, 0x34, 0xf3, 0xb2, 0x75, 0xa7, 0xb9, 0x85,
	0xc1, 0x86, 0x46, 0x26, 0x82, 0x5e, 0x43, 0x6d, 0x49, 0x14, 0x13, 0x7a, 0x92, 0x0a, 0xe4, 0xac,
	0x40, 0x25, 0x8e, 0x8e, 0x62, 0x19, 0x04, 0x39, 0x41, 0x16, 0xcc, 0xcb, 0x5b, 0xbe, 0x5d, 0xa3,
	0x1f, 0x20, 0x77, 0xc6, 0x05, 0xf5, 0x0a, 0x75, 0xa7, 0x59, 0xdb, 0xff, 0xfa, 0xee, 0x86, 0xec,
	0x9f, 0x43, 0x2e, 0x28, 0xb6, 0x44, 0xd4, 0x82, 0xc7, 0xa1, 0x26, 0x4a, 0x4f, 0x34, 0x5f, 0xb0,
	0x49, 0x24, 0xf8, 0xb9, 0x20, 0x42, 0x7a, 0xc5, 0xba, 0xd3, 0x2c, 0xe0, 0x1d, 0x9b, 0x3a, 0xe1,
	0x0b, 0x36, 0x4e, 0x12, 0xe8, 0x0d, 0xec, 0x30, 0x41, 0xff, 0x87, 0x2e, 0x59, 0xf4, 0x36, 0x13,
	0x74, 0x0d, 0x3b, 0x04, 0x20, 0x5a, 0x2b, 0x3e, 0x8d, 0x34, 0x0b, 0xbd, 0x2d, 0x7b, 0xe6, 0xef,
	0xee, 0x98, 0x68, 0x27, 0x25, 0x1c, 0xb2, 0x8b, 0x4f, 0x24, 0x88, 0x18, 0xbe, 0xa6, 0x81, 0xde,
	0x83, 0x47, 0x95, 0x5c, 0x2e, 0x19, 0x9d, 0x5c, 0x45, 0x27, 0x33, 0x19, 0x09, 0xed, 0x41, 0xdd,
	0x69, 0x56, 0xf1, 0xb3, 0x24, 0x7f, 0xa9, 0x13, 0x76, 0x4d, 0x16, 0xfd, 0x08, 0x05, 0xb6, 0x62,
	0x42, 0x87, 0x5e, 0xd9, 0xd6, 0xd1, 0xbc, 0xc7, 0x51, 0xf9, 0x86, 0x80, 0x13, 0x1e, 0x7a, 0x07,
	0x4f, 0x52, 0xef, 0x38, 0x92, 0xf8, 0x56, 0xac, 0x2f, 0x4a, 0x72, 0x96, 0x93, 0x78, 0x7e, 0x80,
	0x7c, 0xc0, 0xc5, 0x59, 0xe8, 0x55, 0xad, 0xe5, 0x97, 0xf7, 0xb0, 0x3c, 0xe2, 0xe2, 0x0c, 0xc7,
	0x2c, 0x33, 0x9a, 0xd4, 0xd0, 0x06, 0x12, 0xbf, 0x9a, 0xf5, 0xdb, 0x49, 0x52, 0x86, 0x90, 0xd8,
	0x7d, 0x0f, 0x05, 0x73, 0xc1, 0xa2, 0xd0, 0xdb, 0xb6, 0x0f, 0xcf, 0xeb, 0x3b, 0xfc, 0x2c, 0x16,
	0x27, 0x9c, 0xdd, 0xbf, 0x1d, 0xc8, 0xdb, 0xe2, 0xd1, 0x17, 0x50, 0x5d, 0x1f, 0xaf, 0x63, 0xc7,
	0x5b, 0xd1, 0xd7, 0x67, 0x9b, 0x5e, 0xc6, 0xcc, 0xb5, 0xcb, 0xb8, 0x3e, 0xef, 0xec, 0x03, 0xcf,
	0x3b, 0xb7, 0x69, 0xde, 0xbb, 0xff, 0x3a, 0x90, 0x33, 0x67, 0xf3, 0x30, 0x0f, 0xec, 0x7a, 0xa7,
	0xb9, 0x07, 0xee, 0x34, 0xbf, 0xa9, 0xd3, 0xc6, 0x1c, 0x4a, 0xe9, 0x33, 0x8d, 0x5e, 0xc0, 0xd3,
	0xd1, 0xb0, 0x33, 0x98, 0x1c, 0xf6, 0x07, 0xbd, 0xc9, 0x78, 0x30, 0x1a, 0xfa, 0xdd, 0xfe, 0x41,
	0xdf, 0xef, 0xb9, 0x8f, 0x50, 0x05, 0x4a, 0xfd, 0xc1, 0x89, 0x8f, 0x07, 0x9d, 0x23, 0xd7, 0x41,
	0x00, 0x85, 0x91, 0x8f, 0x3f, 0xf9, 0xd8, 0xcd, 0x98, 0x75, 0xf7, 0xa8, 0xef, 0x0f, 0x4e, 0xdc,
	0xac, 0x41, 0x0d, 0xf1, 0x71, 0x6f, 0xdc, 0xf5, 0xb1, 0x9b, 0x33, 0xbb, 0xee, 0xf1, 0x60, 0x34,
	0xfe, 0xc9, 0xc7, 0x6e, 0xbe, 0xf1, 0x47, 0x16, 0x0a, 0xf1, 0xa5, 0x41, 0x5d, 0xc8, 0xcd, 0x24,
	0x8d, 0x5f, 0x4d, 0xb5, 0xfd, 0xf6, 0x7d, 0x2e, 0x5a, 0xf2, 0xaf, 0x2b, 0x29, 0xc3, 0x96, 0x8c,
	0x3c, 0x28, 0x2e, 0x58, 0x18, 0x92, 0x79, 0x7a, 0x8b, 0xd2, 0x6d, 0xe3, 0xcf, 0x0c, 0xc0, 0x15,
	0x1c, 0x15, 0x20, 0x73, 0x7c, 0xe6, 0x3e, 0x42, 0x55, 0xd8, 0xea, 0x12, 0x31, 0x63, 0x41, 0xc0,
	0xa8, 0xeb, 0x20, 0x17, 0x2a, 0x63, 0x71, 0x26, 0xe4, 0xaf, 0xc2, 0x57, 0x4a, 0x2a, 0x37, 0x83,
	0x1e, 0xc3, 0x76, 0x5f, 0xac, 0x48, 0xc0, 0x69, 0x47, 0xcd, 0xed, 0xcf, 0xbf, 0x9b, 0x45, 0x4f,
	0xc0, 0xed, 0x31, 0x42, 0x03, 0x2e, 0x98, 0x7f, 0x3e, 0x63, 0x8c, 0x32, 0x1a, 0xb7, 0x36, 0x90,
	0xfa, 0x40, 0x46, 0x82, 0xba, 0x79, 0xb4, 0x03, 0xd5, 0x4e, 0xa0, 0x18, 0xa1, 0x17, 0xfe, 0x39,
	0x0f, 0x75, 0xe8, 0x16, 0x0c, 0x6d, 0xc8, 0xd4, 0x82, 0x87, 0x21, 0x97, 0xa2, 0xc7, 0x04, 0x67,
	0xd4, 0x2d, 0xa2, 0xa7, 0xb0, 0x93, 0xbe, 0x66, 0xfd, 0xf3, 0x53, 0x12, 0x85, 0x9a, 0x51, 0xb7,
	0x84, 0x9e, 0x01, 0x3a, 0x20, 0x3c, 0x60, 0x74, 0xa8, 0xd8, 0x4c, 0x0a, 0xca, 0xcd, 0x5b, 0xc7,
	0xdd, 0x42, 0x65, 0x28, 0x76, 0xa6, 0x52, 0x19, 0x10, 0xa0, 0x1a, 0xc0, 0x71, 0xa4, 0x8f, 0x7f,
	0xc1, 0x44, 0xcc, 0x99, 0x5b, 0x36, 0xa6, 0x63, 0xc1, 0x17, 0x4b, 0x73, 0x6c, 0xc2, 0x40, 0x2a,
	0x26, 0xd4, 0x17, 0x9a, 0x29, 0x41, 0x82, 0xb8, 0xa7, 0x2a, 0xda, 0x86, 0xf2, 0x58, 0x90, 0x15,
	0xe1, 0x01, 0x99, 0x06, 0xcc, 0xad, 0x99, 0xca, 0x7b, 0x44, 0x93, 0x23, 0x19, 0x86, 0xee, 0xb6,
	0x69, 0x79, 0x2c, 0x48, 0xa4, 0x4f, 0x99, 0xd0, 0x7c, 0x46, 0x8c, 0x8c, 0xfb, 0x51, 0xc0, 0x2b,
	0x2e, 0x37, 0x0e, 0xe5, 0x23, 0x9c, 0x98, 0xd5, 0xd0, 0x04, 0x87, 0xce, 0xcf, 0x1f, 0xe6, 0x5c,
	0x9f, 0x46, 0x53, 0x73, 0x5b, 0xdb, 0x86, 0xf6, 0xf6, 0xea, 0xe3, 0x65, 0x4d, 0xe5, 0x6d, 0xfc,
	0x29, 0x33, 0x67, 0xa2, 0x3d, 0xbf, 0xfa, 0x8a, 0x9a, 0x16, 0x6c, 0xf8, 0x9b, 0xff, 0x02, 0x00,
	0x00, 0xff, 0xff, 0x6e, 0xee, 0xdc, 0xdb, 0x6c, 0x09, 0x00, 0x00,
}
