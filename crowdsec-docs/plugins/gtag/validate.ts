import type { OptionValidationContext, ThemeConfig, ThemeConfigValidationContext } from "@docusaurus/types"
import { Joi } from "@docusaurus/utils-validation"

export type PluginOptions = {
    trackingID: string
    anonymizeIP: boolean
}

export type Options = {
    trackingID: string
    anonymizeIP?: boolean
}

export const DEFAULT_OPTIONS: Partial<PluginOptions> = {
    anonymizeIP: false,
}

const pluginOptionsSchema = Joi.object<PluginOptions>({
    trackingID: Joi.string().required(),
    anonymizeIP: Joi.boolean().default(DEFAULT_OPTIONS.anonymizeIP),
})

export function validateOptions({ validate, options }: OptionValidationContext<Options, PluginOptions>): PluginOptions {
    return validate(pluginOptionsSchema, options)
}

export function validateThemeConfig({ themeConfig }: ThemeConfigValidationContext<ThemeConfig>): ThemeConfig {
    if ("gtag" in themeConfig) {
        throw new Error(
            'The "gtag" field in themeConfig should now be specified as option for plugin-google-gtag. More information at https://github.com/facebook/docusaurus/pull/5832.'
        )
    }
    return themeConfig
}
