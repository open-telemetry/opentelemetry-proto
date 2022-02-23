// package: opentelemetry.proto.collector.trace.v1
// file: opentelemetry/proto/collector/trace/v1/trace_service.proto

import * as jspb from "google-protobuf";
import * as opentelemetry_proto_trace_v1_trace_pb from "../../../../../opentelemetry/proto/trace/v1/trace_pb";

export class ExportTraceServiceRequest extends jspb.Message {
  clearResourceSpansList(): void;
  getResourceSpansList(): Array<opentelemetry_proto_trace_v1_trace_pb.ResourceSpans>;
  setResourceSpansList(value: Array<opentelemetry_proto_trace_v1_trace_pb.ResourceSpans>): void;
  addResourceSpans(value?: opentelemetry_proto_trace_v1_trace_pb.ResourceSpans, index?: number): opentelemetry_proto_trace_v1_trace_pb.ResourceSpans;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExportTraceServiceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExportTraceServiceRequest): ExportTraceServiceRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExportTraceServiceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExportTraceServiceRequest;
  static deserializeBinaryFromReader(message: ExportTraceServiceRequest, reader: jspb.BinaryReader): ExportTraceServiceRequest;
}

export namespace ExportTraceServiceRequest {
  export type AsObject = {
    resourceSpansList: Array<opentelemetry_proto_trace_v1_trace_pb.ResourceSpans.AsObject>,
  }
}

export class ExportTraceServiceResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExportTraceServiceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ExportTraceServiceResponse): ExportTraceServiceResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExportTraceServiceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExportTraceServiceResponse;
  static deserializeBinaryFromReader(message: ExportTraceServiceResponse, reader: jspb.BinaryReader): ExportTraceServiceResponse;
}

export namespace ExportTraceServiceResponse {
  export type AsObject = {
  }
}

