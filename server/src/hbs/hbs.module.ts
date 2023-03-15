import { Module } from "@nestjs/common";
import { HbsController } from "./hbs.controller";
import { HbsService } from "./hbs.service";


@Module({
    imports: [],
    controllers: [HbsController],
    providers: [HbsService]
})
export class HbsModule {}