import { Controller, Get } from '@nestjs/common'

@Controller('product') // <-- /product
export class ProductsController {
    @Get()
    getAll() {
        return [] // пока пусто, главное убрать 404
    }
}
