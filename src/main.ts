import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import ElememtPlus from "element-plus"
import { store, key } from "./store"
import "./assets/scss/index.scss"
import "element-plus/dist/index.css"
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import fontLibrary from "./utils/icon"
import CKEditor from "@ckeditor/ckeditor5-vue"

const app = createApp(App)
library.add(...fontLibrary)

app.use(store, key)
app.use(router)
app.use(ElememtPlus)
app.component("font-awesome-icon", FontAwesomeIcon)
app.use(CKEditor)
app.mount("#app")
