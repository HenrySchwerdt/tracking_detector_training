import { ApiProperty } from "@nestjs/swagger";
export class RequestDto {
    @ApiProperty({example: "https://www.google.de", description: "The url the requests wants to call"})
    readonly url: string;
    @ApiProperty({example: "outermost_frame", description: "Outermost frame attribute provided by chrome"})
    readonly frameType: string;
    @ApiProperty({example: "GET", description: "The request method"})
    readonly method: string;
    @ApiProperty({example: "xmlhttprequest", description: "The request type provided by chrome"})
    readonly type: string;
    @ApiProperty({example: "1", description: "The frame Id provided by chrome"})
    readonly frameId: number;
    @ApiProperty({example: [{"Accept": "application/json"}], description: "The requestheaders provided by chrome"})
    readonly requestHeaders: any[];
    @ApiProperty({example: "google.com", description: "The request initiator"})
    readonly initiater: string;
    @ApiProperty({example: true, description: "The label true: Tracking, false: non-Tracking"})
    readonly label: boolean;
}