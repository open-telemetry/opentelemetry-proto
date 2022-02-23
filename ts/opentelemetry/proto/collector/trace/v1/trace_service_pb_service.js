// package: opentelemetry.proto.collector.trace.v1
// file: opentelemetry/proto/collector/trace/v1/trace_service.proto

var opentelemetry_proto_collector_trace_v1_trace_service_pb = require("../../../../../opentelemetry/proto/collector/trace/v1/trace_service_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var TraceService = (function () {
  function TraceService() {}
  TraceService.serviceName = "opentelemetry.proto.collector.trace.v1.TraceService";
  return TraceService;
}());

TraceService.Export = {
  methodName: "Export",
  service: TraceService,
  requestStream: false,
  responseStream: false,
  requestType: opentelemetry_proto_collector_trace_v1_trace_service_pb.ExportTraceServiceRequest,
  responseType: opentelemetry_proto_collector_trace_v1_trace_service_pb.ExportTraceServiceResponse
};

exports.TraceService = TraceService;

function TraceServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

TraceServiceClient.prototype.export = function pb_export(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(TraceService.Export, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.TraceServiceClient = TraceServiceClient;

