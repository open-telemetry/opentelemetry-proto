// package: opentelemetry.proto.trace.v1
// file: opentelemetry/proto/trace/v1/trace.proto

import * as jspb from "google-protobuf";
import * as opentelemetry_proto_common_v1_common_pb from "../../../../opentelemetry/proto/common/v1/common_pb";
import * as opentelemetry_proto_resource_v1_resource_pb from "../../../../opentelemetry/proto/resource/v1/resource_pb";

export class TracesData extends jspb.Message {
  clearResourceSpansList(): void;
  getResourceSpansList(): Array<ResourceSpans>;
  setResourceSpansList(value: Array<ResourceSpans>): void;
  addResourceSpans(value?: ResourceSpans, index?: number): ResourceSpans;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TracesData.AsObject;
  static toObject(includeInstance: boolean, msg: TracesData): TracesData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TracesData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TracesData;
  static deserializeBinaryFromReader(message: TracesData, reader: jspb.BinaryReader): TracesData;
}

export namespace TracesData {
  export type AsObject = {
    resourceSpansList: Array<ResourceSpans.AsObject>,
  }
}

export class ResourceSpans extends jspb.Message {
  hasResource(): boolean;
  clearResource(): void;
  getResource(): opentelemetry_proto_resource_v1_resource_pb.Resource | undefined;
  setResource(value?: opentelemetry_proto_resource_v1_resource_pb.Resource): void;

  clearInstrumentationLibrarySpansList(): void;
  getInstrumentationLibrarySpansList(): Array<InstrumentationLibrarySpans>;
  setInstrumentationLibrarySpansList(value: Array<InstrumentationLibrarySpans>): void;
  addInstrumentationLibrarySpans(value?: InstrumentationLibrarySpans, index?: number): InstrumentationLibrarySpans;

  getSchemaUrl(): string;
  setSchemaUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResourceSpans.AsObject;
  static toObject(includeInstance: boolean, msg: ResourceSpans): ResourceSpans.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResourceSpans, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResourceSpans;
  static deserializeBinaryFromReader(message: ResourceSpans, reader: jspb.BinaryReader): ResourceSpans;
}

export namespace ResourceSpans {
  export type AsObject = {
    resource?: opentelemetry_proto_resource_v1_resource_pb.Resource.AsObject,
    instrumentationLibrarySpansList: Array<InstrumentationLibrarySpans.AsObject>,
    schemaUrl: string,
  }
}

export class InstrumentationLibrarySpans extends jspb.Message {
  hasInstrumentationLibrary(): boolean;
  clearInstrumentationLibrary(): void;
  getInstrumentationLibrary(): opentelemetry_proto_common_v1_common_pb.InstrumentationLibrary | undefined;
  setInstrumentationLibrary(value?: opentelemetry_proto_common_v1_common_pb.InstrumentationLibrary): void;

  clearSpansList(): void;
  getSpansList(): Array<Span>;
  setSpansList(value: Array<Span>): void;
  addSpans(value?: Span, index?: number): Span;

  getSchemaUrl(): string;
  setSchemaUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InstrumentationLibrarySpans.AsObject;
  static toObject(includeInstance: boolean, msg: InstrumentationLibrarySpans): InstrumentationLibrarySpans.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InstrumentationLibrarySpans, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InstrumentationLibrarySpans;
  static deserializeBinaryFromReader(message: InstrumentationLibrarySpans, reader: jspb.BinaryReader): InstrumentationLibrarySpans;
}

export namespace InstrumentationLibrarySpans {
  export type AsObject = {
    instrumentationLibrary?: opentelemetry_proto_common_v1_common_pb.InstrumentationLibrary.AsObject,
    spansList: Array<Span.AsObject>,
    schemaUrl: string,
  }
}

export class Span extends jspb.Message {
  getTraceId(): Uint8Array | string;
  getTraceId_asU8(): Uint8Array;
  getTraceId_asB64(): string;
  setTraceId(value: Uint8Array | string): void;

  getSpanId(): Uint8Array | string;
  getSpanId_asU8(): Uint8Array;
  getSpanId_asB64(): string;
  setSpanId(value: Uint8Array | string): void;

  getTraceState(): string;
  setTraceState(value: string): void;

  getParentSpanId(): Uint8Array | string;
  getParentSpanId_asU8(): Uint8Array;
  getParentSpanId_asB64(): string;
  setParentSpanId(value: Uint8Array | string): void;

  getName(): string;
  setName(value: string): void;

  getKind(): Span.SpanKindMap[keyof Span.SpanKindMap];
  setKind(value: Span.SpanKindMap[keyof Span.SpanKindMap]): void;

  getStartTimeUnixNano(): number;
  setStartTimeUnixNano(value: number): void;

  getEndTimeUnixNano(): number;
  setEndTimeUnixNano(value: number): void;

  clearAttributesList(): void;
  getAttributesList(): Array<opentelemetry_proto_common_v1_common_pb.KeyValue>;
  setAttributesList(value: Array<opentelemetry_proto_common_v1_common_pb.KeyValue>): void;
  addAttributes(value?: opentelemetry_proto_common_v1_common_pb.KeyValue, index?: number): opentelemetry_proto_common_v1_common_pb.KeyValue;

  getDroppedAttributesCount(): number;
  setDroppedAttributesCount(value: number): void;

