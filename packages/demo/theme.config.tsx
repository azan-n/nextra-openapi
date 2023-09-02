import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: <span>My Project</span>,
  footer: {
    text: `Demo © ${new Date().getFullYear()}`,
  },
}

export default config
