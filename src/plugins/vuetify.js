import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {
    VDataTable,
} from "vuetify/labs/VDataTable";
export default createVuetify({
    directives,
    components: {
        ...components,
        VDataTable
    }
})