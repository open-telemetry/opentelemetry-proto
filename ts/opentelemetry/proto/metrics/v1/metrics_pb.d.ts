// package: opentelemetry.proto.metrics.v1
// file: opentelemetry/proto/metrics/v1/metrics.proto

import * as jspb from "google-protobuf";
import * as opentelemetry_proto_common_v1_common_pb from "../../../../opentelemetry/proto/common/v1/common_pb";
import * as opentelemetry_proto_resource_v1_resource_pb from "../../../../opentelemetry/proto/resource/v1/resource_pb";

export class MetricsData extends jspb.Message {
  clearResourceMetricsList(): void;
  getResourceMetricsList(): Array<ResourceMetrics>;
  setResourceMetricsList(value: Array<ResourceMetrics>): void;
  addResourceMetrics(value?: ResourceMetrics, index?: number): ResourceMetrics;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MetricsData.AsObject;
  static toObject(includeInstance: boolean, msg: MetricsData): MetricsData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MetricsData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MetricsData;
  static deserializeBinaryFromReader(message: MetricsData, reader: jspb.BinaryReader): MetricsData;
}

export namespace MetricsData {
  export type AsObject = {
    resourceMetricsList: Array<ResourceMetrics.AsObject>,
  }
}

export class ResourceMetrics extends jspb.Message {
  hasResource(): boolean;
  clearResource(): void;
  getResource(): opentelemetry_proto_resource_v1_resource_pb.Resource | undefined;
  setResource(value?: opentelemetry_proto_resource_v1_resource_pb.Resource): void;

  clearInstrumentationLibraryMetricsList(): void;
  getInstrumentationLibraryMetricsList(): Array<InstrumentationLibraryMetrics>;
  setInstrumentationLibraryMetricsList(value: Array<InstrumentationLibraryMetrics>): void;
  addInstrumentationLibraryMetrics(value?: InstrumentationLibraryMetrics, index?: number): InstrumentationLibraryMetrics;

  getSchemaUrl(): string;
  setSchemaUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResourceMetrics.AsObject;
  static toObject(includeInstance: boolean, msg: ResourceMetrics): ResourceMetrics.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResourceMetrics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResourceMetrics;
  static deserializeBinaryFromReader(message: ResourceMetrics, reader: jspb.BinaryReader): ResourceMetrics;
}

export namespace ResourceMetrics {
  export type AsObject = {
    resource?: opentelemetry_proto_resource_v1_resource_pb.Resource.AsObject,
    instrumentationLibraryMetricsList: Array<InstrumentationLibraryMetrics.AsObject>,
    schemaUrl: string,
  }
}

export class InstrumentationLibraryMetrics extends jspb.Message {
  hasInstrumentationLibrary(): boolean;
  clearInstrumentationLibrary(): void;
  getInstrumentationLibrary(): opentelemetry_proto_common_v1_common_pb.InstrumentationLibrary | undefined;
  setInstrumentationLibrary(value?: opentelemetry_proto_common_v1_common_pb.InstrumentationLibrary): void;

  clearMetricsList(): void;
  getMetricsList(): Array<Metric>;
  setMetricsList(value: Array<Metric>): void;
  addMetrics(value?: Metric, index?: number): Metric;

  getSchemaUrl(): string;
  setSchemaUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): InstrumentationLibraryMetrics.AsObject;
  static toObject(includeInstance: boolean, msg: InstrumentationLibraryMetrics): InstrumentationLibraryMetrics.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: InstrumentationLibraryMetrics, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): InstrumentationLibraryMetrics;
  static deserializeBinaryFromReader(message: InstrumentationLibraryMetrics, reader: jspb.BinaryReader): InstrumentationLibraryMetrics;
}

export namespace InstrumentationLibraryMetrics {
  export type AsObject = {
    instrumentationLibrary?: opentelemetry_proto_common_v1_common_pb.InstrumentationLibrary.AsObject,
    metricsList: Array<Metric.AsObject>,
    schemaUrl: string,
  }
}

