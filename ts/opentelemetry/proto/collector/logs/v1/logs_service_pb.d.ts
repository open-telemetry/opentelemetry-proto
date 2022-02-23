// package: opentelemetry.proto.collector.logs.v1
// file: opentelemetry/proto/collector/logs/v1/logs_service.proto

import * as jspb from "google-protobuf";
import * as opentelemetry_proto_logs_v1_logs_pb from "../../../../../opentelemetry/proto/logs/v1/logs_pb";

export class ExportLogsServiceRequest extends jspb.Message {
  clearResourceLogsList(): void;
  getResourceLogsList(): Array<opentelemetry_proto_logs_v1_logs_pb.ResourceLogs>;
  setResourceLogsList(value: Array<opentelemetry_proto_logs_v1_logs_pb.ResourceLogs>): void;
  addResourceLogs(value?: opentelemetry_proto_logs_v1_logs_pb.ResourceLogs, index?: number): opentelemetry_proto_logs_v1_logs_pb.ResourceLogs;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExportLogsServiceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExportLogsServiceRequest): ExportLogsServiceRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExportLogsServiceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExportLogsServiceRequest;
  static deserializeBinaryFromReader(message: ExportLogsServiceRequest, reader: jspb.BinaryReader): ExportLogsServiceRequest;
}

export namespace ExportLogsServiceRequest {
  export type AsObject = {
    resourceLogsList: Array<opentelemetry_proto_logs_v1_logs_pb.ResourceLogs.AsObject>,
  }
}

export class ExportLogsServiceResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExportLogsServiceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ExportLogsServiceResponse): ExportLogsServiceResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExportLogsServiceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExportLogsServiceResponse;
  static deserializeBinaryFromReader(message: ExportLogsServiceResponse, reader: jspb.BinaryReader): ExportLogsServiceResponse;
}

export namespace ExportLogsServiceResponse {
  export type AsObject = {
  }
}

