import { setupI18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { get } from 'lodash-es'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

export const i18n = setupI18n()

function LazyI18nProvider({ language, children }) {
  const [catalogs, setCatalogs] = useState({})

  useEffect(() => {
    if (!get(catalogs, language)) {
      fetchCatalog(language).then((catalog) => {
        setCatalogs((catalogs) => ({
          ...catalogs,
          [language]: catalog,
        }))
      })
    }
  }, [catalogs, language])

  if (!get(catalogs, language)) return null

  return (
    <I18nProvider
      i18n={i18n}
      language={language}
      catalogs={catalogs}
      children={children}
    />
  )
}

const mapStateToProps = ({ ui }) => ({
  language: get(ui, 'locale.language'),
})

export default connect(mapStateToProps)(LazyI18nProvider)

async function fetchCatalog(language) {
  if (process.env.NODE_ENV === 'production') {
    return import(
      /* webpackMode: "lazy", webpackChunkName: "i18n-[index]" */ `./locales/${language}/messages.js`
    )
  } else {
    return import(
      /* webpackMode: "lazy", webpackChunkName: "i18n-[index]" */ `@lingui/loader!./locales/${language}/messages.po`
    )
  }
}
