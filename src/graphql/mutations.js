/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const sendChatMessage = /* GraphQL */ `
  mutation SendChatMessage(
    $sessionId: ID!
    $content: String!
    $images: [String!]
  ) {
    sendChatMessage(sessionId: $sessionId, content: $content, images: $images) {
      id
      sessionId
      role
      content
      images
      isStreaming
      timestamp
      session {
        id
        userId
        themeId
        title
        titleLocked
        status
        messageCount
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const saveDataFromSession = /* GraphQL */ `
  mutation SaveDataFromSession($sessionId: ID!) {
    saveDataFromSession(sessionId: $sessionId) {
      id
      themeId
      sessionId
      title
      content
      markdownContent
      images
      createdBy
      isDeleted
      deletedAt
      deletedBy
      createdAt
      updatedAt
      editHistory {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const synthesizeSpeech = /* GraphQL */ `
  mutation SynthesizeSpeech($text: String!) {
    synthesizeSpeech(text: $text) {
      audioUrl
      expiresAt
      __typename
    }
  }
`;
export const markAllNotificationsAsRead = /* GraphQL */ `
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      email
      displayName
      voiceInputSilenceTimeout
      language
      displayTheme
      createdAt
      updatedAt
      teams {
        nextToken
        __typename
      }
      favoriteThemes {
        nextToken
        __typename
      }
      notificationSettings {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      email
      displayName
      voiceInputSilenceTimeout
      language
      displayTheme
      createdAt
      updatedAt
      teams {
        nextToken
        __typename
      }
      favoriteThemes {
        nextToken
        __typename
      }
      notificationSettings {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      email
      displayName
      voiceInputSilenceTimeout
      language
      displayTheme
      createdAt
      updatedAt
      teams {
        nextToken
        __typename
      }
      favoriteThemes {
        nextToken
        __typename
      }
      notificationSettings {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const createTeam = /* GraphQL */ `
  mutation CreateTeam(
    $input: CreateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    createTeam(input: $input, condition: $condition) {
      id
      name
      createdBy
      createdAt
      updatedAt
      members {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const updateTeam = /* GraphQL */ `
  mutation UpdateTeam(
    $input: UpdateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    updateTeam(input: $input, condition: $condition) {
      id
      name
      createdBy
      createdAt
      updatedAt
      members {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const deleteTeam = /* GraphQL */ `
  mutation DeleteTeam(
    $input: DeleteTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    deleteTeam(input: $input, condition: $condition) {
      id
      name
      createdBy
      createdAt
      updatedAt
      members {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const createTeamMember = /* GraphQL */ `
  mutation CreateTeamMember(
    $input: CreateTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    createTeamMember(input: $input, condition: $condition) {
      id
      teamId
      userId
      joinedAt
      team {
        id
        name
        createdBy
        createdAt
        updatedAt
        __typename
      }
      user {
        id
        email
        displayName
        voiceInputSilenceTimeout
        language
        displayTheme
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTeamMember = /* GraphQL */ `
  mutation UpdateTeamMember(
    $input: UpdateTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    updateTeamMember(input: $input, condition: $condition) {
      id
      teamId
      userId
      joinedAt
      team {
        id
        name
        createdBy
        createdAt
        updatedAt
        __typename
      }
      user {
        id
        email
        displayName
        voiceInputSilenceTimeout
        language
        displayTheme
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTeamMember = /* GraphQL */ `
  mutation DeleteTeamMember(
    $input: DeleteTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    deleteTeamMember(input: $input, condition: $condition) {
      id
      teamId
      userId
      joinedAt
      team {
        id
        name
        createdBy
        createdAt
        updatedAt
        __typename
      }
      user {
        id
        email
        displayName
        voiceInputSilenceTimeout
        language
        displayTheme
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createTheme = /* GraphQL */ `
  mutation CreateTheme(
    $input: CreateThemeInput!
    $condition: ModelThemeConditionInput
  ) {
    createTheme(input: $input, condition: $condition) {
      id
      name
      fields {
        id
        name
        type
        required
        options
        order
        __typename
      }
      notificationEnabled
      createdBy
      usageCount
      isDefault
      createdAt
      updatedAt
      favorites {
        nextToken
        __typename
      }
      sessions {
        nextToken
        __typename
      }
      savedData {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const updateTheme = /* GraphQL */ `
  mutation UpdateTheme(
    $input: UpdateThemeInput!
    $condition: ModelThemeConditionInput
  ) {
    updateTheme(input: $input, condition: $condition) {
      id
      name
      fields {
        id
        name
        type
        required
        options
        order
        __typename
      }
      notificationEnabled
      createdBy
      usageCount
      isDefault
      createdAt
      updatedAt
      favorites {
        nextToken
        __typename
      }
      sessions {
        nextToken
        __typename
      }
      savedData {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const deleteTheme = /* GraphQL */ `
  mutation DeleteTheme(
    $input: DeleteThemeInput!
    $condition: ModelThemeConditionInput
  ) {
    deleteTheme(input: $input, condition: $condition) {
      id
      name
      fields {
        id
        name
        type
        required
        options
        order
        __typename
      }
      notificationEnabled
      createdBy
      usageCount
      isDefault
      createdAt
      updatedAt
      favorites {
        nextToken
        __typename
      }
      sessions {
        nextToken
        __typename
      }
      savedData {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const createFavoriteTheme = /* GraphQL */ `
  mutation CreateFavoriteTheme(
    $input: CreateFavoriteThemeInput!
    $condition: ModelFavoriteThemeConditionInput
  ) {
    createFavoriteTheme(input: $input, condition: $condition) {
      id
      userId
      themeId
      addedAt
      user {
        id
        email
        displayName
        voiceInputSilenceTimeout
        language
        displayTheme
        createdAt
        updatedAt
        __typename
      }
      theme {
        id
        name
        notificationEnabled
        createdBy
        usageCount
        isDefault
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateFavoriteTheme = /* GraphQL */ `
  mutation UpdateFavoriteTheme(
    $input: UpdateFavoriteThemeInput!
    $condition: ModelFavoriteThemeConditionInput
  ) {
    updateFavoriteTheme(input: $input, condition: $condition) {
      id
      userId
      themeId
      addedAt
      user {
        id
        email
        displayName
        voiceInputSilenceTimeout
        language
        displayTheme
        createdAt
        updatedAt
        __typename
      }
      theme {
        id
        name
        notificationEnabled
        createdBy
        usageCount
        isDefault
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteFavoriteTheme = /* GraphQL */ `
  mutation DeleteFavoriteTheme(
    $input: DeleteFavoriteThemeInput!
    $condition: ModelFavoriteThemeConditionInput
  ) {
    deleteFavoriteTheme(input: $input, condition: $condition) {
      id
      userId
      themeId
      addedAt
      user {
        id
        email
        displayName
        voiceInputSilenceTimeout
        language
        displayTheme
        createdAt
        updatedAt
        __typename
      }
      theme {
        id
        name
        notificationEnabled
        createdBy
        usageCount
        isDefault
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createChatSession = /* GraphQL */ `
  mutation CreateChatSession(
    $input: CreateChatSessionInput!
    $condition: ModelChatSessionConditionInput
  ) {
    createChatSession(input: $input, condition: $condition) {
      id
      userId
      themeId
      title
      titleLocked
      status
      messageCount
      createdAt
      updatedAt
      messages {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const updateChatSession = /* GraphQL */ `
  mutation UpdateChatSession(
    $input: UpdateChatSessionInput!
    $condition: ModelChatSessionConditionInput
  ) {
    updateChatSession(input: $input, condition: $condition) {
      id
      userId
      themeId
      title
      titleLocked
      status
      messageCount
      createdAt
      updatedAt
      messages {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const deleteChatSession = /* GraphQL */ `
  mutation DeleteChatSession(
    $input: DeleteChatSessionInput!
    $condition: ModelChatSessionConditionInput
  ) {
    deleteChatSession(input: $input, condition: $condition) {
      id
      userId
      themeId
      title
      titleLocked
      status
      messageCount
      createdAt
      updatedAt
      messages {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const createChatMessage = /* GraphQL */ `
  mutation CreateChatMessage(
    $input: CreateChatMessageInput!
    $condition: ModelChatMessageConditionInput
  ) {
    createChatMessage(input: $input, condition: $condition) {
      id
      sessionId
      role
      content
      images
      isStreaming
      timestamp
      session {
        id
        userId
        themeId
        title
        titleLocked
        status
        messageCount
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateChatMessage = /* GraphQL */ `
  mutation UpdateChatMessage(
    $input: UpdateChatMessageInput!
    $condition: ModelChatMessageConditionInput
  ) {
    updateChatMessage(input: $input, condition: $condition) {
      id
      sessionId
      role
      content
      images
      isStreaming
      timestamp
      session {
        id
        userId
        themeId
        title
        titleLocked
        status
        messageCount
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteChatMessage = /* GraphQL */ `
  mutation DeleteChatMessage(
    $input: DeleteChatMessageInput!
    $condition: ModelChatMessageConditionInput
  ) {
    deleteChatMessage(input: $input, condition: $condition) {
      id
      sessionId
      role
      content
      images
      isStreaming
      timestamp
      session {
        id
        userId
        themeId
        title
        titleLocked
        status
        messageCount
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createStreamChunk = /* GraphQL */ `
  mutation CreateStreamChunk(
    $input: CreateStreamChunkInput!
    $condition: ModelStreamChunkConditionInput
  ) {
    createStreamChunk(input: $input, condition: $condition) {
      id
      sessionId
      messageId
      chunkIndex
      content
      isComplete
      timestamp
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateStreamChunk = /* GraphQL */ `
  mutation UpdateStreamChunk(
    $input: UpdateStreamChunkInput!
    $condition: ModelStreamChunkConditionInput
  ) {
    updateStreamChunk(input: $input, condition: $condition) {
      id
      sessionId
      messageId
      chunkIndex
      content
      isComplete
      timestamp
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteStreamChunk = /* GraphQL */ `
  mutation DeleteStreamChunk(
    $input: DeleteStreamChunkInput!
    $condition: ModelStreamChunkConditionInput
  ) {
    deleteStreamChunk(input: $input, condition: $condition) {
      id
      sessionId
      messageId
      chunkIndex
      content
      isComplete
      timestamp
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createSavedData = /* GraphQL */ `
  mutation CreateSavedData(
    $input: CreateSavedDataInput!
    $condition: ModelSavedDataConditionInput
  ) {
    createSavedData(input: $input, condition: $condition) {
      id
      themeId
      sessionId
      title
      content
      markdownContent
      images
      createdBy
      isDeleted
      deletedAt
      deletedBy
      createdAt
      updatedAt
      editHistory {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const updateSavedData = /* GraphQL */ `
  mutation UpdateSavedData(
    $input: UpdateSavedDataInput!
    $condition: ModelSavedDataConditionInput
  ) {
    updateSavedData(input: $input, condition: $condition) {
      id
      themeId
      sessionId
      title
      content
      markdownContent
      images
      createdBy
      isDeleted
      deletedAt
      deletedBy
      createdAt
      updatedAt
      editHistory {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const deleteSavedData = /* GraphQL */ `
  mutation DeleteSavedData(
    $input: DeleteSavedDataInput!
    $condition: ModelSavedDataConditionInput
  ) {
    deleteSavedData(input: $input, condition: $condition) {
      id
      themeId
      sessionId
      title
      content
      markdownContent
      images
      createdBy
      isDeleted
      deletedAt
      deletedBy
      createdAt
      updatedAt
      editHistory {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const createEditHistory = /* GraphQL */ `
  mutation CreateEditHistory(
    $input: CreateEditHistoryInput!
    $condition: ModelEditHistoryConditionInput
  ) {
    createEditHistory(input: $input, condition: $condition) {
      id
      dataId
      userId
      action
      changes
      snapshot
      timestamp
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateEditHistory = /* GraphQL */ `
  mutation UpdateEditHistory(
    $input: UpdateEditHistoryInput!
    $condition: ModelEditHistoryConditionInput
  ) {
    updateEditHistory(input: $input, condition: $condition) {
      id
      dataId
      userId
      action
      changes
      snapshot
      timestamp
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteEditHistory = /* GraphQL */ `
  mutation DeleteEditHistory(
    $input: DeleteEditHistoryInput!
    $condition: ModelEditHistoryConditionInput
  ) {
    deleteEditHistory(input: $input, condition: $condition) {
      id
      dataId
      userId
      action
      changes
      snapshot
      timestamp
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createNotification = /* GraphQL */ `
  mutation CreateNotification(
    $input: CreateNotificationInput!
    $condition: ModelNotificationConditionInput
  ) {
    createNotification(input: $input, condition: $condition) {
      id
      userId
      type
      title
      message
      relatedDataId
      relatedTeamId
      isRead
      createdAt
      ttl
      updatedAt
      __typename
    }
  }
`;
export const updateNotification = /* GraphQL */ `
  mutation UpdateNotification(
    $input: UpdateNotificationInput!
    $condition: ModelNotificationConditionInput
  ) {
    updateNotification(input: $input, condition: $condition) {
      id
      userId
      type
      title
      message
      relatedDataId
      relatedTeamId
      isRead
      createdAt
      ttl
      updatedAt
      __typename
    }
  }
`;
export const deleteNotification = /* GraphQL */ `
  mutation DeleteNotification(
    $input: DeleteNotificationInput!
    $condition: ModelNotificationConditionInput
  ) {
    deleteNotification(input: $input, condition: $condition) {
      id
      userId
      type
      title
      message
      relatedDataId
      relatedTeamId
      isRead
      createdAt
      ttl
      updatedAt
      __typename
    }
  }
`;
export const createNotificationSetting = /* GraphQL */ `
  mutation CreateNotificationSetting(
    $input: CreateNotificationSettingInput!
    $condition: ModelNotificationSettingConditionInput
  ) {
    createNotificationSetting(input: $input, condition: $condition) {
      id
      userId
      targetType
      targetId
      enabled
      updatedAt
      createdAt
      __typename
    }
  }
`;
export const updateNotificationSetting = /* GraphQL */ `
  mutation UpdateNotificationSetting(
    $input: UpdateNotificationSettingInput!
    $condition: ModelNotificationSettingConditionInput
  ) {
    updateNotificationSetting(input: $input, condition: $condition) {
      id
      userId
      targetType
      targetId
      enabled
      updatedAt
      createdAt
      __typename
    }
  }
`;
export const deleteNotificationSetting = /* GraphQL */ `
  mutation DeleteNotificationSetting(
    $input: DeleteNotificationSettingInput!
    $condition: ModelNotificationSettingConditionInput
  ) {
    deleteNotificationSetting(input: $input, condition: $condition) {
      id
      userId
      targetType
      targetId
      enabled
      updatedAt
      createdAt
      __typename
    }
  }
`;
