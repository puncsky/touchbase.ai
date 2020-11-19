import gql from "graphql-tag";

export const getContacts = gql`
  query contacts($offset: Float, $limit: Float) {
    contacts(offset: $offset, limit: $limit) {
      _id
      emails
      phones
      name
      avatarUrl
      address
      bornAt
      bornAddress
      knownAt
      knownSource
      extraversionIntroversion
      intuitingSensing
      thinkingFeeling
      planingPerceiving
      tdp
      inboundTrust
      outboundTrust
      blurb
      workingOn
      desire
      title
      experience {
        title
        name
      }
      education {
        title
        name
      }
      linkedin
      facebook
      github
      createAt
      updateAt
    }
  }
`;
