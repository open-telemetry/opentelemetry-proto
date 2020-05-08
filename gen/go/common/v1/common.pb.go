// Code generated by protoc-gen-go. DO NOT EDIT.
// source: opentelemetry/proto/common/v1/common.proto

package v1

import (
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
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

// AnyValue is used to represent any type of attribute value. AnyValue may contain a
// primitive value such as a string or integer or it may contain an arbitrary nested
// object containing arrays, key-value lists and primitives.
type AnyValue struct {
	// The value is one of the listed fields. It is valid for all values to be unspecified
	// in which case this AnyValue is considered to be "null".
	//
	// Types that are valid to be assigned to Value:
	//	*AnyValue_StringValue
	//	*AnyValue_BoolValue
	//	*AnyValue_IntValue
	//	*AnyValue_DoubleValue
	//	*AnyValue_ArrayValue
	//	*AnyValue_KvlistValue
	Value                isAnyValue_Value `protobuf_oneof:"value"`
	XXX_NoUnkeyedLiteral struct{}         `json:"-"`
	XXX_unrecognized     []byte           `json:"-"`
	XXX_sizecache        int32            `json:"-"`
}

func (m *AnyValue) Reset()         { *m = AnyValue{} }
func (m *AnyValue) String() string { return proto.CompactTextString(m) }
func (*AnyValue) ProtoMessage()    {}
func (*AnyValue) Descriptor() ([]byte, []int) {
	return fileDescriptor_62ba46dcb97aa817, []int{0}
}

func (m *AnyValue) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_AnyValue.Unmarshal(m, b)
}
func (m *AnyValue) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_AnyValue.Marshal(b, m, deterministic)
}
func (m *AnyValue) XXX_Merge(src proto.Message) {
	xxx_messageInfo_AnyValue.Merge(m, src)
}
func (m *AnyValue) XXX_Size() int {
	return xxx_messageInfo_AnyValue.Size(m)
}
func (m *AnyValue) XXX_DiscardUnknown() {
	xxx_messageInfo_AnyValue.DiscardUnknown(m)
}

var xxx_messageInfo_AnyValue proto.InternalMessageInfo

type isAnyValue_Value interface {
	isAnyValue_Value()
}

type AnyValue_StringValue struct {
	StringValue string `protobuf:"bytes,1,opt,name=string_value,json=stringValue,proto3,oneof"`
}

type AnyValue_BoolValue struct {
	BoolValue bool `protobuf:"varint,2,opt,name=bool_value,json=boolValue,proto3,oneof"`
}

type AnyValue_IntValue struct {
	IntValue int64 `protobuf:"varint,3,opt,name=int_value,json=intValue,proto3,oneof"`
}

type AnyValue_DoubleValue struct {
	DoubleValue float64 `protobuf:"fixed64,4,opt,name=double_value,json=doubleValue,proto3,oneof"`
}

type AnyValue_ArrayValue struct {
	ArrayValue *ArrayValue `protobuf:"bytes,5,opt,name=array_value,json=arrayValue,proto3,oneof"`
}

type AnyValue_KvlistValue struct {
	KvlistValue *KeyValueList `protobuf:"bytes,6,opt,name=kvlist_value,json=kvlistValue,proto3,oneof"`
}

func (*AnyValue_StringValue) isAnyValue_Value() {}

func (*AnyValue_BoolValue) isAnyValue_Value() {}

func (*AnyValue_IntValue) isAnyValue_Value() {}

func (*AnyValue_DoubleValue) isAnyValue_Value() {}

func (*AnyValue_ArrayValue) isAnyValue_Value() {}

func (*AnyValue_KvlistValue) isAnyValue_Value() {}

func (m *AnyValue) GetValue() isAnyValue_Value {
	if m != nil {
		return m.Value
	}
	return nil
}

func (m *AnyValue) GetStringValue() string {
	if x, ok := m.GetValue().(*AnyValue_StringValue); ok {
		return x.StringValue
	}
	return ""
}

func (m *AnyValue) GetBoolValue() bool {
	if x, ok := m.GetValue().(*AnyValue_BoolValue); ok {
		return x.BoolValue
	}
	return false
}

func (m *AnyValue) GetIntValue() int64 {
	if x, ok := m.GetValue().(*AnyValue_IntValue); ok {
		return x.IntValue
	}
	return 0
}

func (m *AnyValue) GetDoubleValue() float64 {
	if x, ok := m.GetValue().(*AnyValue_DoubleValue); ok {
		return x.DoubleValue
	}
	return 0
}

