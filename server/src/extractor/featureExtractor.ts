import { Request } from 'src/repository/request.model';
export interface Sequence {
  documentId?: number;
  documentLifecycle?: number;
  frameId?: number;
  frameType?: number;
  initiator?: number;
  method?: number;
  parentFrameId?: number;
  requestId?: number;
  tabId?: number;
  timeStamp?: number;
  type?: number;
  url?: number;
  requestHeaders?: number;
  response?: number;
  success?: number;
  label?: number;
}

export class FeatureExtractor {
  static FeatureExtractorBuilder = class {
    expectedLength: number;
    sequence: Sequence = {};
    sequenceCount = 0;
    documentId?: (documentId: string) => number[];
    documentLifecycle?: (documentLifecycle: string) => number[];
    frameId?: (frameId: number) => number[];
    frameType?: (frameType: string) => number[];
    initiator?: (initiator: string) => number[];
    method?: (method: string) => number[];
    parentFrameId?: (parentFrameId: number) => number[];
    requestId?: (requestId: string) => number[];
    tabId?: (tabId: number) => number[];
    timeStamp?: (timeStamp: string) => number[];
    type?: (type: string) => number[];
    url?: (url: string) => number[];
    requestHeaders?: (
      headers: { name: string; value: string }[],
    ) => number[];
    response?: (response: {
      documentId: string;
      documentLifecycle: string;
      frameId: string;
      frameType: string;
      fromCache: boolean;
      initiator: string;
      ip: string;
      method: string;
      parentFrameId: number;
      requestId: string;
      responseHeaders: { name: string; value: string }[];
    }) => number[];
    success?: (success: boolean) => number[];
    label?: (label: boolean) => number[];

    constructor(expectedLength: number) {
      this.expectedLength = expectedLength;
    }


    withDocumentIdExtractor(
      documentIdExtractor: (documentId: string) => number[],
    ): this {
      this.documentId = documentIdExtractor;
      this.sequence['documentId'] = this.sequenceCount++;
      return this;
    }

    withDocumentLifecycleExtractor(
      documentLifecycleExtractor: (documentLifecycle: string) => number[],
    ): this {
      this.documentLifecycle = documentLifecycleExtractor;
      this.sequence['documentLifecycle'] = this.sequenceCount++;
      return this;
    }

    withFrameIdExtractor(
      frameIdExtractor: (documentLifecycle: number) => number[],
    ): this {
      this.frameId = frameIdExtractor;
      this.sequence['frameId'] = this.sequenceCount++;
      return this;
    }

    withFrameTypeExtractor(
      frameTypeExtractor: (frameType: string) => number[],
    ): this {
      this.frameType = frameTypeExtractor;
      this.sequence['frameType'] = this.sequenceCount++;
      return this;
    }

    withInitiatorExtractor(
      initiatorExtractor: (initiator: string) => number[],
    ): this {
      this.initiator = initiatorExtractor;
      this.sequence['initiator'] = this.sequenceCount++;
      return this;
    }

    withMethodExtractor(
      methodExtractor: (method: string) => number[],
    ): this {
      this.method = methodExtractor;
      this.sequence['method'] = this.sequenceCount++;
      return this;
    }

    withParentFrameIdExtractor(
      parentFrameIdExtractor: (parentFrameId: number) => number[],
    ): this {
      this.parentFrameId = parentFrameIdExtractor;
      this.sequence['parentFrameId'] = this.sequenceCount++;
      return this;
    }

    withRequestIdExtractor(
      requestIdExtractor: (requestId: string) => number[],
    ): this {
      this.requestId = requestIdExtractor;
      this.sequence['requestId'] = this.sequenceCount++;
      return this;
    }

    withTabIdExtractor(
      tabIdExtractor: (tabId: number) => number[],
    ): this {
      this.tabId = tabIdExtractor;
      this.sequence['tabId'] = this.sequenceCount++;
      return this;
    }

    withTimeStampExtractor(
      timeStampExtractor: (timeStamp: string) => number[],
    ): this {
      this.timeStamp = timeStampExtractor;
      this.sequence['timeStamp'] = this.sequenceCount++;
      return this;
    }

    withTypeExtractor(
      typeExtractor: (type: string) => number[],
    ): this {
      this.type = typeExtractor;
      this.sequence['type'] = this.sequenceCount++;
      return this;
    }

    withUrlExtractor(urlExtractor: (url: string) => number[]): this {
      this.url = urlExtractor;
      this.sequence['url'] = this.sequenceCount++;
      return this;
    }

    withRequestHeadersExtractor(
      requestHeadersExtractor: (
        headers: { name: string; value: string }[],
      ) => number[],
    ): this {
      this.requestHeaders = requestHeadersExtractor;
      this.sequence['requestHeaders'] = this.sequenceCount++;
      return this;
    }

    withResponseExtractor(
      responseExtractor: (response: {
        documentId: string;
        documentLifecycle: string;
        frameId: string;
        frameType: string;
        fromCache: boolean;
        initiator: string;
        ip: string;
        method: string;
        parentFrameId: number;
        requestId: string;
        responseHeaders: { name: string; value: string }[];
      }) => number[],
    ): this {
      this.response = responseExtractor;
      this.sequence['response'] = this.sequenceCount++;
      return this;
    }

    withSuccessExtractor(
      successExtractor: (success: boolean) => number[],
    ): this {
      this.success = successExtractor;
      this.sequence['success'] = this.sequenceCount++;
      return this;
    }

    withLabelExtractor(
      labelExtractor: (label: boolean) => number[],
    ): this {
      this.label = labelExtractor;
      this.sequence['label'] = this.sequenceCount++;
      return this;
    }

    withSequence(sequence: Sequence): this {
      this.sequence = sequence;
      return this;
    }

    build(): FeatureExtractor {
      return new FeatureExtractor(this.expectedLength,
        this.sequence,
        this.documentId,
        this.documentLifecycle,
        this.frameId,
        this.frameType,
        this.initiator,
        this.method,
        this.parentFrameId,
        this.requestId,
        this.tabId,
        this.timeStamp,
        this.type,
        this.url,
        this.requestHeaders,
        this.response,
        this.success,
        this.label
      )
    }
  }



