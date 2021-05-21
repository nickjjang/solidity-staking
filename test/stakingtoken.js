const StakingToken = artifacts.require('StakingToken')
const BigNumber = require('bignumber.js')

contract('StakingToken', (accounts) => {
  let stakingToken
  const manyTokens = BigNumber(10).pow(18).multipliedBy(1000)
  const owner = accounts[0]
  const user = accounts[1]
  console.log(accounts)

  before(async () => {
    stakingToken = await StakingToken.deployed()
  })

  describe('Staking', () => {
    it('createStake creates a stake.', async () => {
      await stakingToken.transfer(user, 3, { from: owner })
      await stakingToken.createStake(1, { from: user })

      assert.equal(await stakingToken.balanceOf(user), 2)
      assert.equal(await stakingToken.stakeOf(user), 1)
      assert.equal(
        await stakingToken.totalSupply(),
        manyTokens.minus(1).toString(10),
      )
      assert.equal(await stakingToken.totalStakes(), 1)
    })

    it('rewards are distributed.', async () => {
      await stakingToken.transfer(user, 100, { from: owner })
      await stakingToken.createStake(100, { from: user })
      await stakingToken.distributeRewards({ from: owner })

      assert.equal(await stakingToken.rewardOf(user), 1)
      assert.equal(await stakingToken.totalRewards(), 1)
    })

    it('rewards can be withdrawn.', async () => {
      await stakingToken.transfer(user, 100, { from: owner })
      await stakingToken.createStake(100, { from: user })
      await stakingToken.distributeRewards({ from: owner })
      await stakingToken.withdrawReward({ from: user })

      assert.equal(await stakingToken.balanceOf(user), 5)
      assert.equal(await stakingToken.stakeOf(user), 201)
      assert.equal(await stakingToken.rewardOf(user), 0)
      assert.equal(await stakingToken.totalStakes(), 201)
      assert.equal(await stakingToken.totalRewards(), 0)
    })
  })
})
