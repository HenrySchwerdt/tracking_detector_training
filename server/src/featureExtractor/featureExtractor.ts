import { Request } from "src/requests/request.model";
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


    private documentId?: (documentId: string) => [number]
    private documentLifecycle?: (documentLifecycle: string) => [number]
    private frameId?: (frameId: number) => [number]
    private frameType?: (frameType: string) => [number]
    private initiator?: (initiator: string) => [number]
    private method?: (method: string) => [number]
    private parentFrameId?: (parentFrameId: number) => [number]
    private requestId?: (requestId: string) => [number]
    private tabId?: (tabId: number) => [number]
    private timeStamp?: (timeStamp: string) => [number]
    private type?: (type: string) => [number]
    private url?: (url: string) => [number]
    private requestHeaders?: (headers: [{ name: string, value: string }]) => [number]
    private response?: (response: { documentId: string, documentLifecycle: string, frameId: string, frameType: string, fromCache: boolean, initiator: string, ip: string, method: string, parentFrameId: number, requestId: string, responseHeaders: [{ name: string, value: string }] }) => [number]
    private success?: (success: boolean) => [number]
    private label?: (label: boolean) => [number]



    private constructor(private expectedLength: number) {

    }

    static builder(expectedLength: number) {
        return new FeatureExtractor(expectedLength)
    }

    withDocumentIdExtractor(documentIdExtractor: (documentId: string) => [number]) {
        this.documentId = documentIdExtractor
    }

    withDocumentLifecycleExtractor(documentLifecycleExtractor: (documentLifecycle: string) => [number]) {
        this.documentLifecycle = documentLifecycleExtractor
    }

    withFrameIdExtractor(frameIdExtractor: (documentLifecycle: number) => [number]) {
        this.frameId = frameIdExtractor
    }

    withFrameTypeExtractor(frameTypeExtractor: (frameType: string) => [number]) {
        this.frameType = frameTypeExtractor
    }

    withInitiatorExtractor(initiatorExtractor: (initiator: string) => [number]) {
        this.initiator = initiatorExtractor
    }

    withMethodExtractor(methodExtractor: (method: string) => [number]) {
        this.method = methodExtractor
    }

    withParentFrameIdExtractor(parentFrameIdExtractor: (parentFrameId: number) => [number]) {
        this.parentFrameId = parentFrameIdExtractor
    }

    withRequestIdExtractor(requestIdExtractor: (requestId: string) => [number]) {
        this.requestId = requestIdExtractor
    }

    withTabIdExtractor(tabIdExtractor: (tabId: number) => [number]) {
        this.tabId = tabIdExtractor
    }

    withTimeStampExtractor(timeStampExtractor: (timeStamp: string) => [number]) {
        this.timeStamp = timeStampExtractor
    }

    withTypeExtractor(typeExtractor: (type: string) => [number]) {
        this.type = typeExtractor
    }

    withUrlExtractor(urlExtractor: (url: string) => [number]) {
        this.url = urlExtractor
    }

    withRequestHeadersExtractor(requestHeadersExtractor: (headers: [{ name: string, value: string }]) => [number]) {
        this.requestHeaders = requestHeadersExtractor
    }

    withResponseExtractor(responseExtractor: (response: { documentId: string, documentLifecycle: string, frameId: string, frameType: string, fromCache: boolean, initiator: string, ip: string, method: string, parentFrameId: number, requestId: string, responseHeaders: [{ name: string, value: string }] }) => [number]) {
        this.response = responseExtractor
    }

    withSuccessExtractor(successExtractor: (success: boolean) => [number]) {
        this.success = successExtractor
    }

    withLabelExtractor(labelExtractor: (label: boolean) => [number]) {
        this.label = labelExtractor
    }

    build(sequence: Sequence): (request: Request) => string {
        const seq = Object.keys(sequence)
                    .map(key => ({key, value: sequence[key]}))
                    .sort((extractor1, extractor2) => extractor1.value - extractor2.value)
        return (request: Request) => {
            return seq.map(extractor => this[extractor.value](request[extractor.value])).join(",")
        }
       
    }

}   
