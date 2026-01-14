import { Module } from "@nestjs/common";
import { OtypesController } from "./otypes.controller";
import { TypesModule } from "../types/types.module";

@Module({
    imports: [TypesModule],     // ✅ чтобы TypesService был доступен
    controllers: [OtypesController],
})
export class OtypesModule { }
