import { theme as chakraTheme } from '@chakra-ui/core'
import { borders } from './borders'
import { breakpoints } from './breakpoints'
import { colors } from './colors'
import { opacity } from './opacity'
import { radii } from './radii'
import { shadows } from './shadows'
import { sizes } from './sizes'
import { space } from './space'
import {
  fonts,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
} from './typography'
import { zIndices } from './zIndices'

const theme = {
  ...chakraTheme,
  breakpoints,
  zIndices,
  radii,
  opacity,
  borders,
  colors,

  fontSizes,
  fontWeights,
  fonts,
  letterSpacings,
  lineHeights,

  sizes: {
    ...sizes,
    navbar: '3.5rem',
    sidebar: '14rem',
  },
  shadows,
  space,
  icons: {
    ...chakraTheme.icons,
  },
}

export default theme
