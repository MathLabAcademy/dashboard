import HeaderGrid from 'components/HeaderGrid'
import { SlateViewer } from 'components/Slate/index.js'
import { sortBy } from 'lodash-es'
import React, { useMemo } from 'react'
import { Grid, Header, Segment } from 'semantic-ui-react'
import EditMCQ from './ActionModals/EditMCQ.js'

const optionLetters = ['a', 'b', 'c', 'd']

function MCQ({ mcq, index }) {
  const options = useMemo(() => {
    return sortBy(mcq.Options, 'id')
  }, [mcq.Options])

  return (
    <>
      <HeaderGrid
        Left={
          <Header>
            <Header.Subheader>#{index + 1}</Header.Subheader>
            <SlateViewer initialValue={mcq.text} />
          </Header>
        }
        Right={<EditMCQ index={index} mcq={mcq} options={options} />}
      />

      <Segment basic>
        <Grid columns={2} stackable>
          {options.map((option, index) => (
            <Grid.Column key={option.id}>
              {optionLetters[index]}.{' '}
              <SlateViewer initialValue={option.text} inline />
            </Grid.Column>
          ))}
        </Grid>
      </Segment>
    </>
  )
}

export default MCQ