  clearEventsList(): void;
  getEventsList(): Array<Span.Event>;
  setEventsList(value: Array<Span.Event>): void;
  addEvents(value?: Span.Event, index?: number): Span.Event;

  getDroppedEventsCount(): number;
  setDroppedEventsCount(value: number): void;

  clearLinksList(): void;
  getLinksList(): Array<Span.Link>;
  setLinksList(value: Array<Span.Link>): void;
  addLinks(value?: Span.Link, index?: number): Span.Link;

  getDroppedLinksCount(): number;
  setDroppedLinksCount(value: number): void;

  hasStatus(): boolean;
  clearStatus(): void;
  getStatus(): Status | undefined;
  setStatus(value?: Status): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Span.AsObject;
  static toObject(includeInstance: boolean, msg: Span): Span.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Span, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Span;
  static deserializeBinaryFromReader(message: Span, reader: jspb.BinaryReader): Span;
}

export namespace Span {
  export type AsObject = {
    traceId: Uint8Array | string,
    spanId: Uint8Array | string,
    traceState: string,
    parentSpanId: Uint8Array | string,
    name: string,
    kind: Span.SpanKindMap[keyof Span.SpanKindMap],
    startTimeUnixNano: number,
    endTimeUnixNano: number,
    attributesList: Array<opentelemetry_proto_common_v1_common_pb.KeyValue.AsObject>,
    droppedAttributesCount: number,
    eventsList: Array<Span.Event.AsObject>,
    droppedEventsCount: number,
    linksList: Array<Span.Link.AsObject>,
    droppedLinksCount: number,
    status?: Status.AsObject,
  }

  export class Event extends jspb.Message {
    getTimeUnixNano(): number;
    setTimeUnixNano(value: number): void;

    getName(): string;
    setName(value: string): void;

    clearAttributesList(): void;
    getAttributesList(): Array<opentelemetry_proto_common_v1_common_pb.KeyValue>;
    setAttributesList(value: Array<opentelemetry_proto_common_v1_common_pb.KeyValue>): void;
    addAttributes(value?: opentelemetry_proto_common_v1_common_pb.KeyValue, index?: number): opentelemetry_proto_common_v1_common_pb.KeyValue;

    getDroppedAttributesCount(): number;
    setDroppedAttributesCount(value: number): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Event.AsObject;
    static toObject(includeInstance: boolean, msg: Event): Event.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Event, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Event;
    static deserializeBinaryFromReader(message: Event, reader: jspb.BinaryReader): Event;
  }

  export namespace Event {
    export type AsObject = {
      timeUnixNano: number,
      name: string,
      attributesList: Array<opentelemetry_proto_common_v1_common_pb.KeyValue.AsObject>,
      droppedAttributesCount: number,
    }
  }

  export class Link extends jspb.Message {
    getTraceId(): Uint8Array | string;
    getTraceId_asU8(): Uint8Array;
    getTraceId_asB64(): string;
    setTraceId(value: Uint8Array | string): void;

    getSpanId(): Uint8Array | string;
    getSpanId_asU8(): Uint8Array;
    getSpanId_asB64(): string;
    setSpanId(value: Uint8Array | string): void;

    getTraceState(): string;
    setTraceState(value: string): void;

    clearAttributesList(): void;
    getAttributesList(): Array<opentelemetry_proto_common_v1_common_pb.KeyValue>;
    setAttributesList(value: Array<opentelemetry_proto_common_v1_common_pb.KeyValue>): void;
    addAttributes(value?: opentelemetry_proto_common_v1_common_pb.KeyValue, index?: number): opentelemetry_proto_common_v1_common_pb.KeyValue;

    getDroppedAttributesCount(): number;
    setDroppedAttributesCount(value: number): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Link.AsObject;
    static toObject(includeInstance: boolean, msg: Link): Link.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Link, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Link;
    static deserializeBinaryFromReader(message: Link, reader: jspb.BinaryReader): Link;
  }

  export namespace Link {
    export type AsObject = {
      traceId: Uint8Array | string,
      spanId: Uint8Array | string,
      traceState: string,
      attributesList: Array<opentelemetry_proto_common_v1_common_pb.KeyValue.AsObject>,
      droppedAttributesCount: number,
    }
  }

  export interface SpanKindMap {
    SPAN_KIND_UNSPECIFIED: 0;
    SPAN_KIND_INTERNAL: 1;
    SPAN_KIND_SERVER: 2;
    SPAN_KIND_CLIENT: 3;
    SPAN_KIND_PRODUCER: 4;
    SPAN_KIND_CONSUMER: 5;
  }

  export const SpanKind: SpanKindMap;
}

export class Status extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  getCode(): Status.StatusCodeMap[keyof Status.StatusCodeMap];
  setCode(value: Status.StatusCodeMap[keyof Status.StatusCodeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Status.AsObject;
  static toObject(includeInstance: boolean, msg: Status): Status.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Status, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Status;
  static deserializeBinaryFromReader(message: Status, reader: jspb.BinaryReader): Status;
}

export namespace Status {
  export type AsObject = {
    message: string,
    code: Status.StatusCodeMap[keyof Status.StatusCodeMap],
  }

  export interface StatusCodeMap {
    STATUS_CODE_UNSET: 0;
    STATUS_CODE_OK: 1;
    STATUS_CODE_ERROR: 2;
  }

  export const StatusCode: StatusCodeMap;
}