func (m *AnyValue) GetArrayValue() *ArrayValue {
	if x, ok := m.GetValue().(*AnyValue_ArrayValue); ok {
		return x.ArrayValue
	}
	return nil
}

func (m *AnyValue) GetKvlistValue() *KeyValueList {
	if x, ok := m.GetValue().(*AnyValue_KvlistValue); ok {
		return x.KvlistValue
	}
	return nil
}

// XXX_OneofWrappers is for the internal use of the proto package.
func (*AnyValue) XXX_OneofWrappers() []interface{} {
	return []interface{}{
		(*AnyValue_StringValue)(nil),
		(*AnyValue_BoolValue)(nil),
		(*AnyValue_IntValue)(nil),
		(*AnyValue_DoubleValue)(nil),
		(*AnyValue_ArrayValue)(nil),
		(*AnyValue_KvlistValue)(nil),
	}
}

// ArrayValue is a list of AnyValue messages. We need ArrayValue as a message
// since oneof in AnyValue does not allow repeated fields.
type ArrayValue struct {
	// Array of values. The array may be empty (contain 0 elements).
	Values               []*AnyValue `protobuf:"bytes,1,rep,name=values,proto3" json:"values,omitempty"`
	XXX_NoUnkeyedLiteral struct{}    `json:"-"`
	XXX_unrecognized     []byte      `json:"-"`
	XXX_sizecache        int32       `json:"-"`
}

func (m *ArrayValue) Reset()         { *m = ArrayValue{} }
func (m *ArrayValue) String() string { return proto.CompactTextString(m) }
func (*ArrayValue) ProtoMessage()    {}
func (*ArrayValue) Descriptor() ([]byte, []int) {
	return fileDescriptor_62ba46dcb97aa817, []int{1}
}

func (m *ArrayValue) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_ArrayValue.Unmarshal(m, b)
}
func (m *ArrayValue) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_ArrayValue.Marshal(b, m, deterministic)
}
func (m *ArrayValue) XXX_Merge(src proto.Message) {
	xxx_messageInfo_ArrayValue.Merge(m, src)
}
func (m *ArrayValue) XXX_Size() int {
	return xxx_messageInfo_ArrayValue.Size(m)
}
func (m *ArrayValue) XXX_DiscardUnknown() {
	xxx_messageInfo_ArrayValue.DiscardUnknown(m)
}

var xxx_messageInfo_ArrayValue proto.InternalMessageInfo

func (m *ArrayValue) GetValues() []*AnyValue {
	if m != nil {
		return m.Values
	}
	return nil
}

// KeyValueList is a list of KeyValue messages. We need KeyValueList as a message
// since `oneof` in AnyValue does not allow repeated fields. Everywhere else where we need
// a list of KeyValue messages (e.g. in Span) we use `repeated KeyValue` directly to
// avoid unnecessary extra wrapping (which slows down the protocol). The 2 approaches
// are semantically equivalent.
type KeyValueList struct {
	// A collection of key/value pairs of key-value pairs. The list may be empty (may
	// contain 0 elements).
	Values               []*KeyValue `protobuf:"bytes,1,rep,name=values,proto3" json:"values,omitempty"`
	XXX_NoUnkeyedLiteral struct{}    `json:"-"`
	XXX_unrecognized     []byte      `json:"-"`
	XXX_sizecache        int32       `json:"-"`
}

func (m *KeyValueList) Reset()         { *m = KeyValueList{} }
func (m *KeyValueList) String() string { return proto.CompactTextString(m) }
func (*KeyValueList) ProtoMessage()    {}
func (*KeyValueList) Descriptor() ([]byte, []int) {
	return fileDescriptor_62ba46dcb97aa817, []int{2}
}

func (m *KeyValueList) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_KeyValueList.Unmarshal(m, b)
}
func (m *KeyValueList) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_KeyValueList.Marshal(b, m, deterministic)
}
func (m *KeyValueList) XXX_Merge(src proto.Message) {
	xxx_messageInfo_KeyValueList.Merge(m, src)
}
func (m *KeyValueList) XXX_Size() int {
	return xxx_messageInfo_KeyValueList.Size(m)
}
func (m *KeyValueList) XXX_DiscardUnknown() {
	xxx_messageInfo_KeyValueList.DiscardUnknown(m)
}

var xxx_messageInfo_KeyValueList proto.InternalMessageInfo

func (m *KeyValueList) GetValues() []*KeyValue {
	if m != nil {
		return m.Values
	}
	return nil
}

