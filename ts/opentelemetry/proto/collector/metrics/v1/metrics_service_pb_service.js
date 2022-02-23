// package: opentelemetry.proto.collector.metrics.v1
// file: opentelemetry/proto/collector/metrics/v1/metrics_service.proto

var opentelemetry_proto_collector_metrics_v1_metrics_service_pb = require("../../../../../opentelemetry/proto/collector/metrics/v1/metrics_service_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var MetricsService = (function () {
  function MetricsService() {}
  MetricsService.serviceName = "opentelemetry.proto.collector.metrics.v1.MetricsService";
  return MetricsService;
}());

MetricsService.Export = {
  methodName: "Export",
  service: MetricsService,
  requestStream: false,
  responseStream: false,
  requestType: opentelemetry_proto_collector_metrics_v1_metrics_service_pb.ExportMetricsServiceRequest,
  responseType: opentelemetry_proto_collector_metrics_v1_metrics_service_pb.ExportMetricsServiceResponse
};

exports.MetricsService = MetricsService;

function MetricsServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

MetricsServiceClient.prototype.export = function pb_export(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(MetricsService.Export, {
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

exports.MetricsServiceClient = MetricsServiceClient;

