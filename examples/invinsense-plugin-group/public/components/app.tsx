import React, { useState, useEffect, useMemo, useRef, ChangeEvent } from 'react';
import { i18n } from '@osd/i18n';
import { FormattedMessage, I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router } from 'react-router-dom';

import {
  CustomItemAction,
  EuiButton,
  EuiHorizontalRule,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageHeader,
  EuiTitle,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiText,
  EuiBasicTableColumn,
  Criteria,
  EuiHealth,
  EuiSpacer,
  EuiIcon,
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiCheckableCard,
  EuiTextAlign,
  EuiInMemoryTable,
  EuiToolTip,
  EuiButtonIcon,
  EuiConfirmModal,
  EuiTextArea,
  EuiBadge,
  EuiLink,
  EuiCode,
  EuiToast,
  EuiCheckbox,
  EuiFieldSearch
} from '@elastic/eui';

import { htmlIdGenerator } from "@elastic/eui/lib/services"

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID, PLUGIN_NAME } from '../../common';
import GroupManager from './groupmanager';

interface GroupManagerAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}

export const GroupManagerApp = ({ basename, notifications, http, navigation }: GroupManagerAppDeps) => {
  const [isAuthorized, setIsAuthorized] = useState(true);

  const [authorizationModal, setAuthorizationModal] = useState(false);

  const radioName = htmlIdGenerator()();
  const [radio, setRadio] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);
  const [filterValue, setFilterValue] = useState<string>('');
  // const [isFirstLoad, setIsFirstLoad] = useState(true)


  function isAdminUser(data: any) {
    if (data.backend_roles.length > 0) {
      if (data.backend_roles.includes("admin") || data.backend_roles.includes("Wazuh_Admin")) {
        console.log("admin user")
      } else {
        setAuthorizationModal(true);
      }
    } else {
      setAuthorizationModal(true);
    }
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterValue(value);
    // Call your filterAgents function here, e.g., filterAgents('right', value);
  };

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    // Call your selectAgent function here, e.g., selectAgent('right', e.target);
  };

  const handleReload = () => {
    // Implement or call your reload function here, e.g., reload('left', '', true);
  };

  const handleCancel = () => {
    // Implement or call your cancelButton function here
  };

  const handleLoadMoreAgents = () => {
    // Implement or call your loadMoreAgents function here, e.g., loadMoreAgents('left');
  };

  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  function openAndCloseWindow(url: string | URL | undefined) {
    // window.location.href = `${globalUrl}`
    const newWindow = window.open(url);
    setTimeout(() => {
      if (newWindow) {
        // newWindow.location.reload();
      }
    }, 3000)

    setTimeout(() => {
      if (newWindow) {
        // newWindow.close();
        // location.reload();
      }
    }, 10000)
  }

  function redirectHome() {
    window.location.replace(`api/example/app/wazuh#/health-check`);
  }

  return (
    <>{isAuthorized ? <>
      <Router basename={basename}>
        <I18nProvider>
          <>
            <navigation.ui.TopNavMenu
              appName={PLUGIN_ID}
              showSearchBar={false}
              useDefaultBehaviors={false} />
            <EuiPage>
              <EuiPageBody component="main">
                <EuiPageHeader>
                  <EuiTitle size="l">
                    <h1>
                      <FormattedMessage
                        id="groupmanager.helloWorldText"
                        defaultMessage="Welcome to Group Manager Screen"
                        values={{ name: PLUGIN_NAME }} />
                    </h1>
                  </EuiTitle>
                </EuiPageHeader>
                <EuiPageContent>
                  <EuiPageContentHeader>
                    <EuiFlexGroup gutterSize="l" wrap>
                      <EuiFlexItem grow={false}>
                        <img
                          src="data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5NiA5NiI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNmZmY7fS5jbHMtMntmaWxsOm5vbmU7fS5jbHMtM3tmaWxsOiMyMjkwMjI7fS5jbHMtNHtmaWxsOiMwYTc1MzM7fS5jbHMtNXtmaWxsOiMwMzA7b3BhY2l0eTowLjU7aXNvbGF0aW9uOmlzb2xhdGU7fS5jbHMtNntmaWxsOiMwY2IwNGE7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT5JbnZpbnNlbnNlLWljb24tOTZ4OTY8L3RpdGxlPjxjaXJjbGUgY2xhc3M9ImNscy0xIiBjeD0iNDcuNDciIGN5PSI3My4yMyIgcj0iMTcuMzMiLz48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iNDguMDUgMTUuNzcgMzYuMDkgMCA0OC4wNSAxNS44NCA0OC4wNSAxNS43NyIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMyIgcG9pbnRzPSI0OC4wNSAxNS44NCAzNi4wOSAwIDEzLjMgMCA0OC4wNSA0Ni4yNyA1OS40OCAzMC44NSA0OC4wNSAxNS43NyA0OC4wNSAxNS44NCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtNCIgcG9pbnRzPSI1OS44MiAwIDQ4LjA1IDE1Ljc3IDU5LjQ4IDMwLjg1IDgyLjcgMCA1OS44MiAwIi8+PHBvbHlnb24gY2xhc3M9ImNscy01IiBwb2ludHM9IjQ5LjkxIDEzLjMxIDQ4LjA1IDE1Ljc3IDU5LjQ4IDMwLjg1IDYxLjY5IDI3Ljk2IDQ5LjkxIDEzLjMxIi8+PHBhdGggY2xhc3M9ImNscy02IiBkPSJNNDguMDUsNjEuNDZhMy44LDMuOCwwLDAsMC0zLjgxLDMuNzlWNjloNy42MlY2NS4yN2EzLjgsMy44LDAsMCwwLTMuNzktMy44MVoiLz48cGF0aCBjbGFzcz0iY2xzLTYiIGQ9Ik00OC4wNSw0Ni4zNEEyNC44MywyNC44MywwLDEsMCw3Mi44OCw3MS4xNywyNC44MywyNC44MywwLDAsMCw0OC4wNSw0Ni4zNFpNNTguODEsODEuNkEyLjgyLDIuODIsMCwwLDEsNTYsODQuMzlINDAuMDhhMi44LDIuOCwwLDAsMS0yLjc5LTIuNzlWNzJhMi44MywyLjgzLDAsMCwxLDIuNzktMi44MWguNDJWNjUuNWE3LjU5LDcuNTksMCwxLDEsMTUuMTcsMHYzLjcyaC40MmEyLjcyLDIuNzIsMCwwLDEsMi44LDIuNjRWNzJaIi8+PHBhdGggY2xhc3M9ImNscy02IiBkPSJNNDUuMzMsNzQuMTRhLjM0LjM0LDAsMCwxLS4wOS0uMjUuNTIuNTIsMCwwLDEsLjI2LS4zNWwxLjYyLTEuMzVhMS44MSwxLjgxLDAsMCwxLC45My0uMzRINDlhLjY0LjY0LDAsMCwxLC40Mi4xOC42LjYsMCwwLDEsLjE4LjQydjguMTNhLjY0LjY0LDAsMCwxLS4xOC40MmMtLjE3LjA5LS4yNi4xOC0uNDIuMThINDcuNzRhLjYyLjYyLDAsMCwxLS42LS42Vjc0LjIzbC0uNzUuNTljLS4wOS4wOS0uMTguMDktLjM0LjA5cy0uMTctLjA5LS4yNi0uMThaIi8+PC9zdmc+"
                          alt="Invinsense"
                          width={"40px"}
                          height={"40px"}
                        />
                      </EuiFlexItem>
                      <EuiFlexItem>
                        <EuiTitle>
                          <h2>
                            <FormattedMessage
                              id="groupmanager.congratulationsTitle"
                              defaultMessage="Group Management" />
                          </h2>
                        </EuiTitle>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiPageContentHeader>
                  <EuiPageContentBody>
                    <div className="App">
                      <GroupManager />
                    </div>
                  </EuiPageContentBody>
                </EuiPageContent>
                <EuiFlexGroup alignItems="center" justifyContent='center' >
                  <EuiFlexItem grow={false}>
                  </EuiFlexItem>
                  <EuiFlexItem grow={6}>
                    <EuiText color='subdued' size="s">
                      <EuiTextAlign textAlign="center">
                        Group Manager Plugin <small>v</small>1.0.3
                      </EuiTextAlign>
                    </EuiText>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiPageBody>
            </EuiPage>
          </>
        </I18nProvider>
      </Router>
    </> :
      <>
        <div>
          <EuiFlexGroup alignItems="center" justifyContent="spaceAround">
            <EuiFlexItem grow={true}>
              <EuiText>
                <EuiTextAlign textAlign="center">
                  Session timed out.
                </EuiTextAlign>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexGroup alignItems="center" justifyContent="spaceAround">
            <EuiFlexItem grow={false}>
              <EuiButton type="primary"
                color="primary"
                size="s"
                iconType="refresh"
                fill={true}
                // isDisabled={agent.agentStatus != 'active' ? true : false}
                onClick={() => { openAndCloseWindow(`api/example/app/wazuh#/health-check`); }}>
                <FormattedMessage id="SecurityEvents.buttonText" defaultMessage="Refresh plugin" />
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      </>
    }</>
  );
};
