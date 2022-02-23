// package: opentelemetry.proto.trace.v1
// file: opentelemetry/proto/trace/v1/trace_config.proto

import * as jspb from "google-protobuf";

export class TraceConfig extends jspb.Message {
  hasConstantSampler(): boolean;
  clearConstantSampler(): void;
  getConstantSampler(): ConstantSampler | undefined;
  setConstantSampler(value?: ConstantSampler): void;

  hasTraceIdRatioBased(): boolean;
  clearTraceIdRatioBased(): void;
  getTraceIdRatioBased(): TraceIdRatioBased | undefined;
  setTraceIdRatioBased(value?: TraceIdRatioBased): void;

  hasRateLimitingSampler(): boolean;
  clearRateLimitingSampler(): void;
  getRateLimitingSampler(): RateLimitingSampler | undefined;
  setRateLimitingSampler(value?: RateLimitingSampler): void;

  getMaxNumberOfAttributes(): number;
  setMaxNumberOfAttributes(value: number): void;

  getMaxNumberOfTimedEvents(): number;
  setMaxNumberOfTimedEvents(value: number): void;

  getMaxNumberOfAttributesPerTimedEvent(): number;
  setMaxNumberOfAttributesPerTimedEvent(value: number): void;

  getMaxNumberOfLinks(): number;
  setMaxNumberOfLinks(value: number): void;

  getMaxNumberOfAttributesPerLink(): number;
  setMaxNumberOfAttributesPerLink(value: number): void;

  getSamplerCase(): TraceConfig.SamplerCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TraceConfig.AsObject;
  static toObject(includeInstance: boolean, msg: TraceConfig): TraceConfig.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TraceConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TraceConfig;
  static deserializeBinaryFromReader(message: TraceConfig, reader: jspb.BinaryReader): TraceConfig;
}

export namespace TraceConfig {
  export type AsObject = {
    constantSampler?: ConstantSampler.AsObject,
    traceIdRatioBased?: TraceIdRatioBased.AsObject,
    rateLimitingSampler?: RateLimitingSampler.AsObject,
    maxNumberOfAttributes: number,
    maxNumberOfTimedEvents: number,
    maxNumberOfAttributesPerTimedEvent: number,
    maxNumberOfLinks: number,
    maxNumberOfAttributesPerLink: number,
  }

  export enum SamplerCase {
    SAMPLER_NOT_SET = 0,
    CONSTANT_SAMPLER = 1,
    TRACE_ID_RATIO_BASED = 2,
    RATE_LIMITING_SAMPLER = 3,
  }
}

export class ConstantSampler extends jspb.Message {
  getDecision(): ConstantSampler.ConstantDecisionMap[keyof ConstantSampler.ConstantDecisionMap];
  setDecision(value: ConstantSampler.ConstantDecisionMap[keyof ConstantSampler.ConstantDecisionMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConstantSampler.AsObject;
  static toObject(includeInstance: boolean, msg: ConstantSampler): ConstantSampler.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConstantSampler, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConstantSampler;
  static deserializeBinaryFromReader(message: ConstantSampler, reader: jspb.BinaryReader): ConstantSampler;
}

export namespace ConstantSampler {
  export type AsObject = {
    decision: ConstantSampler.ConstantDecisionMap[keyof ConstantSampler.ConstantDecisionMap],
  }

  export interface ConstantDecisionMap {
    ALWAYS_OFF: 0;
    ALWAYS_ON: 1;
    ALWAYS_PARENT: 2;
  }

  export const ConstantDecision: ConstantDecisionMap;
}

export class TraceIdRatioBased extends jspb.Message {
  getSamplingratio(): number;
  setSamplingratio(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TraceIdRatioBased.AsObject;
  static toObject(includeInstance: boolean, msg: TraceIdRatioBased): TraceIdRatioBased.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TraceIdRatioBased, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TraceIdRatioBased;
  static deserializeBinaryFromReader(message: TraceIdRatioBased, reader: jspb.BinaryReader): TraceIdRatioBased;
}

export namespace TraceIdRatioBased {
  export type AsObject = {
    samplingratio: number,
  }
}

export class RateLimitingSampler extends jspb.Message {
  getQps(): number;
  setQps(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RateLimitingSampler.AsObject;
  static toObject(includeInstance: boolean, msg: RateLimitingSampler): RateLimitingSampler.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RateLimitingSampler, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RateLimitingSampler;
  static deserializeBinaryFromReader(message: RateLimitingSampler, reader: jspb.BinaryReader): RateLimitingSampler;
}

export namespace RateLimitingSampler {
  export type AsObject = {
    qps: number,
  }
}

