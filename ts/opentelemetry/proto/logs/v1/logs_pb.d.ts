// package: opentelemetry.proto.logs.v1
// file: opentelemetry/proto/logs/v1/logs.proto

import * as jspb from "google-protobuf";
import * as opentelemetry_proto_common_v1_common_pb from "../../../../opentelemetry/proto/common/v1/common_pb";
import * as opentelemetry_proto_resource_v1_resource_pb from "../../../../opentelemetry/proto/resource/v1/resource_pb";

export class LogsData extends jspb.Message {
  clearResourceLogsList(): void;
  getResourceLogsList(): Array<ResourceLogs>;
  setResourceLogsList(value: Array<ResourceLogs>): void;
  addResourceLogs(value?: ResourceLogs, index?: number): ResourceLogs;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LogsData.AsObject;
  static toObject(includeInstance: boolean, msg: LogsData): LogsData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LogsData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LogsData;
  static deserializeBinaryFromReader(message: LogsData, reader: jspb.BinaryReader): LogsData;
}

export namespace LogsData {
  export type AsObject = {
    resourceLogsList: Array<ResourceLogs.AsObject>,
  }
}

export class ResourceLogs extends jspb.Message {
  hasResource(): boolean;
  clearResource(): void;
  getResource(): opentelemetry_proto_resource_v1_resource_pb.Resource | undefined;
  setResource(value?: opentelemetry_proto_resource_v1_resource_pb.Resource): void;

  clearInstrumentationLibraryLogsList(): void;
  getInstrumentationLibraryLogsList(): Array<InstrumentationLibraryLogs>;
  setInstrumentationLibraryLogsList(value: Array<InstrumentationLibraryLogs>): void;
  addInstrumentationLibraryLogs(value?: InstrumentationLibraryLogs, index?: number): InstrumentationLibraryLogs;

  getSchemaUrl(): string;
  setSchemaUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResourceLogs.AsObject;
  static toObject(includeInstance: boolean, msg: ResourceLogs): ResourceLogs.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResourceLogs, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResourceLogs;
  static deserializeBinaryFromReader(message: ResourceLogs, reader: jspb.BinaryReader): ResourceLogs;
}

export namespace ResourceLogs {
  export type AsObject = {
    resource?: opentelemetry_proto_resource_v1_resource_pb.Resource.AsObject,
    instrumentationLibraryLogsList: Array<InstrumentationLibraryLogs.AsObject>,
    schemaUrl: string,
  }
}

export class InstrumentationLibraryLogs extends jspb.Message {
  hasInstrumentationLibrary(): boolean;
  clearInstrumentationLibrary(): void;
  getInstrumentationLibrary(): opentelemetry_proto_common_v1_common_pb.InstrumentationLibrary | undefined;
  setInstrumentationLibrary(value?: opentelemetry_proto_common_v1_common_pb.InstrumentationLibrary): void;

  clearLogRecordsList(): void;
  getLogRecordsList(): Array<LogRecord>;
  setLogRecordsList(value: Array<LogRecord>): void;
  addLogRecords(value?: LogRecord, index?: number): LogRecord;

  getSchemaUrl(): string;
  setSchemaUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InstrumentationLibraryLogs.AsObject;
  static toObject(includeInstance: boolean, msg: InstrumentationLibraryLogs): InstrumentationLibraryLogs.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InstrumentationLibraryLogs, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InstrumentationLibraryLogs;
  static deserializeBinaryFromReader(message: InstrumentationLibraryLogs, reader: jspb.BinaryReader): InstrumentationLibraryLogs;
}

export namespace InstrumentationLibraryLogs {
  export type AsObject = {
    instrumentationLibrary?: opentelemetry_proto_common_v1_common_pb.InstrumentationLibrary.AsObject,
    logRecordsList: Array<LogRecord.AsObject>,
    schemaUrl: string,
  }
}

export class LogRecord extends jspb.Message {
  getTimeUnixNano(): number;
  setTimeUnixNano(value: number): void;

  getObservedTimeUnixNano(): number;
  setObservedTimeUnixNano(value: number): void;