// KeyValue is a key-value pair that is used to store Span attributes, Link
// attributes, etc.
type KeyValue struct {
	Key                  string    `protobuf:"bytes,1,opt,name=key,proto3" json:"key,omitempty"`
	Value                *AnyValue `protobuf:"bytes,2,opt,name=value,proto3" json:"value,omitempty"`
	XXX_NoUnkeyedLiteral struct{}  `json:"-"`
	XXX_unrecognized     []byte    `json:"-"`
	XXX_sizecache        int32     `json:"-"`
}

func (m *KeyValue) Reset()         { *m = KeyValue{} }
func (m *KeyValue) String() string { return proto.CompactTextString(m) }
func (*KeyValue) ProtoMessage()    {}
func (*KeyValue) Descriptor() ([]byte, []int) {
	return fileDescriptor_62ba46dcb97aa817, []int{3}
}

func (m *KeyValue) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_KeyValue.Unmarshal(m, b)
}
func (m *KeyValue) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_KeyValue.Marshal(b, m, deterministic)
}
func (m *KeyValue) XXX_Merge(src proto.Message) {
	xxx_messageInfo_KeyValue.Merge(m, src)
}
func (m *KeyValue) XXX_Size() int {
	return xxx_messageInfo_KeyValue.Size(m)
}
func (m *KeyValue) XXX_DiscardUnknown() {
	xxx_messageInfo_KeyValue.DiscardUnknown(m)
}

var xxx_messageInfo_KeyValue proto.InternalMessageInfo

func (m *KeyValue) GetKey() string {
	if m != nil {
		return m.Key
	}
	return ""
}

func (m *KeyValue) GetValue() *AnyValue {
	if m != nil {
		return m.Value
	}
	return nil
}

