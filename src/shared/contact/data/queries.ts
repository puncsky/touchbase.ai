import gql from "graphql-tag";

export const getContact = gql`
  query GetContact($id: String, $isSelf: Boolean) {
    contact(id: $id, isSelf: $isSelf) {
      _id
      emails
      name
      phones
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
      createAt
    }
  }
`;

export const getInteractions = gql`
  query GetInteractions(
    $contactId: String
    $offset: Float
    $limit: Float
    $isSelf: Boolean
  ) {
    interactions(
      contactId: $contactId
      offset: $offset
      limit: $limit
      isSelf: $isSelf
    ) @connection(key: "event", filter: ["contactId", "isSelf"]) {
      interactions {
        id
        content
        public
        timestamp
      }
      count
    }
  }
`;
