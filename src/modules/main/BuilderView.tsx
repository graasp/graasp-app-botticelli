import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UseTranslationResponse, useTranslation } from 'react-i18next';

import ConversationsViewIcon from '@mui/icons-material/Chat';
import ExchangesViewIcon from '@mui/icons-material/ChatBubble';
import SaveIcon from '@mui/icons-material/Save';
import ChatViewIcon from '@mui/icons-material/SettingsApplications';
import AssistantViewIcon from '@mui/icons-material/SmartToy';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Stack, Tab } from '@mui/material';

import { LocalContext, useLocalContext } from '@graasp/apps-query-client';

import { isEqual } from 'lodash';

import {
  AssistantsSettingsType,
  ChatSettingsType,
  ExchangesSettingsType,
} from '@/config/appSettings';
import {
  ASSISTANT_SAVE_BUTTON_CY,
  ASSISTANT_SETTINGS_TITLE_CY,
  BUILDER_VIEW_CY,
  CHAT_SAVE_BUTTON_CY,
  CHAT_SETTINGS_TITLE_CY,
  CONVERSATIONS_VIEW_TITLE_CY,
  EXCHANGE_SETTINGS_TITLE_CY,
} from '@/config/selectors';
import Conversations from '@/results/ConversationsView';

import AssistantsSettingsComponent from '../../settings/AssistantSettings';
import ChatSettingsComponent from '../../settings/ChatSettings';
import ExchangesSettingsComponent from '../../settings/ExchangesSettings';
import { SettingsContextType, useSettings } from '../context/SettingsContext';

// Enum to manage tab values
enum Tabs {
  ASSISTANT_VIEW = 'ASSISTANT_VIEW',
  CHAT_VIEW = 'CHAT_VIEW',
  EXCHANGES_VIEW = 'EXCHANGES_VIEW',
  CONVERSATIONS_VIEW = 'CONVERSATIONS_VIEW',
}