// StringKeyValue is a pair of key/value strings. This is the simpler (and faster) version
// of KeyValue that only supports string values.
type StringKeyValue struct {
	Key                  string   `protobuf:"bytes,1,opt,name=key,proto3" json:"key,omitempty"`
	Value                string   `protobuf:"bytes,2,opt,name=value,proto3" json:"value,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *StringKeyValue) Reset()         { *m = StringKeyValue{} }
func (m *StringKeyValue) String() string { return proto.CompactTextString(m) }
func (*StringKeyValue) ProtoMessage()    {}
func (*StringKeyValue) Descriptor() ([]byte, []int) {
	return fileDescriptor_62ba46dcb97aa817, []int{4}
}

func (m *StringKeyValue) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_StringKeyValue.Unmarshal(m, b)
}
func (m *StringKeyValue) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_StringKeyValue.Marshal(b, m, deterministic)
}
func (m *StringKeyValue) XXX_Merge(src proto.Message) {
	xxx_messageInfo_StringKeyValue.Merge(m, src)
}
func (m *StringKeyValue) XXX_Size() int {
	return xxx_messageInfo_StringKeyValue.Size(m)
}
func (m *StringKeyValue) XXX_DiscardUnknown() {
	xxx_messageInfo_StringKeyValue.DiscardUnknown(m)
}

var xxx_messageInfo_StringKeyValue proto.InternalMessageInfo

func (m *StringKeyValue) GetKey() string {
	if m != nil {
		return m.Key
	}
	return ""
}

func (m *StringKeyValue) GetValue() string {
	if m != nil {
		return m.Value
	}
	return ""
}

func init() {
	proto.RegisterType((*AnyValue)(nil), "opentelemetry.proto.common.v1.AnyValue")
	proto.RegisterType((*ArrayValue)(nil), "opentelemetry.proto.common.v1.ArrayValue")
	proto.RegisterType((*KeyValueList)(nil), "opentelemetry.proto.common.v1.KeyValueList")
	proto.RegisterType((*KeyValue)(nil), "opentelemetry.proto.common.v1.KeyValue")
	proto.RegisterType((*StringKeyValue)(nil), "opentelemetry.proto.common.v1.StringKeyValue")
}

func init() {
	proto.RegisterFile("opentelemetry/proto/common/v1/common.proto", fileDescriptor_62ba46dcb97aa817)
}

var fileDescriptor_62ba46dcb97aa817 = []byte{
	// 370 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x94, 0x53, 0x4b, 0x4f, 0xea, 0x40,
	0x14, 0xee, 0xd0, 0x0b, 0xb7, 0x3d, 0x25, 0x37, 0x37, 0xcd, 0x5d, 0xb0, 0x21, 0xb7, 0xc1, 0x85,
	0x55, 0x43, 0x1b, 0x70, 0xe3, 0x46, 0x0d, 0xb8, 0x69, 0x22, 0x46, 0x52, 0x13, 0x17, 0xba, 0x30,
	0xad, 0x4e, 0xea, 0x84, 0x32, 0x83, 0xed, 0xd0, 0xa4, 0x3f, 0xce, 0xff, 0x66, 0xe6, 0xc1, 0x6b,
	0x03, 0x61, 0x77, 0xe6, 0xeb, 0xf7, 0x38, 0xa7, 0x33, 0x07, 0xce, 0xd9, 0x02, 0x53, 0x8e, 0x73,
	0x3c, 0xc7, 0xbc, 0xa8, 0xc3, 0x45, 0xc1, 0x38, 0x0b, 0xdf, 0xd9, 0x7c, 0xce, 0x68, 0x58, 0x0d,
	0x74, 0x15, 0x48, 0xd8, 0xed, 0xee, 0x70, 0x15, 0x18, 0x68, 0x46, 0x35, 0xe8, 0x7d, 0x37, 0xc0,
	0x1a, 0xd1, 0xfa, 0x39, 0xc9, 0x97, 0xd8, 0x3d, 0x81, 0x76, 0xc9, 0x0b, 0x42, 0xb3, 0xb7, 0x4a,
	0x9c, 0x3b, 0xc8, 0x43, 0xbe, 0x1d, 0x19, 0xb1, 0xa3, 0x50, 0x45, 0xfa, 0x0f, 0x90, 0x32, 0x96,
	0x6b, 0x4a, 0xc3, 0x43, 0xbe, 0x15, 0x19, 0xb1, 0x2d, 0x30, 0x45, 0xe8, 0x82, 0x4d, 0x28, 0xd7,
	0xdf, 0x4d, 0x0f, 0xf9, 0x66, 0x64, 0xc4, 0x16, 0xa1, 0x7c, 0x1d, 0xf2, 0xc1, 0x96, 0x69, 0x8e,
	0x35, 0xe3, 0x97, 0x87, 0x7c, 0x24, 0x42, 0x14, 0xaa, 0x48, 0x13, 0x70, 0x92, 0xa2, 0x48, 0x6a,
	0xcd, 0x69, 0x7a, 0xc8, 0x77, 0x86, 0x67, 0xc1, 0xde, 0x59, 0x82, 0x91, 0x50, 0x48, 0x7d, 0x64,
	0xc4, 0x90, 0xac, 0x4f, 0xee, 0x14, 0xda, 0xb3, 0x2a, 0x27, 0xe5, 0xaa, 0xa9, 0x96, 0xb4, 0xbb,
	0x38, 0x60, 0x77, 0x8f, 0x95, 0x7c, 0x42, 0x4a, 0x2e, 0xfa, 0x53, 0x16, 0x12, 0x1a, 0xff, 0x86,
	0xa6, 0xb4, 0xea, 0x3d, 0x00, 0x6c, 0x62, 0xdd, 0x5b, 0x68, 0x49, 0xb8, 0xec, 0x20, 0xcf, 0xf4,
	0x9d, 0xe1, 0xe9, 0xa1, 0x8e, 0xf5, 0x9f, 0x8f, 0xb5, 0xac, 0xf7, 0x08, 0xed, 0xed, 0xd8, 0xa3,
	0x0d, 0x57, 0xe2, 0xb5, 0xe1, 0x2b, 0x58, 0x2b, 0xcc, 0xfd, 0x0b, 0xe6, 0x0c, 0xd7, 0xea, 0x56,
	0x63, 0x51, 0xba, 0xd7, 0x7a, 0x0c, 0x79, 0x8d, 0x47, 0xb4, 0xab, 0x87, 0xbf, 0x82, 0x3f, 0x4f,
	0xf2, 0x65, 0xec, 0x89, 0xf8, 0xb7, 0x1d, 0x61, 0x6b, 0xe5, 0xf8, 0x0b, 0x3c, 0xc2, 0xf6, 0xa7,
	0x8d, 0x9d, 0x3b, 0x59, 0x4e, 0x05, 0x3c, 0x45, 0x2f, 0x37, 0x19, 0xe1, 0x9f, 0xcb, 0x54, 0x10,
	0x42, 0x21, 0xec, 0x6f, 0x16, 0x60, 0xc7, 0xa7, 0xaf, 0xd6, 0x21, 0xc3, 0x34, 0xcc, 0xb6, 0xb6,
	0x22, 0x6d, 0x49, 0xfc, 0xf2, 0x27, 0x00, 0x00, 0xff, 0xff, 0x32, 0x48, 0x57, 0xfe, 0x3d, 0x03,
	0x00, 0x00,
}
