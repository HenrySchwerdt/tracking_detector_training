import { Request } from "src/repository/request.model"
export interface Sequence {
    documentId?: number
    documentLifecycle?: number
    frameId?: number
    frameType?: number
    initiator?: number
    method?: number
    parentFrameId?: number
    requestId?: number
    tabId?: number
    timeStamp?: number
    type?: number
    url?: number
    requestHeaders?: number
    response?: number
    success?: number
    label?: number
}

export class FeatureExtractor {

    private sequence: Sequence = {}
    private sequenceCount = 0;
    private documentId?: (documentId: string) => number[]
    private documentLifecycle?: (documentLifecycle: string) => number[]
    private frameId?: (frameId: number) => number[]
    private frameType?: (frameType: string) => number[]
    private initiator?: (initiator: string) => number[]
    private method?: (method: string) => number[]
    private parentFrameId?: (parentFrameId: number) => number[]
    private requestId?: (requestId: string) => number[]
    private tabId?: (tabId: number) => number[]
    private timeStamp?: (timeStamp: string) => number[]
    private type?: (type: string) => number[]
    private url?: (url: string) => number[]
    private requestHeaders?: (headers: { name: string, value: string }[]) => number[]
    private response?: (response: { documentId: string, documentLifecycle: string, frameId: string, frameType: string, fromCache: boolean, initiator: string, ip: string, method: string, parentFrameId: number, requestId: string, responseHeaders: { name: string, value: string }[] }) => number[]
    private success?: (success: boolean) => number[]
    private label?: (label: boolean) => number[]



    private constructor(private expectedLength: number) {

    }

    static builder(expectedLength: number) {
        return new FeatureExtractor(expectedLength)
    }

    withDocumentIdExtractor(documentIdExtractor: (documentId: string) => number[]): FeatureExtractor {
        this.documentId = documentIdExtractor
        this.sequence['documentId'] = this.sequenceCount++;
        return this;
    }

    withDocumentLifecycleExtractor(documentLifecycleExtractor: (documentLifecycle: string) => number[]): FeatureExtractor {
        this.documentLifecycle = documentLifecycleExtractor
        this.sequence['documentLifecycle'] = this.sequenceCount++;
        return this;
    }

    withFrameIdExtractor(frameIdExtractor: (documentLifecycle: number) => number[]): FeatureExtractor {
        this.frameId = frameIdExtractor
        this.sequence['frameId'] = this.sequenceCount++;
        return this
    }

    withFrameTypeExtractor(frameTypeExtractor: (frameType: string) => number[]): FeatureExtractor {
        this.frameType = frameTypeExtractor
        this.sequence['frameType'] = this.sequenceCount++;
        return this
    }

    withInitiatorExtractor(initiatorExtractor: (initiator: string) => number[]): FeatureExtractor {
        this.initiator = initiatorExtractor
        this.sequence['initiator'] = this.sequenceCount++;
        return this
    }

    withMethodExtractor(methodExtractor: (method: string) => number[]): FeatureExtractor {
        this.method = methodExtractor
        this.sequence['method'] = this.sequenceCount++;
        return this
    }

    withParentFrameIdExtractor(parentFrameIdExtractor: (parentFrameId: number) => number[]): FeatureExtractor {
        this.parentFrameId = parentFrameIdExtractor
        this.sequence['parentFrameId'] = this.sequenceCount++;
        return this
    }

    withRequestIdExtractor(requestIdExtractor: (requestId: string) => number[]): FeatureExtractor {
        this.requestId = requestIdExtractor
        this.sequence['requestId'] = this.sequenceCount++;
        return this
    }

    withTabIdExtractor(tabIdExtractor: (tabId: number) => number[]): FeatureExtractor {
        this.tabId = tabIdExtractor
        this.sequence['tabId'] = this.sequenceCount++;
        return this
    }

    withTimeStampExtractor(timeStampExtractor: (timeStamp: string) => number[]): FeatureExtractor {
        this.timeStamp = timeStampExtractor
        this.sequence['timeStamp'] = this.sequenceCount++;
        return this
    }

    withTypeExtractor(typeExtractor: (type: string) => number[]): FeatureExtractor {
        this.type = typeExtractor
        this.sequence['type'] =  this.sequenceCount++;
        return this
    }

    withUrlExtractor(urlExtractor: (url: string) => number[]): FeatureExtractor {
        this.url = urlExtractor
        this.sequence['url'] = this.sequenceCount++;
        return this
    }

    withRequestHeadersExtractor(requestHeadersExtractor: (headers: { name: string, value: string }[]) => number[]): FeatureExtractor {
        this.requestHeaders = requestHeadersExtractor
        this.sequence['requestHeaders'] = this.sequenceCount++;
        return this
    }

    withResponseExtractor(responseExtractor: (response: { documentId: string, documentLifecycle: string, frameId: string, frameType: string, fromCache: boolean, initiator: string, ip: string, method: string, parentFrameId: number, requestId: string, responseHeaders: { name: string, value: string }[] }) => number[]): FeatureExtractor {
        this.response = responseExtractor
        this.sequence['response'] = this.sequenceCount++;
        return this
    }

    withSuccessExtractor(successExtractor: (success: boolean) => number[]): FeatureExtractor {
        this.success = successExtractor
        this.sequence['success'] = this.sequenceCount++;
        return this
    }

    withLabelExtractor(labelExtractor: (label: boolean) => number[]): FeatureExtractor {
        this.label = labelExtractor
        this.sequence['label'] = this.sequenceCount++;
        return this;
    }

    withSequence(sequence: Sequence): FeatureExtractor {
        this.sequence = sequence;
        return this
    }

    build(): (request: Request) => string {
        const seq = Object.keys(this.sequence)
                    .map(key => ({key, value: this.sequence[key]}))
                    .sort((extractor1, extractor2) => extractor1.value - extractor2.value)
        return (request: Request) => {
            return seq
            .map(extractor => this[extractor.value](request[extractor.value]))
            .reduce((acc, next) => acc.concat(next))
            .join(",")
        }
       
    }

}   
