import { ApiProperty } from "@nestjs/swagger";
export class RequestDto {
    @ApiProperty()
    readonly url: string;
    @ApiProperty()
    readonly frameType: string;
    @ApiProperty()
    readonly method: string;
    @ApiProperty()
    readonly type: string;
    @ApiProperty()
    readonly frameId: number;
    @ApiProperty()
    readonly requestHeaders: any[];
    @ApiProperty()
    readonly initiater: string;
    @ApiProperty()
    readonly label: boolean;
}