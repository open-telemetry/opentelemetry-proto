// package: opentelemetry.proto.collector.logs.v1
// file: opentelemetry/proto/collector/logs/v1/logs_service.proto

import * as opentelemetry_proto_collector_logs_v1_logs_service_pb from "../../../../../opentelemetry/proto/collector/logs/v1/logs_service_pb";
import {grpc} from "@improbable-eng/grpc-web";

type LogsServiceExport = {
  readonly methodName: string;
  readonly service: typeof LogsService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof opentelemetry_proto_collector_logs_v1_logs_service_pb.ExportLogsServiceRequest;
  readonly responseType: typeof opentelemetry_proto_collector_logs_v1_logs_service_pb.ExportLogsServiceResponse;
};

export class LogsService {
  static readonly serviceName: string;
  static readonly Export: LogsServiceExport;
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

export class LogsServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  export(
    requestMessage: opentelemetry_proto_collector_logs_v1_logs_service_pb.ExportLogsServiceRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: opentelemetry_proto_collector_logs_v1_logs_service_pb.ExportLogsServiceResponse|null) => void
  ): UnaryResponse;
  export(
    requestMessage: opentelemetry_proto_collector_logs_v1_logs_service_pb.ExportLogsServiceRequest,
    callback: (error: ServiceError|null, responseMessage: opentelemetry_proto_collector_logs_v1_logs_service_pb.ExportLogsServiceResponse|null) => void
  ): UnaryResponse;
}

