export class RequestDto {

    readonly url: string;

    readonly frameType: string;

    readonly method: string;

    readonly type: string;

    readonly frameId: number;

    readonly requestHeaders: any[];

    readonly initiater: string;

    readonly label: boolean;
}