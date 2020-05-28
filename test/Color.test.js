const Color = artifacts.require('./Color.sol');

require('chai').use(require('chai-as-promised')).should();

contract('Color', (accounts) => {
    let contract
    before(async () => {
        contract = await Color.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async() => {
            const address = contract.address
            console.log(address)
            assert.notEqual(address, '')
            assert.notEqual(address, 0x0)
            assert.notEqual(address, undefined)
            assert.notEqual(address, null)
        })

        it('has a name', async () => {
            const name = await contract.name()
            console.log(`name: ${name}`)
            assert.equal(name, "Color")
        })

        it('has a symbol', async () => {
            const symbol = await contract.symbol()
            console.log(`symbol: ${symbol}`)
            assert.equal(symbol, "COLOR")
        })
    })

    describe('minting', async () => {
        it('minted a new token', async () => {
            const result =  await contract.mint('#FFFFFF')
            //Total Supply: How many token exists? returns uint
            const totalSupply = await contract.totalSupply()
            //----------SUCCESS
            console.log(`Number of token: ${totalSupply}`)
            assert.equal(totalSupply, 1)
            //mint function returns emit Transfer information (Thus, result has it).
            const event = result.logs[0].args
            assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
            assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
            assert.equal(event.to, accounts[0], 'to is correct')

            //----------Failure
            //Minting same color again should invoke Error
            await contract.mint('#FFFFFF').should.be.rejected;
        })
    })

    describe('indexing', async() => {
        it('lists colors', async() => {
            await contract.mint('#FF0000')
            await contract.mint('#00FF00')
            await contract.mint('#0000FF')
            const totalSupply = await contract.totalSupply();
            let color
            let result = []
            for(var i = 1; i <= totalSupply; i++) {
                color = await contract.colors(i - 1)
                result.push(color)
            }
            let expected = ['#FFFFFF','#FF0000', '#00FF00', '#0000FF']
            assert.equal(result.join(','), expected.join(','))
        })
    })
})

