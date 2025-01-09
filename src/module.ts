import { addImportsDir, createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'nuxt-supabase-query',
    configKey: 'nuxtSupabaseQuery',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const { resolve } = createResolver(import.meta.url)
    addImportsDir(resolve('./runtime/composables'))
    // Add supabase composables
    // _nuxt.hook('imports:dirs', (dirs) => {
    //   dirs.push(resolve('./runtime/composables'))
    // })
  },
})
