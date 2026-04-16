import { gql } from '@apollo/client';

export const ADD_NOTE = gql`
  mutation AddNote($input: AddNoteInput!) {
    addNote(input: $input) {
      id
      notes {
        id
        content
      }
    }
  }
`;
