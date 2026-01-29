/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const searchSavedData = /* GraphQL */ `
  query SearchSavedData(
    $keyword: String!
    $themeId: ID
    $limit: Int
    $nextToken: String
  ) {
    searchSavedData(
      keyword: $keyword
      themeId: $themeId
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        __typename
      }
      nextToken
      totalCount
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getTeam = /* GraphQL */ `
  query GetTeam($id: ID!) {
    getTeam(id: $id) {
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
export const listTeams = /* GraphQL */ `
  query ListTeams(
    $filter: ModelTeamFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeams(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdBy
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getTeamMember = /* GraphQL */ `
  query GetTeamMember($id: ID!) {
    getTeamMember(id: $id) {
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
export const listTeamMembers = /* GraphQL */ `
  query ListTeamMembers(
    $filter: ModelTeamMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeamMembers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        teamId
        userId
        joinedAt
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getTheme = /* GraphQL */ `
  query GetTheme($id: ID!) {
    getTheme(id: $id) {
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
export const listThemes = /* GraphQL */ `
  query ListThemes(
    $filter: ModelThemeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listThemes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getFavoriteTheme = /* GraphQL */ `
  query GetFavoriteTheme($id: ID!) {
    getFavoriteTheme(id: $id) {
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
export const listFavoriteThemes = /* GraphQL */ `
  query ListFavoriteThemes(
    $filter: ModelFavoriteThemeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFavoriteThemes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        themeId
        addedAt
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getChatSession = /* GraphQL */ `
  query GetChatSession($id: ID!) {
    getChatSession(id: $id) {
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
export const listChatSessions = /* GraphQL */ `
  query ListChatSessions(
    $filter: ModelChatSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getChatMessage = /* GraphQL */ `
  query GetChatMessage($id: ID!) {
    getChatMessage(id: $id) {
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
export const listChatMessages = /* GraphQL */ `
  query ListChatMessages(
    $filter: ModelChatMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sessionId
        role
        content
        images
        isStreaming
        timestamp
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getStreamChunk = /* GraphQL */ `
  query GetStreamChunk($id: ID!) {
    getStreamChunk(id: $id) {
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
export const listStreamChunks = /* GraphQL */ `
  query ListStreamChunks(
    $filter: ModelStreamChunkFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStreamChunks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getSavedData = /* GraphQL */ `
  query GetSavedData($id: ID!) {
    getSavedData(id: $id) {
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
export const listSavedData = /* GraphQL */ `
  query ListSavedData(
    $filter: ModelSavedDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSavedData(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getEditHistory = /* GraphQL */ `
  query GetEditHistory($id: ID!) {
    getEditHistory(id: $id) {
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
export const listEditHistories = /* GraphQL */ `
  query ListEditHistories(
    $filter: ModelEditHistoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEditHistories(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getNotification = /* GraphQL */ `
  query GetNotification($id: ID!) {
    getNotification(id: $id) {
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
export const listNotifications = /* GraphQL */ `
  query ListNotifications(
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getNotificationSetting = /* GraphQL */ `
  query GetNotificationSetting($id: ID!) {
    getNotificationSetting(id: $id) {
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
export const listNotificationSettings = /* GraphQL */ `
  query ListNotificationSettings(
    $filter: ModelNotificationSettingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotificationSettings(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        targetType
        targetId
        enabled
        updatedAt
        createdAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const teamMembersByTeamIdAndJoinedAt = /* GraphQL */ `
  query TeamMembersByTeamIdAndJoinedAt(
    $teamId: ID!
    $joinedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTeamMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamMembersByTeamIdAndJoinedAt(
      teamId: $teamId
      joinedAt: $joinedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        teamId
        userId
        joinedAt
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const teamMembersByUserIdAndJoinedAt = /* GraphQL */ `
  query TeamMembersByUserIdAndJoinedAt(
    $userId: ID!
    $joinedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelTeamMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamMembersByUserIdAndJoinedAt(
      userId: $userId
      joinedAt: $joinedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        teamId
        userId
        joinedAt
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const themesByCreatedByAndCreatedAt = /* GraphQL */ `
  query ThemesByCreatedByAndCreatedAt(
    $createdBy: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelThemeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    themesByCreatedByAndCreatedAt(
      createdBy: $createdBy
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const favoriteThemesByUserIdAndAddedAt = /* GraphQL */ `
  query FavoriteThemesByUserIdAndAddedAt(
    $userId: ID!
    $addedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelFavoriteThemeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    favoriteThemesByUserIdAndAddedAt(
      userId: $userId
      addedAt: $addedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        themeId
        addedAt
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const favoriteThemesByThemeId = /* GraphQL */ `
  query FavoriteThemesByThemeId(
    $themeId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelFavoriteThemeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    favoriteThemesByThemeId(
      themeId: $themeId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        themeId
        addedAt
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const chatSessionsByUserIdAndUpdatedAt = /* GraphQL */ `
  query ChatSessionsByUserIdAndUpdatedAt(
    $userId: ID!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelChatSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    chatSessionsByUserIdAndUpdatedAt(
      userId: $userId
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const chatSessionsByThemeIdAndUpdatedAt = /* GraphQL */ `
  query ChatSessionsByThemeIdAndUpdatedAt(
    $themeId: ID!
    $updatedAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelChatSessionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    chatSessionsByThemeIdAndUpdatedAt(
      themeId: $themeId
      updatedAt: $updatedAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const chatMessagesBySessionIdAndTimestamp = /* GraphQL */ `
  query ChatMessagesBySessionIdAndTimestamp(
    $sessionId: ID!
    $timestamp: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelChatMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    chatMessagesBySessionIdAndTimestamp(
      sessionId: $sessionId
      timestamp: $timestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        sessionId
        role
        content
        images
        isStreaming
        timestamp
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const streamChunksBySessionIdAndChunkIndex = /* GraphQL */ `
  query StreamChunksBySessionIdAndChunkIndex(
    $sessionId: ID!
    $chunkIndex: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelStreamChunkFilterInput
    $limit: Int
    $nextToken: String
  ) {
    streamChunksBySessionIdAndChunkIndex(
      sessionId: $sessionId
      chunkIndex: $chunkIndex
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const savedDataByThemeIdAndCreatedAt = /* GraphQL */ `
  query SavedDataByThemeIdAndCreatedAt(
    $themeId: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSavedDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    savedDataByThemeIdAndCreatedAt(
      themeId: $themeId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const savedDataBySessionId = /* GraphQL */ `
  query SavedDataBySessionId(
    $sessionId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelSavedDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    savedDataBySessionId(
      sessionId: $sessionId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const savedDataByCreatedByAndCreatedAt = /* GraphQL */ `
  query SavedDataByCreatedByAndCreatedAt(
    $createdBy: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSavedDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    savedDataByCreatedByAndCreatedAt(
      createdBy: $createdBy
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const savedDataByCreatedAtAndId = /* GraphQL */ `
  query SavedDataByCreatedAtAndId(
    $createdAt: AWSDateTime!
    $id: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSavedDataFilterInput
    $limit: Int
    $nextToken: String
  ) {
    savedDataByCreatedAtAndId(
      createdAt: $createdAt
      id: $id
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const editHistoriesByDataIdAndTimestamp = /* GraphQL */ `
  query EditHistoriesByDataIdAndTimestamp(
    $dataId: ID!
    $timestamp: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelEditHistoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    editHistoriesByDataIdAndTimestamp(
      dataId: $dataId
      timestamp: $timestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const notificationsByUserIdAndCreatedAt = /* GraphQL */ `
  query NotificationsByUserIdAndCreatedAt(
    $userId: ID!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    notificationsByUserIdAndCreatedAt(
      userId: $userId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const notificationSettingsByUserId = /* GraphQL */ `
  query NotificationSettingsByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelNotificationSettingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    notificationSettingsByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        targetType
        targetId
        enabled
        updatedAt
        createdAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
