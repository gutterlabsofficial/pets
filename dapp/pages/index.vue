<template>
  <v-container>
    <p style="font-size: 2.5em">Under construction...</p>
  </v-container>
</template>

<script>
import { ethers } from 'ethers'
import { CONTRACT_ADDR, RPC_PROVIDER, NETWORK_ID } from '../constants'
import { ERC1155_ABI } from '../erc1155_abi'
const EthersUtils = require('ethers').utils

export default {
  auth: false,
  data() {
    return {
      randNFTs: [],
      id: null,
      adoptedCats: null,
      tokenID: null,
      contract: null,
      contractAddress: null,
      itemPriceETH: null,
      itemPriceWei: null,
      txHash: null,
      isOwned: false,
      ethers: null,
      signer: null,
      provider: null,
      errorText: '',
      dialogAdoptMany: false,
      dialogError: false,
      howManyCats: 2,
      showRandNFTs: false,
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.contractAddress = CONTRACT_ADDR
    if (!window.ethereum) {
      this.provider = 'not_web3'
      this.ethers = new ethers.providers.JsonRpcProvider(
        RPC_PROVIDER,
        NETWORK_ID
      )
    } else {
      this.provider = 'web3'
      this.ethers = new ethers.providers.Web3Provider(window.ethereum)
    }
    this.initialize()
  },
  methods: {
    initialize() {
      this.isOwned = false
      this.loadContract()
    },
    clickedNFT(index) {
      this.$router.push('/nft?id=' + index)
    },
    async loadContract() {
      this.contract = new ethers.Contract(
        CONTRACT_ADDR,
        ERC1155_ABI,
        this.ethers
      )

      this.itemPriceWei = await this.contract.getItemPrice()
      this.itemPriceETH = EthersUtils.formatEther(this.itemPriceWei)
      this.adoptedCats = await this.contract.adoptedCats()
    },
    async checkMetamaskConnected() {
      if (window.ethereum) {
        await window.ethereum.enable()
        this.ethers = new ethers.providers.Web3Provider(window.ethereum)

        this.signer = this.ethers.getSigner()
        this.account = await this.signer.getAddress()
        this.balance = await this.signer.getBalance()
        this.ethBalance = await ethers.utils.formatEther(this.balance)
        this.signer = this.ethers.getSigner()
        const addr = await this.signer.getAddress()
        this.walletBtnText =
          addr.substr(0, 7) + '...' + addr.substr(addr.length - 5, addr.length)

        const chainId = this.ethers._network.chainId
        this.$store.commit('setSelectedAddress', addr)
        this.$store.commit('setNetworkID', Number(chainId))

        if (chainId !== 1) {
          this.showNonMainnetWarning = true
        }
        return true
      } else {
        this.$router.push('/other/install_metamask')
        return false
      }
    },
    loadNewURI() {
      window.location.replace('/nft?id=' + this.tokenID)
    },
    viewOnOpenSea() {
      const url =
        'https://opensea.io/assets/' + this.contractAddress + '/' + this.id
      window.open(url, '_blank')
    },
    async adoptOne() {
      console.log('adopting one cat')
      this.txHash = null
      this.ethers = new ethers.providers.Web3Provider(window.ethereum)
      this.signer = this.ethers.getSigner()
      this.contract = new ethers.Contract(
        CONTRACT_ADDR,
        ERC1155_ABI,
        this.signer
      )

      const res = await this.checkMetamaskConnected()
      if (!res) {
        return
      }
      const overrides = { value: this.itemPriceWei, gasLimit: 150000 }

      try {
        const tx = await this.contract.adoptCat(overrides)
        if (tx.hash) {
          this.$toast.info('Transaction submitted successfully')
        }
        this.txHash = tx.hash
      } catch (err) {
        if (err.message.includes('denied')) {
          this.$toast.info('you canceled the transaction')
        } else {
          this.$toast.error(err.message)
        }
      }
    },
    async adoptMultiple() {
      this.txHash = null
      if (this.howManyCats > 10) {
        this.errorText = 'maximum 10 cats at once please'
        this.dialogError = true
        return
      }
      console.log('adopting multiple cats')
      this.ethers = new ethers.providers.Web3Provider(window.ethereum)
      this.signer = this.ethers.getSigner()
      this.contract = new ethers.Contract(
        CONTRACT_ADDR,
        ERC1155_ABI,
        this.signer
      )

      const res = await this.checkMetamaskConnected()
      if (!res) {
        return
      }
      const overrides = {
        value: String(Number(this.howManyCats) * Number(this.itemPriceWei)),
        gasLimit: 1490000,
      }

      try {
        const tx = await this.contract.adoptCats(this.howManyCats, overrides)
        if (tx.hash) {
          this.$toast.info(
            'Transaction submitted successfully. You should check your opensea wallet after it gets confirmed'
          )
          this.txHash = tx.hash
        }
      } catch (err) {
        if (err.message.includes('denied')) {
          this.$toast.info('you canceled the transaction')
        } else {
          this.$toast.error(err.message)
        }
      }
    },
    shuffle(array) {
      let tmp
      let current
      let top = array.length

      if (top)
        while (--top) {
          current = Math.floor(Math.random() * (top + 1))
          tmp = array[current]
          array[current] = array[top]
          array[top] = tmp
        }
      return array
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  max-width: 1500px;
}
.black-text {
  color: black i !important;
}

.theme--dark.v-input input,
.theme--dark.v-input textarea {
  color: #ea201c;
}

.v-card {
  background-color: #333 !important;
}
</style>
