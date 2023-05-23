import { Store } from "vuex"

interface IState {
  defaultState: any
}

declare module "@vue/runtime-core" {
  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>
  }
}