// Main component: BuilderView
const BuilderView: () => JSX.Element = (): JSX.Element => {
  const { permission }: LocalContext = useLocalContext();

  // Destructuring saved settings and save function from the custom useSettings hook
  const {
    assistants: assistantsSavedState,
    chat: chatSavedState,
    exchanges: exchangesSavedState,
    saveSettings,
  }: SettingsContextType = useSettings();

  // State to manage the current values of assistants, chat, and exchanges settings
  const [assistants, setAssistants]: [
    AssistantsSettingsType,
    Dispatch<SetStateAction<AssistantsSettingsType>>,
  ] = useState<AssistantsSettingsType>(assistantsSavedState);
  const [chat, setChat]: [
    ChatSettingsType,
    Dispatch<SetStateAction<ChatSettingsType>>,
  ] = useState<ChatSettingsType>(chatSavedState);
  const [exchanges, setExchanges]: [
    ExchangesSettingsType,
    Dispatch<SetStateAction<ExchangesSettingsType>>,
  ] = useState<ExchangesSettingsType>(exchangesSavedState);

  useEffect(
    (): void => setAssistants(assistantsSavedState),
    [assistantsSavedState],
  );
  useEffect((): void => setChat(chatSavedState), [chatSavedState]);
  useEffect(
    (): void => setExchanges(exchangesSavedState),
    [exchangesSavedState],
  );

  // Hook for translations
  const { t }: UseTranslationResponse<'translations', undefined> =
    useTranslation();

  const [expandedConversation, setExpandedConversation]: [
    number | null,
    Dispatch<SetStateAction<number | null>>,
  ] = useState<number | null>(null);

  // State to manage the active tab, initially set to the Assistant view
  const [activeTab, setActiveTab]: [Tabs, Dispatch<SetStateAction<Tabs>>] =
    useState<Tabs>(Tabs.ASSISTANT_VIEW);

  return (
    <div data-cy={BUILDER_VIEW_CY} data-info={`Builder as ${permission}`}>
      <Box p={2}>
        <TabContext value={activeTab}>
          <Stack direction="row" justifyContent="space-evenly">
            <TabList
              textColor="secondary"
              indicatorColor="secondary"
              onChange={(
                _: SyntheticEvent<Element, Event>,
                newTab: Tabs,
              ): void => setActiveTab(newTab)} // Update the active tab when a new tab is selected
              centered
            >
              <Tab
                value={Tabs.ASSISTANT_VIEW}
                label={t('SETTINGS.ASSISTANTS.TITLE')}
                icon={<AssistantViewIcon />}
                iconPosition="start"
                data-cy={ASSISTANT_SETTINGS_TITLE_CY}
              />
              <Tab
                value={Tabs.CHAT_VIEW}
                label={t('SETTINGS.CHAT.TITLE')}
                icon={<ChatViewIcon />}
                iconPosition="start"
                data-cy={CHAT_SETTINGS_TITLE_CY}
              />
              <Tab
                value={Tabs.EXCHANGES_VIEW}
                label={t('SETTINGS.EXCHANGES.TITLE')}
                icon={<ExchangesViewIcon />}
                iconPosition="start"
                data-cy={EXCHANGE_SETTINGS_TITLE_CY}
              />
            </TabList>
            <TabList
              textColor="primary"
              indicatorColor="primary"
              onChange={(
                _: SyntheticEvent<Element, Event>,
                newTab: Tabs,
              ): void => setActiveTab(newTab)} // Update the active tab when a new tab is selected
              centered
            >
              <Tab
                value={Tabs.CONVERSATIONS_VIEW}
                label={t('CONVERSATIONS.TITLE')}
                icon={<ConversationsViewIcon />}
                iconPosition="start"
                data-cy={CONVERSATIONS_VIEW_TITLE_CY}
              />
            </TabList>
          </Stack>
          <TabPanel value={Tabs.ASSISTANT_VIEW}>
            <Stack spacing={2}>
              <AssistantsSettingsComponent
                assistants={assistants} // Passing current assistant settings
                onChange={setAssistants}
              />
              <Box>
                <Button
                  startIcon={<SaveIcon />}
                  variant="contained"
                  onClick={(): void => saveSettings('assistants', assistants)}
                  disabled={useMemo(
                    (): boolean =>
                      // Disable if settings have not changed or list is empty
                      isEqual(assistantsSavedState, assistants) ||
                      assistants.assistantList.length === 0,
                    [assistants, assistantsSavedState],
                  )}
                  data-cy={ASSISTANT_SAVE_BUTTON_CY}
                >
                  {t('SETTINGS.SAVE_BTN')}
                </Button>
              </Box>
            </Stack>
          </TabPanel>
          <TabPanel value={Tabs.CHAT_VIEW}>
            <Stack spacing={2}>
              <ChatSettingsComponent chat={chat} onChange={setChat} />
              <Box>
                <Button
                  startIcon={<SaveIcon />}
                  variant="contained"
                  onClick={(): void => saveSettings('chat', chat)}
                  disabled={useMemo(
                    // Disable if settings have not changed
                    (): boolean => isEqual(chatSavedState, chat),
                    [chat, chatSavedState],
                  )}
                  data-cy={CHAT_SAVE_BUTTON_CY}
                >
                  {t('SETTINGS.SAVE_BTN')}
                </Button>
              </Box>
            </Stack>
          </TabPanel>
          <TabPanel value={Tabs.EXCHANGES_VIEW}>
            <Stack spacing={2}>
              <ExchangesSettingsComponent
                exchanges={exchanges} // Passing current exchanges settings
                onChange={setExchanges}
              />
              <Box>
                <Button
                  startIcon={<SaveIcon />}
                  variant="contained"
                  onClick={(): void => saveSettings('exchanges', exchanges)}
                  disabled={useMemo(
                    (): boolean =>
                      // Disable if settings have not changed or list is empty
                      isEqual(exchangesSavedState, exchanges) ||
                      exchanges.exchangeList.length === 0,
                    [exchanges, exchangesSavedState],
                  )}
                >
                  {t('SETTINGS.SAVE_BTN')}
                </Button>
              </Box>
            </Stack>
          </TabPanel>
          <TabPanel value={Tabs.CONVERSATIONS_VIEW}>
            <Conversations
              expandedConversation={expandedConversation}
              setExpandedConversation={setExpandedConversation}
            />
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
};
export default BuilderView;
