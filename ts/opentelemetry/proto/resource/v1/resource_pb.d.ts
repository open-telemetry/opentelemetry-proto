// package: opentelemetry.proto.resource.v1
// file: opentelemetry/proto/resource/v1/resource.proto

import * as jspb from "google-protobuf";
import * as opentelemetry_proto_common_v1_common_pb from "../../../../opentelemetry/proto/common/v1/common_pb";

export class Resource extends jspb.Message {
  clearAttributesList(): void;
  getAttributesList(): Array<opentelemetry_proto_common_v1_common_pb.KeyValue>;
  setAttributesList(value: Array<opentelemetry_proto_common_v1_common_pb.KeyValue>): void;
  addAttributes(value?: opentelemetry_proto_common_v1_common_pb.KeyValue, index?: number): opentelemetry_proto_common_v1_common_pb.KeyValue;

  getDroppedAttributesCount(): number;
  setDroppedAttributesCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Resource.AsObject;
  static toObject(includeInstance: boolean, msg: Resource): Resource.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Resource, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Resource;
  static deserializeBinaryFromReader(message: Resource, reader: jspb.BinaryReader): Resource;
}

export namespace Resource {
  export type AsObject = {
    attributesList: Array<opentelemetry_proto_common_v1_common_pb.KeyValue.AsObject>,
    droppedAttributesCount: number,
  }
}

