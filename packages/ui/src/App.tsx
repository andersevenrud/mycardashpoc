import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ModuleProvider } from '~/providers/modules'
import { ConnectionProvider } from '~/providers/connection'
import { ToastProvider } from '~/providers/toaster'
import { KeyboardProvider } from '~/providers/keyboard'
import { Router } from '~/providers/routes'
import Toaster from '~/components/layout/Toaster'
import Header from '~/components/layout/Header'
import Main from '~/components/layout/Main'
import Viewport from '~/components/layout/Viewport'
import PageTransition from '~/components/transitions/PageTransition'
import SimpleKeyboard from '~/components/Keyboard'
import createConfiguration from '~/config'
import type { PropsWithChildren } from 'react'
import type { PartialConfiguration, Configuration } from '~/config'

/**
 * Initialize all Providers.
 */
export function Providers({
  configuration,
  children,
}: PropsWithChildren<{
  configuration: Configuration
}>) {
  return (
    <BrowserRouter>
      <ConnectionProvider configuration={configuration.connection}>
        <ToastProvider configuration={configuration.toaster}>
          <ModuleProvider configuration={configuration.modules}>
            <KeyboardProvider>{children}</KeyboardProvider>
          </ModuleProvider>
        </ToastProvider>
      </ConnectionProvider>
    </BrowserRouter>
  )
}

/**
 * Main Application component.
 */
export default function App({
  defaultConfiguration = {},
}: PropsWithChildren<{
  defaultConfiguration?: PartialConfiguration
}>) {
  const configuration = createConfiguration(defaultConfiguration)

  return (
    <Providers configuration={configuration}>
      <Viewport>
        <Header />
        <Main>
          <PageTransition>
            <Router />
          </PageTransition>
          <Toaster />

          {configuration.keyboard && <SimpleKeyboard />}
        </Main>
      </Viewport>
    </Providers>
  )
}