export class Metric extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getUnit(): string;
  setUnit(value: string): void;

  hasGauge(): boolean;
  clearGauge(): void;
  getGauge(): Gauge | undefined;
  setGauge(value?: Gauge): void;

  hasSum(): boolean;
  clearSum(): void;
  getSum(): Sum | undefined;
  setSum(value?: Sum): void;

  hasHistogram(): boolean;
  clearHistogram(): void;
  getHistogram(): Histogram | undefined;
  setHistogram(value?: Histogram): void;

  hasExponentialHistogram(): boolean;
  clearExponentialHistogram(): void;
  getExponentialHistogram(): ExponentialHistogram | undefined;
  setExponentialHistogram(value?: ExponentialHistogram): void;

  hasSummary(): boolean;
  clearSummary(): void;
  getSummary(): Summary | undefined;
  setSummary(value?: Summary): void;

  getDataCase(): Metric.DataCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Metric.AsObject;
  static toObject(includeInstance: boolean, msg: Metric): Metric.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Metric, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Metric;
  static deserializeBinaryFromReader(message: Metric, reader: jspb.BinaryReader): Metric;
}

export namespace Metric {
  export type AsObject = {
    name: string,
    description: string,
    unit: string,
    gauge?: Gauge.AsObject,
    sum?: Sum.AsObject,
    histogram?: Histogram.AsObject,
    exponentialHistogram?: ExponentialHistogram.AsObject,
    summary?: Summary.AsObject,
  }

  export enum DataCase {
    DATA_NOT_SET = 0,
    GAUGE = 5,
    SUM = 7,
    HISTOGRAM = 9,
    EXPONENTIAL_HISTOGRAM = 10,
    SUMMARY = 11,
  }
}

export class Gauge extends jspb.Message {
  clearDataPointsList(): void;
  getDataPointsList(): Array<NumberDataPoint>;
  setDataPointsList(value: Array<NumberDataPoint>): void;
  addDataPoints(value?: NumberDataPoint, index?: number): NumberDataPoint;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Gauge.AsObject;
  static toObject(includeInstance: boolean, msg: Gauge): Gauge.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Gauge, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Gauge;
  static deserializeBinaryFromReader(message: Gauge, reader: jspb.BinaryReader): Gauge;
}

export namespace Gauge {
  export type AsObject = {
    dataPointsList: Array<NumberDataPoint.AsObject>,
  }
}

export class Sum extends jspb.Message {
  clearDataPointsList(): void;
  getDataPointsList(): Array<NumberDataPoint>;
  setDataPointsList(value: Array<NumberDataPoint>): void;
  addDataPoints(value?: NumberDataPoint, index?: number): NumberDataPoint;

  getAggregationTemporality(): AggregationTemporalityMap[keyof AggregationTemporalityMap];
  setAggregationTemporality(value: AggregationTemporalityMap[keyof AggregationTemporalityMap]): void;

  getIsMonotonic(): boolean;
  setIsMonotonic(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Sum.AsObject;
  static toObject(includeInstance: boolean, msg: Sum): Sum.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Sum, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Sum;
  static deserializeBinaryFromReader(message: Sum, reader: jspb.BinaryReader): Sum;
}

export namespace Sum {
  export type AsObject = {
    dataPointsList: Array<NumberDataPoint.AsObject>,
    aggregationTemporality: AggregationTemporalityMap[keyof AggregationTemporalityMap],
    isMonotonic: boolean,
  }
}

export class Histogram extends jspb.Message {
  clearDataPointsList(): void;
  getDataPointsList(): Array<HistogramDataPoint>;
  setDataPointsList(value: Array<HistogramDataPoint>): void;
  addDataPoints(value?: HistogramDataPoint, index?: number): HistogramDataPoint;

