const { TokenValidator, NotEmptyValidator } = require('@validator');
const { success } = require('@lib/helper')
const { Flow } = require('@models/flow')
const { Art } = require('@models/art')

class Classic {
    async latest(ctx) {
        const flow = await Flow.findOne({
            order: [
                ['index', 'DESC']
            ]
        })
        const art = await Art.getData(flow.artId, flow.type)
        art.setDataValue('index', flow.index)
        ctx.body = art
    }
}

module.exports = new Classic()