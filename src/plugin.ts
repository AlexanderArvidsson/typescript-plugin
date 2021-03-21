import type * as ts from 'typescript/lib/tsserverlibrary'
import type {
  TemplateContext,
  TemplateSettings,
} from 'typescript-template-language-service-decorator'

import StandardScriptSourceHelper from 'typescript-template-language-service-decorator/lib/standard-script-source-helper'

import { ConfigurationManager, TwindPluginConfiguration } from './configuration'
import { TwindLanguageService } from './language-service'
import { StandardTemplateSourceHelper } from './source-helper'
import { LanguageServiceLogger } from './logger'
import { getSubstitutions } from './substituter'
import { getSourceMatchers } from './source-matcher'

// https://github.com/microsoft/typescript-template-language-service-decorator/blob/main/src/standard-template-source-helper.ts#L75

const translateTextSpan = (context: TemplateContext, span: ts.TextSpan): ts.TextSpan => {
  return {
    start: context.node.getStart() + 1 + span.start,
    length: span.length,
  }
}

const translateCompletionInfo = (
  context: TemplateContext,
  info: ts.CompletionInfo,
): ts.CompletionInfo => {
  return {
    ...info,
    entries: info.entries.map((entry) => translateCompletionEntry(context, entry)),
  }
}

const translateCompletionEntry = (
  context: TemplateContext,
  entry: ts.CompletionEntry,
): ts.CompletionEntry => {
  return {
    ...entry,
    replacementSpan: entry.replacementSpan
      ? translateTextSpan(context, entry.replacementSpan)
      : undefined,
  }
}

export class TwindPlugin {
  private readonly typescript: typeof ts
  private _logger?: LanguageServiceLogger
  private readonly _configManager = new ConfigurationManager()

  public constructor(typescript: typeof ts) {
    this.typescript = typescript
  }

  public create(info: ts.server.PluginCreateInfo): ts.LanguageService {
    this._logger = new LanguageServiceLogger(info)
    this._configManager.updateFromPluginConfig(info.config)

    this._logger.log('config: ' + JSON.stringify(this._configManager.config))

    const { languageService } = info

    if (!isValidTypeScriptVersion(this.typescript)) {
      this._logger.log('Invalid typescript version detected. TypeScript 4.1 required.')
      return languageService
    }

    const ttls = new TwindLanguageService(this.typescript, info, this._configManager, this._logger)

    const templateSettings = getTemplateSettings(this._configManager, this._logger)

    const helper = new StandardTemplateSourceHelper(
      this.typescript,
      templateSettings,
      new StandardScriptSourceHelper(this.typescript, info.project),
      getSourceMatchers(this.typescript, templateSettings),
    )

    // Set up decorator
    return {
      ...languageService,

      getCompletionEntryDetails: (fileName, position, name, ...rest: any[]) => {
        const context = helper.getTemplate(fileName, position)

        if (context) {
          return ttls.getCompletionEntryDetails(
            context,
            helper.getRelativePosition(context, position),
            name,
          )
        }

        return (languageService.getCompletionsAtPosition as any)(fileName, position, name, ...rest)
      },

      getCompletionsAtPosition: (fileName, position, options) => {
        const context = helper.getTemplate(fileName, position)

        if (context) {
          return translateCompletionInfo(
            context,
            ttls.getCompletionsAtPosition(context, helper.getRelativePosition(context, position)),
          )
        }

        return languageService.getCompletionsAtPosition(fileName, position, options)
      },

      getQuickInfoAtPosition: (fileName, position) => {
        const context = helper.getTemplate(fileName, position)

        if (context) {
          const quickInfo = ttls.getQuickInfoAtPosition(
            context,
            helper.getRelativePosition(context, position),
          )

          if (quickInfo) {
            return {
              ...quickInfo,
              textSpan: translateTextSpan(context, quickInfo.textSpan),
            }
          }
        }

        return languageService.getQuickInfoAtPosition(fileName, position)
      },

      getSemanticDiagnostics: (fileName) => {
        const diagnostics = [...languageService.getSemanticDiagnostics(fileName)]

        helper.getAllTemplates(fileName).forEach((context) => {
          for (const diagnostic of ttls.getSemanticDiagnostics(context)) {
            diagnostics.push({
              ...diagnostic,
              start: context.node.getStart() + 1 + (diagnostic.start || 0),
            })
          }
        })

        return diagnostics
      },
    }

    // return decorateWithTemplateLanguageService(
    //   this.typescript,
    //   info.languageService,
    //   info.project,
    //   new TwindLanguageService(this.typescript, info, this._configManager, this._logger),
    //   getTemplateSettings(this._configManager, this._logger),
    //   { logger: this._logger },
    // )
  }

  public onConfigurationChanged(config: TwindPluginConfiguration): void {
    if (this._logger) {
      this._logger.log('onConfigurationChanged')
    }

    this._configManager.updateFromPluginConfig(config)
  }
}

export function getTemplateSettings(
  configManager: ConfigurationManager,
  logger: LanguageServiceLogger,
): TemplateSettings {
  return {
    get tags() {
      return configManager.config.tags
    },
    enableForStringWithSubstitutions: true,
    getSubstitutions(templateString, spans): string {
      logger.log(`getSubstitutions: ${JSON.stringify(templateString)} (${JSON.stringify(spans)})`)
      return getSubstitutions(/* templateString, spans */)
    },
  }
}

function isValidTypeScriptVersion(typescript: typeof ts): boolean {
  const [major, minor] = typescript.version.split('.')

  return Number(major) > 4 || (Number(major) == 4 && Number(minor) >= 1)
}