  private constructor(private expectedLength: number,
    private sequence: Sequence,
    private documentId?: (documentId: string) => number[],
    private documentLifecycle?: (documentLifecycle: string) => number[],
    private frameId?: (frameId: number) => number[],
    private frameType?: (frameType: string) => number[],
    private initiator?: (initiator: string) => number[],
    private method?: (method: string) => number[],
    private parentFrameId?: (parentFrameId: number) => number[],
    private requestId?: (requestId: string) => number[],
    private tabId?: (tabId: number) => number[],
    private timeStamp?: (timeStamp: string) => number[],
    private type?: (type: string) => number[],
    private url?: (url: string) => number[],
    private requestHeaders?: (
      headers: { name: string; value: string }[],
    ) => number[],
    private response?: (response: {
      documentId: string;
      documentLifecycle: string;
      frameId: string;
      frameType: string;
      fromCache: boolean;
      initiator: string;
      ip: string;
      method: string;
      parentFrameId: number;
      requestId: string;
      responseHeaders: { name: string; value: string }[];
    }) => number[],
    private success?: (success: boolean) => number[],
    private label?: (label: boolean) => number[]) { }

  static builder(expectedLength: number) {
    return new this.FeatureExtractorBuilder(expectedLength);
  }

  extract(request: Request): string {
    const seq = Object.keys(this.sequence)
      .map((key) => ({ key, value: this.sequence[key] }))
      .sort((extractor1, extractor2) => extractor1.value - extractor2.value);
    return seq
      .map((extractor) => this[extractor.key](request[extractor.key]))
      .reduce((acc, next) => acc.concat(next))
      .join(',')
  }
}
