import { ApiProperty } from '@nestjs/swagger';
export class RequestDto {
  @ApiProperty({ description: 'The document id of the request' })
  documentId: string;
  @ApiProperty({ description: 'The document lifecycle of the request' })
  documentLifecycle: string;
  @ApiProperty({ example: 1, description: 'The frame Id provided by chrome' })
  frameId: number;
  @ApiProperty({
    example: 'outermost_frame',
    description: 'Outermost frame attribute provided by chrome',
  })
  frameType: string;
  @ApiProperty({ example: 'google.com', description: 'The request initiator' })
  initiater: string;
  @ApiProperty({ example: 'GET', description: 'The request method' })
  method: string;
  @ApiProperty({ description: 'The parent frame Id' })
  parentFrameId: number;
  @ApiProperty({ description: 'The request Id' })
  requestId: string;
  @ApiProperty({ description: 'The tab Id' })
  tabId: number;
  @ApiProperty({ description: 'The request timestamp' })
  timeStamp: string;
  @ApiProperty({
    example: 'xmlhttprequest',
    description: 'The request type provided by chrome',
  })
  type: string;
  @ApiProperty({
    example: 'https://www.google.de',
    description: 'The url the requests wants to call',
  })
  url: string;
  @ApiProperty({
    example: [{ Accept: 'application/json' }],
    description: 'The requestheaders provided by chrome',
  })
  requestHeaders: any[];
  @ApiProperty({
    example: [{ Accept: 'application/json' }],
    description: 'The request response provided by chrome',
  })
  response?: {
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
  };
  @ApiProperty({
    example: true,
    description: 'The url the requests wants to call',
  })
  success?: boolean;
  @ApiProperty({
    example: true,
    description: 'The label true: Tracking, false: non-Tracking',
  })
  labels: boolean | {isLabeled: boolean, blocklist: string, rule?: any[]}[];
}
