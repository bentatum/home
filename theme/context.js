// @flow weak
/* eslint-disable no-underscore-dangle */

import { create } from 'jss'
import preset from 'jss-preset-default'
import { SheetsRegistry } from 'react-jss'
import { createMuiTheme } from 'material-ui/styles'
import createGenerateClassName from 'material-ui/styles/createGenerateClassName'
import { overrides, palette, typography } from './config'

const themeConfig = {
  palette,
  typography,
  overrides
}

const theme = createMuiTheme(themeConfig)

// Configure JSS
const jss = create(preset())
jss.options.createGenerateClassName = createGenerateClassName

function createContext () {
  return {
    jss,
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry()
  }
}

export function setContext () {
  // Singleton hack as there is no way to pass variables from _document.js to pages yet.
  global.__INIT_MATERIAL_UI__ = createContext()
}

export function getContext () {
  // Make sure to create a new store for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return global.__INIT_MATERIAL_UI__
  }

  // Reuse context on the client-side
  if (!global.__INIT_MATERIAL_UI__) {
    global.__INIT_MATERIAL_UI__ = createContext()
  }

  return global.__INIT_MATERIAL_UI__
}
