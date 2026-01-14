import { Controller, Get } from '@nestjs/common'

@Controller('types') // <-- /types
export class TypesController {
    @Get()
    getAll() {
        return []
    }
}