  getSeverityNumber(): SeverityNumberMap[keyof SeverityNumberMap];
  setSeverityNumber(value: SeverityNumberMap[keyof SeverityNumberMap]): void;

  getSeverityText(): string;
  setSeverityText(value: string): void;

  getName(): string;
  setName(value: string): void;

  hasBody(): boolean;
  clearBody(): void;
  getBody(): opentelemetry_proto_common_v1_common_pb.AnyValue | undefined;
  setBody(value?: opentelemetry_proto_common_v1_common_pb.AnyValue): void;

  clearAttributesList(): void;
  getAttributesList(): Array<opentelemetry_proto_common_v1_common_pb.KeyValue>;
  setAttributesList(value: Array<opentelemetry_proto_common_v1_common_pb.KeyValue>): void;
  addAttributes(value?: opentelemetry_proto_common_v1_common_pb.KeyValue, index?: number): opentelemetry_proto_common_v1_common_pb.KeyValue;

  getDroppedAttributesCount(): number;
  setDroppedAttributesCount(value: number): void;

  getFlags(): number;
  setFlags(value: number): void;

  getTraceId(): Uint8Array | string;
  getTraceId_asU8(): Uint8Array;
  getTraceId_asB64(): string;
  setTraceId(value: Uint8Array | string): void;

  getSpanId(): Uint8Array | string;
  getSpanId_asU8(): Uint8Array;
  getSpanId_asB64(): string;
  setSpanId(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LogRecord.AsObject;
  static toObject(includeInstance: boolean, msg: LogRecord): LogRecord.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: LogRecord, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LogRecord;
  static deserializeBinaryFromReader(message: LogRecord, reader: jspb.BinaryReader): LogRecord;
}

export namespace LogRecord {
  export type AsObject = {
    timeUnixNano: number,
    observedTimeUnixNano: number,
    severityNumber: SeverityNumberMap[keyof SeverityNumberMap],
    severityText: string,
    name: string,
    body?: opentelemetry_proto_common_v1_common_pb.AnyValue.AsObject,
    attributesList: Array<opentelemetry_proto_common_v1_common_pb.KeyValue.AsObject>,
    droppedAttributesCount: number,
    flags: number,
    traceId: Uint8Array | string,
    spanId: Uint8Array | string,
  }
}

export interface SeverityNumberMap {
  SEVERITY_NUMBER_UNSPECIFIED: 0;
  SEVERITY_NUMBER_TRACE: 1;
  SEVERITY_NUMBER_TRACE2: 2;
  SEVERITY_NUMBER_TRACE3: 3;
  SEVERITY_NUMBER_TRACE4: 4;
  SEVERITY_NUMBER_DEBUG: 5;
  SEVERITY_NUMBER_DEBUG2: 6;
  SEVERITY_NUMBER_DEBUG3: 7;
  SEVERITY_NUMBER_DEBUG4: 8;
  SEVERITY_NUMBER_INFO: 9;
  SEVERITY_NUMBER_INFO2: 10;
  SEVERITY_NUMBER_INFO3: 11;
  SEVERITY_NUMBER_INFO4: 12;
  SEVERITY_NUMBER_WARN: 13;
  SEVERITY_NUMBER_WARN2: 14;
  SEVERITY_NUMBER_WARN3: 15;
  SEVERITY_NUMBER_WARN4: 16;
  SEVERITY_NUMBER_ERROR: 17;
  SEVERITY_NUMBER_ERROR2: 18;
  SEVERITY_NUMBER_ERROR3: 19;
  SEVERITY_NUMBER_ERROR4: 20;
  SEVERITY_NUMBER_FATAL: 21;
  SEVERITY_NUMBER_FATAL2: 22;
  SEVERITY_NUMBER_FATAL3: 23;
  SEVERITY_NUMBER_FATAL4: 24;
}

export const SeverityNumber: SeverityNumberMap;

export interface LogRecordFlagsMap {
  LOG_RECORD_FLAG_UNSPECIFIED: 0;
  LOG_RECORD_FLAG_TRACE_FLAGS_MASK: 255;
}

export const LogRecordFlags: LogRecordFlagsMap;

