/** @jsx jsx */
import { AspectRatioBox, Flex, Spinner } from '@chakra-ui/core'
import { css, jsx } from '@emotion/core'
import { get } from 'lodash-es'

const defaultRatio = 16 / 9

function VimeoEmbed({ video, maxWidth, ratio = defaultRatio, ...props }) {
  if (!video) {
    return null
  }

  return (
    <AspectRatioBox maxW={maxWidth} ratio={ratio} as="div" {...props}>
      {get(video, 'loading') ? (
        <Flex justifyContent="center" alignItems="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="secondary"
            size="xl"
          />
        </Flex>
      ) : (
        <div
          css={css`
            position: absolute;
            top: 0;
            height: 100%;
            width: 100%;
            iframe {
              height: 100%;
              width: 100%;
            }
          `}
          dangerouslySetInnerHTML={{
            __html: get(video, 'data.embed.html', ''),
          }}
        />
      )}
    </AspectRatioBox>
  )
}

export default VimeoEmbed
