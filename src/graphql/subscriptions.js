/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onStreamChunk = /* GraphQL */ `
  subscription OnStreamChunk($sessionId: ID!) {
    onStreamChunk(sessionId: $sessionId) {
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
export const onNewMessage = /* GraphQL */ `
  subscription OnNewMessage($sessionId: ID!) {
    onNewMessage(sessionId: $sessionId) {
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
export const onNewNotification = /* GraphQL */ `
  subscription OnNewNotification($userId: ID!) {
    onNewNotification(userId: $userId) {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
export const onCreateTeam = /* GraphQL */ `
  subscription OnCreateTeam($filter: ModelSubscriptionTeamFilterInput) {
    onCreateTeam(filter: $filter) {
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
export const onUpdateTeam = /* GraphQL */ `
  subscription OnUpdateTeam($filter: ModelSubscriptionTeamFilterInput) {
    onUpdateTeam(filter: $filter) {
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
export const onDeleteTeam = /* GraphQL */ `
  subscription OnDeleteTeam($filter: ModelSubscriptionTeamFilterInput) {
    onDeleteTeam(filter: $filter) {
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
export const onCreateTeamMember = /* GraphQL */ `
  subscription OnCreateTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
  ) {
    onCreateTeamMember(filter: $filter) {
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
export const onUpdateTeamMember = /* GraphQL */ `
  subscription OnUpdateTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
  ) {
    onUpdateTeamMember(filter: $filter) {
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
export const onDeleteTeamMember = /* GraphQL */ `
  subscription OnDeleteTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
  ) {
    onDeleteTeamMember(filter: $filter) {
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
export const onCreateTheme = /* GraphQL */ `
  subscription OnCreateTheme($filter: ModelSubscriptionThemeFilterInput) {
    onCreateTheme(filter: $filter) {
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
export const onUpdateTheme = /* GraphQL */ `
  subscription OnUpdateTheme($filter: ModelSubscriptionThemeFilterInput) {
    onUpdateTheme(filter: $filter) {
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
export const onDeleteTheme = /* GraphQL */ `
  subscription OnDeleteTheme($filter: ModelSubscriptionThemeFilterInput) {
    onDeleteTheme(filter: $filter) {
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
export const onCreateFavoriteTheme = /* GraphQL */ `
  subscription OnCreateFavoriteTheme(
    $filter: ModelSubscriptionFavoriteThemeFilterInput
  ) {
    onCreateFavoriteTheme(filter: $filter) {
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
export const onUpdateFavoriteTheme = /* GraphQL */ `
  subscription OnUpdateFavoriteTheme(
    $filter: ModelSubscriptionFavoriteThemeFilterInput
  ) {
    onUpdateFavoriteTheme(filter: $filter) {
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
export const onDeleteFavoriteTheme = /* GraphQL */ `
  subscription OnDeleteFavoriteTheme(
    $filter: ModelSubscriptionFavoriteThemeFilterInput
  ) {
    onDeleteFavoriteTheme(filter: $filter) {
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
export const onCreateChatSession = /* GraphQL */ `
  subscription OnCreateChatSession(
    $filter: ModelSubscriptionChatSessionFilterInput
  ) {
    onCreateChatSession(filter: $filter) {
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
export const onUpdateChatSession = /* GraphQL */ `
  subscription OnUpdateChatSession(
    $filter: ModelSubscriptionChatSessionFilterInput
  ) {
    onUpdateChatSession(filter: $filter) {
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
export const onDeleteChatSession = /* GraphQL */ `
  subscription OnDeleteChatSession(
    $filter: ModelSubscriptionChatSessionFilterInput
  ) {
    onDeleteChatSession(filter: $filter) {
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
export const onCreateChatMessage = /* GraphQL */ `
  subscription OnCreateChatMessage(
    $filter: ModelSubscriptionChatMessageFilterInput
  ) {
    onCreateChatMessage(filter: $filter) {
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
export const onUpdateChatMessage = /* GraphQL */ `
  subscription OnUpdateChatMessage(
    $filter: ModelSubscriptionChatMessageFilterInput
  ) {
    onUpdateChatMessage(filter: $filter) {
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
export const onDeleteChatMessage = /* GraphQL */ `
  subscription OnDeleteChatMessage(
    $filter: ModelSubscriptionChatMessageFilterInput
  ) {
    onDeleteChatMessage(filter: $filter) {
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
export const onCreateStreamChunk = /* GraphQL */ `
  subscription OnCreateStreamChunk(
    $filter: ModelSubscriptionStreamChunkFilterInput
  ) {
    onCreateStreamChunk(filter: $filter) {
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
export const onUpdateStreamChunk = /* GraphQL */ `
  subscription OnUpdateStreamChunk(
    $filter: ModelSubscriptionStreamChunkFilterInput
  ) {
    onUpdateStreamChunk(filter: $filter) {
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
export const onDeleteStreamChunk = /* GraphQL */ `
  subscription OnDeleteStreamChunk(
    $filter: ModelSubscriptionStreamChunkFilterInput
  ) {
    onDeleteStreamChunk(filter: $filter) {
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
export const onCreateSavedData = /* GraphQL */ `
  subscription OnCreateSavedData(
    $filter: ModelSubscriptionSavedDataFilterInput
  ) {
    onCreateSavedData(filter: $filter) {
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
export const onUpdateSavedData = /* GraphQL */ `
  subscription OnUpdateSavedData(
    $filter: ModelSubscriptionSavedDataFilterInput
  ) {
    onUpdateSavedData(filter: $filter) {
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
export const onDeleteSavedData = /* GraphQL */ `
  subscription OnDeleteSavedData(
    $filter: ModelSubscriptionSavedDataFilterInput
  ) {
    onDeleteSavedData(filter: $filter) {
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
export const onCreateEditHistory = /* GraphQL */ `
  subscription OnCreateEditHistory(
    $filter: ModelSubscriptionEditHistoryFilterInput
  ) {
    onCreateEditHistory(filter: $filter) {
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
export const onUpdateEditHistory = /* GraphQL */ `
  subscription OnUpdateEditHistory(
    $filter: ModelSubscriptionEditHistoryFilterInput
  ) {
    onUpdateEditHistory(filter: $filter) {
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
export const onDeleteEditHistory = /* GraphQL */ `
  subscription OnDeleteEditHistory(
    $filter: ModelSubscriptionEditHistoryFilterInput
  ) {
    onDeleteEditHistory(filter: $filter) {
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
export const onCreateNotification = /* GraphQL */ `
  subscription OnCreateNotification(
    $filter: ModelSubscriptionNotificationFilterInput
  ) {
    onCreateNotification(filter: $filter) {
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
export const onUpdateNotification = /* GraphQL */ `
  subscription OnUpdateNotification(
    $filter: ModelSubscriptionNotificationFilterInput
  ) {
    onUpdateNotification(filter: $filter) {
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
export const onDeleteNotification = /* GraphQL */ `
  subscription OnDeleteNotification(
    $filter: ModelSubscriptionNotificationFilterInput
  ) {
    onDeleteNotification(filter: $filter) {
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
export const onCreateNotificationSetting = /* GraphQL */ `
  subscription OnCreateNotificationSetting(
    $filter: ModelSubscriptionNotificationSettingFilterInput
  ) {
    onCreateNotificationSetting(filter: $filter) {
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
export const onUpdateNotificationSetting = /* GraphQL */ `
  subscription OnUpdateNotificationSetting(
    $filter: ModelSubscriptionNotificationSettingFilterInput
  ) {
    onUpdateNotificationSetting(filter: $filter) {
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
export const onDeleteNotificationSetting = /* GraphQL */ `
  subscription OnDeleteNotificationSetting(
    $filter: ModelSubscriptionNotificationSettingFilterInput
  ) {
    onDeleteNotificationSetting(filter: $filter) {
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
