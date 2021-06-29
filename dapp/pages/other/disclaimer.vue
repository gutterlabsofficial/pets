<template>
  <v-layout align-center justify-center class="metamask-info-template">
    <v-flex xs12 sm8 md6 class="metamask-info-template__row">
      <v-card elevation="0" class="metamask-info-template__card">
        <v-card-title class="error white--text quick-font-fix-for-mobile"
          >Disclaimer</v-card-title
        >
        <v-card-text>
          <br /><br />
          This application is in BETA!<br />
          <br />
          <br />
          You can review the source code
          <a
            target="_blank"
            style="text-decoration: underline"
            href="https://github.com/nftinvesting/pets"
            >here
          </a>
          <br />
          You can check that the code deployed on the contract is verified on
          etherscan.
          <br />
          This dapp is intented to be used by people familiar with smart
          contracts
          <br />
          Please be sure you are familiar with the ethereum ecosystem and feel
          fully comfortable before utilizing our dapps<br />
          <br />GutterCatGang does not control the Dapps Platform, but rather
          may support, develop and maintain the free, open-source protocol that
          is this Dapp. The Dapp is made available under the MIT open source
          license -- and the disclaimers contained therein apply including that
          the Gutter Cat Dapps is provided "AS IS" and "WITHOUT WARRANTY OF ANY
          KIND, EXPRESS OR IMPLIED". <br />
          <br />
          GutterCatGang's mission is to make Ethereum & NFTs as easy to use for
          as many people as possible.
        </v-card-text>

        <v-card-text>
          <br />Visit You acknowledge that the current version of the this Dapp
          Platform is a beta version and as such has not been fully-tested and
          may not perform as designed.
          <br />
          <br />GUTTERCATGANG WILL NOT BE LIABLE FOR ANY LIABILITY OR DAMAGES
          WHATSOEVER ASSOCIATED WITH YOUR USE, INABILITY TO USE, OR YOUR
          INTERACTION WITH OTHER USERS OF, THIS DAPP, OTHER DAPPS PLATFORM OR
          ESPORT GAMES, INCLUDING ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
          EXEMPLARY OR CONSEQUENTIAL DAMAGES, LOSS OF PROFITS, TOKENS, NFTs OR
          DATA.
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  auth: false,
  data: () => ({
    variable: null,
  }),
  mounted() {},
}
</script>

<style>
.v-card__title.quick-font-fix-for-mobile {
  font-size: 2em;
}
</style>
