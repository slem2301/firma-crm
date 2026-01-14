import { Controller, Get, UseGuards } from '@nestjs/common'
import { MockAuthGuard } from '../auth/mock-auth.guard'

@Controller()
@UseGuards(MockAuthGuard)
export class DictionaryController {

    @Get('currencies')
    currencies() {
        return ['USD', 'EUR']
    }

    @Get('countries')
    countries() {
        return [
            { code: 'US', name: 'United States' },
            { code: 'PL', name: 'Poland' },
        ]
    }

    @Get('products')
    products() {
        return [
            { id: 'p1', name: 'Kitchen' },
            { id: 'p2', name: 'Bathroom' },
        ]
    }

    @Get('types')
    types() {
        return [
            { id: 't1', name: 'Installation' },
            { id: 't2', name: 'Repair' },
        ]
    }

    @Get('order/get-statuses')
    orderStatuses() {
        return ['NEW', 'IN_PROGRESS', 'DONE', 'CANCELED']
    }

    @Get('price/get-versions')
    priceVersions() {
        return ['v1', 'v2']
    }

    @Get('ad/limits')
    adLimits() {
        return {
            maxOrdersPerDay: 50,
            maxAds: 10,
        }
    }
}