  getAggregationTemporality(): AggregationTemporalityMap[keyof AggregationTemporalityMap];
  setAggregationTemporality(value: AggregationTemporalityMap[keyof AggregationTemporalityMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Histogram.AsObject;
  static toObject(includeInstance: boolean, msg: Histogram): Histogram.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Histogram, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Histogram;
  static deserializeBinaryFromReader(message: Histogram, reader: jspb.BinaryReader): Histogram;
}

export namespace Histogram {
  export type AsObject = {
    dataPointsList: Array<HistogramDataPoint.AsObject>,
    aggregationTemporality: AggregationTemporalityMap[keyof AggregationTemporalityMap],
  }
}

export class ExponentialHistogram extends jspb.Message {
  clearDataPointsList(): void;
  getDataPointsList(): Array<ExponentialHistogramDataPoint>;
  setDataPointsList(value: Array<ExponentialHistogramDataPoint>): void;
  addDataPoints(value?: ExponentialHistogramDataPoint, index?: number): ExponentialHistogramDataPoint;

  getAggregationTemporality(): AggregationTemporalityMap[keyof AggregationTemporalityMap];
  setAggregationTemporality(value: AggregationTemporalityMap[keyof AggregationTemporalityMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExponentialHistogram.AsObject;
  static toObject(includeInstance: boolean, msg: ExponentialHistogram): ExponentialHistogram.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExponentialHistogram, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExponentialHistogram;
  static deserializeBinaryFromReader(message: ExponentialHistogram, reader: jspb.BinaryReader): ExponentialHistogram;
}

export namespace ExponentialHistogram {
  export type AsObject = {
    dataPointsList: Array<ExponentialHistogramDataPoint.AsObject>,
    aggregationTemporality: AggregationTemporalityMap[keyof AggregationTemporalityMap],
  }
}

export class Summary extends jspb.Message {
  clearDataPointsList(): void;
  getDataPointsList(): Array<SummaryDataPoint>;
  setDataPointsList(value: Array<SummaryDataPoint>): void;
  addDataPoints(value?: SummaryDataPoint, index?: number): SummaryDataPoint;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Summary.AsObject;
  static toObject(includeInstance: boolean, msg: Summary): Summary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Summary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Summary;
  static deserializeBinaryFromReader(message: Summary, reader: jspb.BinaryReader): Summary;
}

export namespace Summary {
  export type AsObject = {
    dataPointsList: Array<SummaryDataPoint.AsObject>,
  }
}

export class NumberDataPoint extends jspb.Message {
  clearAttributesList(): void;
  getAttributesList(): Array<opentelemetry_proto_common_v1_common_pb.KeyValue>;
  setAttributesList(value: Array<opentelemetry_proto_common_v1_common_pb.KeyValue>): void;
  addAttributes(value?: opentelemetry_proto_common_v1_common_pb.KeyValue, index?: number): opentelemetry_proto_common_v1_common_pb.KeyValue;

  getStartTimeUnixNano(): number;
  setStartTimeUnixNano(value: number): void;

  getTimeUnixNano(): number;
  setTimeUnixNano(value: number): void;

  hasAsDouble(): boolean;
  clearAsDouble(): void;
  getAsDouble(): number;
  setAsDouble(value: number): void;

  hasAsInt(): boolean;
  clearAsInt(): void;
  getAsInt(): number;
  setAsInt(value: number): void;

  clearExemplarsList(): void;
  getExemplarsList(): Array<Exemplar>;
  setExemplarsList(value: Array<Exemplar>): void;
  addExemplars(value?: Exemplar, index?: number): Exemplar;

  getFlags(): number;
  setFlags(value: number): void;

  getValueCase(): NumberDataPoint.ValueCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NumberDataPoint.AsObject;
  static toObject(includeInstance: boolean, msg: NumberDataPoint): NumberDataPoint.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NumberDataPoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NumberDataPoint;
  static deserializeBinaryFromReader(message: NumberDataPoint, reader: jspb.BinaryReader): NumberDataPoint;
}

export namespace NumberDataPoint {
  export type AsObject = {
    attributesList: Array<opentelemetry_proto_common_v1_common_pb.KeyValue.AsObject>,
    startTimeUnixNano: number,
    timeUnixNano: number,
    asDouble: number,
    asInt: number,
    exemplarsList: Array<Exemplar.AsObject>,
    flags: number,
  }

  export enum ValueCase {
    VALUE_NOT_SET = 0,
    AS_DOUBLE = 4,
    AS_INT = 6,
  }
}

export class HistogramDataPoint extends jspb.Message {
  clearAttributesList(): void;
  getAttributesList(): Array<opentelemetry_proto_common_v1_common_pb.KeyValue>;
  setAttributesList(value: Array<opentelemetry_proto_common_v1_common_pb.KeyValue>): void;
  addAttributes(value?: opentelemetry_proto_common_v1_common_pb.KeyValue, index?: number): opentelemetry_proto_common_v1_common_pb.KeyValue;

  getStartTimeUnixNano(): number;
  setStartTimeUnixNano(value: number): void;

  getTimeUnixNano(): number;
  setTimeUnixNano(value: number): void;

  getCount(): number;
  setCount(value: number): void;

  getSum(): number;
  setSum(value: number): void;

  clearBucketCountsList(): void;
  getBucketCountsList(): Array<number>;
  setBucketCountsList(value: Array<number>): void;
  addBucketCounts(value: number, index?: number): number;

  clearExplicitBoundsList(): void;
  getExplicitBoundsList(): Array<number>;
  setExplicitBoundsList(value: Array<number>): void;
  addExplicitBounds(value: number, index?: number): number;

  clearExemplarsList(): void;
  getExemplarsList(): Array<Exemplar>;
  setExemplarsList(value: Array<Exemplar>): void;
  addExemplars(value?: Exemplar, index?: number): Exemplar;

  getFlags(): number;
  setFlags(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HistogramDataPoint.AsObject;
  static toObject(includeInstance: boolean, msg: HistogramDataPoint): HistogramDataPoint.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HistogramDataPoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HistogramDataPoint;
  static deserializeBinaryFromReader(message: HistogramDataPoint, reader: jspb.BinaryReader): HistogramDataPoint;
}

export namespace HistogramDataPoint {
  export type AsObject = {
    attributesList: Array<opentelemetry_proto_common_v1_common_pb.KeyValue.AsObject>,
    startTimeUnixNano: number,
    timeUnixNano: number,
    count: number,
    sum: number,
    bucketCountsList: Array<number>,
    explicitBoundsList: Array<number>,
    exemplarsList: Array<Exemplar.AsObject>,
    flags: number,
  }
}

export class ExponentialHistogramDataPoint extends jspb.Message {
  clearAttributesList(): void;
  getAttributesList(): Array<opentelemetry_proto_common_v1_common_pb.KeyValue>;
  setAttributesList(value: Array<opentelemetry_proto_common_v1_common_pb.KeyValue>): void;
  addAttributes(value?: opentelemetry_proto_common_v1_common_pb.KeyValue, index?: number): opentelemetry_proto_common_v1_common_pb.KeyValue;

  getStartTimeUnixNano(): number;
  setStartTimeUnixNano(value: number): void;

  getTimeUnixNano(): number;
  setTimeUnixNano(value: number): void;

  getCount(): number;
  setCount(value: number): void;

  getSum(): number;
  setSum(value: number): void;

  getScale(): number;
  setScale(value: number): void;

  getZeroCount(): number;
  setZeroCount(value: number): void;

  hasPositive(): boolean;
  clearPositive(): void;
  getPositive(): ExponentialHistogramDataPoint.Buckets | undefined;
  setPositive(value?: ExponentialHistogramDataPoint.Buckets): void;

  hasNegative(): boolean;
  clearNegative(): void;
  getNegative(): ExponentialHistogramDataPoint.Buckets | undefined;
  setNegative(value?: ExponentialHistogramDataPoint.Buckets): void;

  getFlags(): number;
  setFlags(value: number): void;

  clearExemplarsList(): void;
  getExemplarsList(): Array<Exemplar>;
  setExemplarsList(value: Array<Exemplar>): void;
  addExemplars(value?: Exemplar, index?: number): Exemplar;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExponentialHistogramDataPoint.AsObject;
  static toObject(includeInstance: boolean, msg: ExponentialHistogramDataPoint): ExponentialHistogramDataPoint.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExponentialHistogramDataPoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExponentialHistogramDataPoint;
  static deserializeBinaryFromReader(message: ExponentialHistogramDataPoint, reader: jspb.BinaryReader): ExponentialHistogramDataPoint;
}

export namespace ExponentialHistogramDataPoint {
  export type AsObject = {
    attributesList: Array<opentelemetry_proto_common_v1_common_pb.KeyValue.AsObject>,
    startTimeUnixNano: number,
    timeUnixNano: number,
    count: number,
    sum: number,
    scale: number,
    zeroCount: number,
    positive?: ExponentialHistogramDataPoint.Buckets.AsObject,
    negative?: ExponentialHistogramDataPoint.Buckets.AsObject,
    flags: number,
    exemplarsList: Array<Exemplar.AsObject>,
  }

  export class Buckets extends jspb.Message {
    getOffset(): number;
    setOffset(value: number): void;

    clearBucketCountsList(): void;
    getBucketCountsList(): Array<number>;
    setBucketCountsList(value: Array<number>): void;
    addBucketCounts(value: number, index?: number): number;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Buckets.AsObject;
    static toObject(includeInstance: boolean, msg: Buckets): Buckets.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Buckets, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Buckets;
    static deserializeBinaryFromReader(message: Buckets, reader: jspb.BinaryReader): Buckets;
  }

  export namespace Buckets {
    export type AsObject = {
      offset: number,
      bucketCountsList: Array<number>,
    }
  }
}

export class SummaryDataPoint extends jspb.Message {
  clearAttributesList(): void;
  getAttributesList(): Array<opentelemetry_proto_common_v1_common_pb.KeyValue>;
  setAttributesList(value: Array<opentelemetry_proto_common_v1_common_pb.KeyValue>): void;
  addAttributes(value?: opentelemetry_proto_common_v1_common_pb.KeyValue, index?: number): opentelemetry_proto_common_v1_common_pb.KeyValue;

  getStartTimeUnixNano(): number;
  setStartTimeUnixNano(value: number): void;

  getTimeUnixNano(): number;
  setTimeUnixNano(value: number): void;

  getCount(): number;
  setCount(value: number): void;

  getSum(): number;
  setSum(value: number): void;

  clearQuantileValuesList(): void;
  getQuantileValuesList(): Array<SummaryDataPoint.ValueAtQuantile>;
  setQuantileValuesList(value: Array<SummaryDataPoint.ValueAtQuantile>): void;
  addQuantileValues(value?: SummaryDataPoint.ValueAtQuantile, index?: number): SummaryDataPoint.ValueAtQuantile;

  getFlags(): number;
  setFlags(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SummaryDataPoint.AsObject;
  static toObject(includeInstance: boolean, msg: SummaryDataPoint): SummaryDataPoint.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SummaryDataPoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SummaryDataPoint;
  static deserializeBinaryFromReader(message: SummaryDataPoint, reader: jspb.BinaryReader): SummaryDataPoint;
}

export namespace SummaryDataPoint {
  export type AsObject = {
    attributesList: Array<opentelemetry_proto_common_v1_common_pb.KeyValue.AsObject>,
    startTimeUnixNano: number,
    timeUnixNano: number,
    count: number,
    sum: number,
    quantileValuesList: Array<SummaryDataPoint.ValueAtQuantile.AsObject>,
    flags: number,
  }

  export class ValueAtQuantile extends jspb.Message {
    getQuantile(): number;
    setQuantile(value: number): void;

    getValue(): number;
    setValue(value: number): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ValueAtQuantile.AsObject;
    static toObject(includeInstance: boolean, msg: ValueAtQuantile): ValueAtQuantile.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: ValueAtQuantile, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ValueAtQuantile;
    static deserializeBinaryFromReader(message: ValueAtQuantile, reader: jspb.BinaryReader): ValueAtQuantile;
  }

  export namespace ValueAtQuantile {
    export type AsObject = {
      quantile: number,
      value: number,
    }
  }
}

export class Exemplar extends jspb.Message {
  clearFilteredAttributesList(): void;
  getFilteredAttributesList(): Array<opentelemetry_proto_common_v1_common_pb.KeyValue>;
  setFilteredAttributesList(value: Array<opentelemetry_proto_common_v1_common_pb.KeyValue>): void;
  addFilteredAttributes(value?: opentelemetry_proto_common_v1_common_pb.KeyValue, index?: number): opentelemetry_proto_common_v1_common_pb.KeyValue;

  getTimeUnixNano(): number;
  setTimeUnixNano(value: number): void;

  hasAsDouble(): boolean;
  clearAsDouble(): void;
  getAsDouble(): number;
  setAsDouble(value: number): void;

  hasAsInt(): boolean;
  clearAsInt(): void;
  getAsInt(): number;
  setAsInt(value: number): void;

  getSpanId(): Uint8Array | string;
  getSpanId_asU8(): Uint8Array;
  getSpanId_asB64(): string;
  setSpanId(value: Uint8Array | string): void;

  getTraceId(): Uint8Array | string;
  getTraceId_asU8(): Uint8Array;
  getTraceId_asB64(): string;
  setTraceId(value: Uint8Array | string): void;

  getValueCase(): Exemplar.ValueCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Exemplar.AsObject;
  static toObject(includeInstance: boolean, msg: Exemplar): Exemplar.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Exemplar, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Exemplar;
  static deserializeBinaryFromReader(message: Exemplar, reader: jspb.BinaryReader): Exemplar;
}

export namespace Exemplar {
  export type AsObject = {
    filteredAttributesList: Array<opentelemetry_proto_common_v1_common_pb.KeyValue.AsObject>,
    timeUnixNano: number,
    asDouble: number,
    asInt: number,
    spanId: Uint8Array | string,
    traceId: Uint8Array | string,
  }

  export enum ValueCase {
    VALUE_NOT_SET = 0,
    AS_DOUBLE = 3,
    AS_INT = 6,
  }
}

export interface AggregationTemporalityMap {
  AGGREGATION_TEMPORALITY_UNSPECIFIED: 0;
  AGGREGATION_TEMPORALITY_DELTA: 1;
  AGGREGATION_TEMPORALITY_CUMULATIVE: 2;
}

export const AggregationTemporality: AggregationTemporalityMap;

export interface DataPointFlagsMap {
  FLAG_NONE: 0;
  FLAG_NO_RECORDED_VALUE: 1;
}

export const DataPointFlags: DataPointFlagsMap;

