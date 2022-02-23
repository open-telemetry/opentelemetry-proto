// package: opentelemetry.proto.collector.metrics.v1
// file: opentelemetry/proto/collector/metrics/v1/metrics_service.proto

import * as opentelemetry_proto_collector_metrics_v1_metrics_service_pb from "../../../../../opentelemetry/proto/collector/metrics/v1/metrics_service_pb";
import {grpc} from "@improbable-eng/grpc-web";

type MetricsServiceExport = {
  readonly methodName: string;
  readonly service: typeof MetricsService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof opentelemetry_proto_collector_metrics_v1_metrics_service_pb.ExportMetricsServiceRequest;
  readonly responseType: typeof opentelemetry_proto_collector_metrics_v1_metrics_service_pb.ExportMetricsServiceResponse;
};

export class MetricsService {
  static readonly serviceName: string;
  static readonly Export: MetricsServiceExport;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class MetricsServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  export(
    requestMessage: opentelemetry_proto_collector_metrics_v1_metrics_service_pb.ExportMetricsServiceRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: opentelemetry_proto_collector_metrics_v1_metrics_service_pb.ExportMetricsServiceResponse|null) => void
  ): UnaryResponse;
  export(
    requestMessage: opentelemetry_proto_collector_metrics_v1_metrics_service_pb.ExportMetricsServiceRequest,
    callback: (error: ServiceError|null, responseMessage: opentelemetry_proto_collector_metrics_v1_metrics_service_pb.ExportMetricsServiceResponse|null) => void
  ): UnaryResponse;
}

