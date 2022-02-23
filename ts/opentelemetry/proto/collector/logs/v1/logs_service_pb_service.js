// package: opentelemetry.proto.collector.logs.v1
// file: opentelemetry/proto/collector/logs/v1/logs_service.proto

var opentelemetry_proto_collector_logs_v1_logs_service_pb = require("../../../../../opentelemetry/proto/collector/logs/v1/logs_service_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var LogsService = (function () {
  function LogsService() {}
  LogsService.serviceName = "opentelemetry.proto.collector.logs.v1.LogsService";
  return LogsService;
}());

LogsService.Export = {
  methodName: "Export",
  service: LogsService,
  requestStream: false,
  responseStream: false,
  requestType: opentelemetry_proto_collector_logs_v1_logs_service_pb.ExportLogsServiceRequest,
  responseType: opentelemetry_proto_collector_logs_v1_logs_service_pb.ExportLogsServiceResponse
};

exports.LogsService = LogsService;

function LogsServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

LogsServiceClient.prototype.export = function pb_export(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(LogsService.Export, {
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

exports.LogsServiceClient = LogsServiceClient;

