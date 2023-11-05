import { createVuetify } from 'vuetify'
import { es } from 'vuetify/locale'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {
    VDataTable,
} from "vuetify/labs/VDataTable";
import { VDatePicker } from 'vuetify/labs/VDatePicker'
export default createVuetify({
    directives,
    components: {
        ...components,
        VDataTable,
        VDatePicker
    },
    locale: {
        locale: 'es',
        fallback: 'es',
        messages: { es },
    }
})