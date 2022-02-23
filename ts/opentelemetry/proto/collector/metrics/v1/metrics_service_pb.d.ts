// package: opentelemetry.proto.collector.metrics.v1
// file: opentelemetry/proto/collector/metrics/v1/metrics_service.proto

import * as jspb from "google-protobuf";
import * as opentelemetry_proto_metrics_v1_metrics_pb from "../../../../../opentelemetry/proto/metrics/v1/metrics_pb";

export class ExportMetricsServiceRequest extends jspb.Message {
  clearResourceMetricsList(): void;
  getResourceMetricsList(): Array<opentelemetry_proto_metrics_v1_metrics_pb.ResourceMetrics>;
  setResourceMetricsList(value: Array<opentelemetry_proto_metrics_v1_metrics_pb.ResourceMetrics>): void;
  addResourceMetrics(value?: opentelemetry_proto_metrics_v1_metrics_pb.ResourceMetrics, index?: number): opentelemetry_proto_metrics_v1_metrics_pb.ResourceMetrics;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExportMetricsServiceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExportMetricsServiceRequest): ExportMetricsServiceRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExportMetricsServiceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExportMetricsServiceRequest;
  static deserializeBinaryFromReader(message: ExportMetricsServiceRequest, reader: jspb.BinaryReader): ExportMetricsServiceRequest;
}

export namespace ExportMetricsServiceRequest {
  export type AsObject = {
    resourceMetricsList: Array<opentelemetry_proto_metrics_v1_metrics_pb.ResourceMetrics.AsObject>,
  }
}

export class ExportMetricsServiceResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExportMetricsServiceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ExportMetricsServiceResponse): ExportMetricsServiceResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExportMetricsServiceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExportMetricsServiceResponse;
  static deserializeBinaryFromReader(message: ExportMetricsServiceResponse, reader: jspb.BinaryReader): ExportMetricsServiceResponse;
}

export namespace ExportMetricsServiceResponse {
  export type AsObject = {
  }
}

